const { GoogleGenAI } = require('@google/genai');
const { getApiKey } = require('../config/api-key');
const { readComponentFiles } = require('./reader');
const { buildPrompt } = require('./prompt-builder');
const { writeConvertedFiles, savePartialOutput } = require('./writer');
const { logInfo, logSuccess, logError, logWarning } = require('../utils/logger');

async function convertComponent(component, outputDir) {
  try {
    logInfo(`Reading component files...`);
    const files = await readComponentFiles(component);
    
    logInfo(`Building conversion prompt...`);
    const prompt = await buildPrompt(files);
    
    logInfo(`Calling Gemini API...`);
    const apiKey = await getApiKey();
    const genAI = new GoogleGenAI({ apiKey });
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    logInfo(`Parsing response...`);
    const parsed = parseResponse(text);
    
    if (!parsed.component || !parsed.styles) {
      logWarning('Incomplete response received, saving partial output...');
      await savePartialOutput(component, outputDir, text);
      return;
    }
    
    logInfo(`Writing converted files...`);
    await writeConvertedFiles(component, outputDir, parsed);
    
    logSuccess(`✓ ${component.name} converted successfully!`);
    
  } catch (error) {
    logError(`Failed to convert ${component.name}: ${error.message}`);
    await savePartialOutput(component, outputDir, error.message);
    throw error;
  }
}

function parseResponse(text) {
  const componentMatch = text.match(/===COMPONENT===\s*([\s\S]*?)(?:===STYLES===|$)/);
  const stylesMatch = text.match(/===STYLES===\s*([\s\S]*?)$/);
  
  return {
    component: componentMatch ? componentMatch[1].trim() : null,
    styles: stylesMatch ? stylesMatch[1].trim() : null
  };
}

module.exports = { convertComponent };