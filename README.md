# ionic-to-rn

CLI tool to convert Angular/Ionic components to React Native/Expo using AI.

## Features

- 🔄 Convert Ionic components to React Native
- 🎨 SCSS to StyleSheet conversion
- 🤖 AI-powered with Google Gemini
- 📁 Separate style files
- ✅ Component validation
- 🔐 Encrypted API key storage
- 📦 Ready for npm publishing

## Installation

```bash
npm install -g ionic-to-rn
```

## Usage

Navigate to your Angular/Ionic project directory and run:

```bash
ionic-to-rn
```

### First Run

1. Enter your Google Gemini API key (get one at https://makersuite.google.com/app/apikey)
2. Key will be encrypted and saved locally

### Converting Components

1. Select "Convert Component" from menu
2. Choose component from list
3. Select output location
4. Wait for conversion

### Output

For each component, two files are created:
- `ComponentName.tsx` - React Native component
- `ComponentName.styles.ts` - StyleSheet styles

## Configuration

Config file `.angular-to-rn.config.json` is created in your project directory:

```json
{
  "geminiApiKey": "encrypted-key",
  "outputDir": "./converted",
  "outputMode": "same-directory",
  "componentMappings": { ... },
  "codeStyle": {
    "interfacePrefix": "I",
    "componentType": "React.FC",
    "strictMode": true
  }
}
```

## Component Mappings

Default Ionic to React Native mappings:

- `ion-button` → `TouchableOpacity`
- `ion-content` → `ScrollView`
- `ion-input` → `TextInput`
- `ion-text` → `Text`
- And 50+ more...

## Requirements

- Node.js >= 14
- Google Gemini API key
- Angular/Ionic project with standard file structure

## License

MIT