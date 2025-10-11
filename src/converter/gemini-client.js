const { GoogleGenAI } = require('@google/genai');
const { getApiKey } = require('../config/api-key');
const { readComponentFiles } = require('./reader');
const { buildPrompt } = require('./prompt-builder');
const { writeConvertedFiles, savePartialOutput } = require('./writer');
const { logInfo, logSuccess, logError, logWarning } = require('../utils/logger');

async function convertComponent(component, outputDir) {
  logInfo(`\nStarting conversion for component: ${component.name}...`);
  try {
    logInfo(`[1/5] Reading component files...`);
    const files = await readComponentFiles(component);
    const filePaths = [component.htmlFile, component.scssFile, component.tsFile].filter(Boolean);
    logInfo(`  Found ${filePaths.length} files:`);
    filePaths.forEach(filePath => logInfo(`    - ${filePath}`));

    logInfo(`[2/5] Building conversion prompt...`);
    const prompt = await buildPrompt(files);
    logInfo(`  Prompt created with a size of ${prompt.length} characters.`);

    logInfo(`[3/5] Calling Gemini API...`);
    logInfo(`  [/] Model: gemini-2.5-pro`);
    const apiKey = await getApiKey();
    const genAI = new GoogleGenAI({ apiKey });
    logInfo(`  [-] Sending request to Gemini...`);
    const result = await genAI.models.generateContent({ model: "gemini-2.5-pro", contents: [{ role: "user", parts: [{ text: prompt }] }] });
    logInfo(`  [\\] Response received.`);
    logInfo('Result object: ' + JSON.stringify(result));
    const text = result.candidates[0].content.parts[0].text;
    logInfo('Text object: ' + text);
    logInfo(`  Response received successfully.`);

    logInfo(`[4/5] Parsing response from Gemini...`);
    const parsed = parseResponse(text);
    if (!parsed.component || !parsed.styles) {
      logWarning('  Incomplete response from API. Saving partial output...');
      await savePartialOutput(component, outputDir, text);
      return;
    }
    logInfo(`  Response parsed successfully.`);

    logInfo(`[5/5] Writing converted files to ${outputDir}...`);
    await writeConvertedFiles(component, outputDir, parsed);
    logInfo(`  Converted files written successfully.`);

    logSuccess(`\n✓ Conversion of ${component.name} completed successfully!`);

  } catch (error) {
    logError(`\n❌ Error converting ${component.name}:`);
    logError(error.message);
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