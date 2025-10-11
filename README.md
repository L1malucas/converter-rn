# ionic-to-rn

CLI tool to convert Angular/Ionic components to React Native/Expo components using Google Gemini AI.

## Features

- 🔄 Converts Angular/Ionic components to React Native/Expo
- 🎨 Separates styles into dedicated StyleSheet files
- 🤖 Powered by Google Gemini AI for intelligent conversion
- ✅ Validates converted components
- 🔐 Encrypted API key storage
- ⚙️ Configurable component and dependency mappings
- 📦 Supports custom output directories
- 🌲 Visual component tree display

## Installation

```bash
npm install -g ionic-to-rn
```

## Prerequisites

- Node.js >= 14.0.0
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Usage

Navigate to your Angular/Ionic project directory and run:

```bash
ionic-to-rn
```

Or using npx:

```bash
npx ionic-to-rn
```

### First Time Setup

1. The CLI will create a `.ionic-to-rn.config.json` file in your project directory
2. You'll be prompted to enter your Gemini API key
3. The key is encrypted and saved for future use

### Main Menu Options

- **Convert Component**: Scan and convert Angular components to React Native
- **Validate Converted Components**: Check syntax and structure of converted files
- **Configure Settings**: Change API key or output directory
- **Exit**: Close the CLI

## Configuration

The `.ionic-to-rn.config.json` file allows customization:

```json
{
  "geminiApiKey": "encrypted-key",
  "outputDir": "./converted",
  "outputMode": "same-directory",
  "componentMappings": {
    "ion-button": "TouchableOpacity",
    "ion-content": "ScrollView"
  },
  "dependencyMappings": {
    "@angular/common/http": "axios",
    "@capacitor/camera": "expo-camera"
  },
  "codeStyle": {
    "interfacePrefix": "I",
    "componentType": "React.FC",
    "strictMode": true
  }
}
```

## Output

For each converted component, two files are created:

- `ComponentName.tsx` - React Native component
- `ComponentName.styles.ts` - StyleSheet with all styles

## Conversion Rules

### Component Mappings

| Ionic Component | React Native Equivalent |
|----------------|------------------------|
| ion-button | TouchableOpacity |
| ion-content | ScrollView |
| ion-input | TextInput |
| ion-text | Text |
| ion-card | View |
| ion-list | FlatList |

### Dependency Mappings

| Angular/Capacitor | React Native/Expo |
|------------------|-------------------|
| @angular/common/http | axios |
| @capacitor/camera | expo-camera |
| @capacitor/storage | @react-native-async-storage/async-storage |

### Style Conversion

SCSS/CSS is converted to React Native StyleSheet:

```scss
// SCSS
.container {
  background-color: #fff;
  padding: 10px 20px;
}
```

Becomes:

```typescript
// React Native
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20
  }
});
```

## Validation

The validator checks:

- ✓ React imports present
- ✓ Component typed as React.FC
- ✓ Export statements exist
- ✓ Style files match imports
- ✓ StyleSheet.create() usage
- ✓ Basic syntax validation

## Partial Outputs

If conversion fails or is incomplete, partial output is saved as `ComponentName.partial.txt` for debugging.

## Development

```bash
# Clone repository
git clone https://github.com/yourusername/ionic-to-rn.git

# Install dependencies
npm install

# Run locally
npm start
```

## Troubleshooting

### API Key Issues
- Verify your Gemini API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Delete `.ionic-to-rn.config.json` and re-enter the key

### No Components Found
- Ensure you're in the correct directory
- Components must follow Angular naming: `*.page.ts`, `*.page.html`

### Conversion Errors
- Check internet connection
- Review partial output files for errors
- Verify component files are readable

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a PR.

## Support

For issues and questions, please open an issue on [GitHub](https://github.com/yourusername/ionic-to-rn/issues).