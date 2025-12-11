const { GoogleGenAI } = require('@google/genai');
const { getApiKey } = require('../config/api-key');
const { readReactComponentFile } = require('./react-reader');
const { buildAngularPrompt } = require('./angular-prompt-builder');
const { writeAngularFiles, savePartialAngularOutput } = require('./angular-writer');
const { logInfo, logSuccess, logError, logWarning } = require('../utils/logger');
const { validateAIResponse } = require('../utils/prompt-sanitizer');

async function convertReactToAngular(component, outputDir) {
  logInfo(`\nStarting conversion for React component: ${component.name}...`);
  try {
    logInfo(`[1/5] Reading React component file...`);
    const files = await readReactComponentFile(component);
    logInfo(`  Found file: ${component.tsxFile}`);

    logInfo(`[2/5] Building conversion prompt...`);
    const prompt = await buildAngularPrompt(files);
    logInfo(`  Prompt created with a size of ${prompt.length} characters.`);

    logInfo(`[3/5] Calling Gemini API...`);
    logInfo(`  [/] Model: gemini-2.5-pro`);
    const apiKey = await getApiKey();
    const genAI = new GoogleGenAI({ apiKey });
    logInfo(`  [-] Sending request to Gemini...`);
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    logInfo(`  [\\] Response received.`);
    const text = result.candidates[0].content.parts[0].text;
    logInfo(`  Response received successfully (${text.length} characters).`);

    logInfo(`[4/5] Parsing response from Gemini...`);

    // Validate that response contains expected markers
    const expectedMarkers = ['===COMPONENT===', '===TEMPLATE==='];
    if (!validateAIResponse(text, expectedMarkers)) {
      logWarning('  Invalid response format from API. Saving partial output...');
      await savePartialAngularOutput(component, outputDir, text);
      return;
    }

    const parsed = parseAngularResponse(text);
    if (!parsed.component || !parsed.template) {
      logWarning('  Incomplete response from API. Saving partial output...');
      await savePartialAngularOutput(component, outputDir, text);
      return;
    }
    logInfo(`  Response parsed successfully.`);

    logInfo(`[5/5] Writing Angular files to ${outputDir}...`);
    await writeAngularFiles(component, outputDir, parsed);
    logInfo(`  Angular files written successfully.`);

    logSuccess(`\nConversion of ${component.name} completed successfully!`);

  } catch (error) {
    logError(`\nError converting ${component.name}:`);
    logError(error.message);
    await savePartialAngularOutput(component, outputDir, error.message);
    throw error;
  }
}

function parseAngularResponse(text) {
  const componentMatch = text.match(/===COMPONENT===\s*([\s\S]*?)(?:===TEMPLATE===|$)/);
  const templateMatch = text.match(/===TEMPLATE===\s*([\s\S]*?)$/);

  const component = componentMatch ? cleanupCode(componentMatch[1]) : null;
  const template = templateMatch ? cleanupCode(templateMatch[1]) : null;

  return {
    component,
    template
  };
}

function cleanupCode(code) {
  if (!code) return null;
  const lines = code.split('\n');
  if (lines[0].startsWith('```')) {
    lines.shift();
  }
  if (lines[lines.length - 1].startsWith('```')) {
    lines.pop();
  }
  return lines.join('\n').trim();
}

module.exports = { convertReactToAngular };
