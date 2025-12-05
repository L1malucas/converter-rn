# converter-rn

CLI tool to convert components between frameworks using Google Gemini AI.

## Features

### Ionic/Angular to React Native/Expo

- Converts Angular/Ionic components to React Native/Expo
- Separates styles into dedicated StyleSheet files
- Configurable component, dependency, and icon mappings

### React with Tailwind to Angular 19+

- Converts React components with Tailwind CSS to Angular 19+
- Preserves Tailwind classes inline
- Uses Angular 19+ modern syntax (@if, @for, signals)
- Uses Angular Material components
- Strict TypeScript typing (no any)
- Standalone components with inject() pattern

### General Features

- Powered by Google Gemini AI for intelligent conversion
- Validates converted components
- Encrypted API key storage
- Supports custom output directories
- Visual component tree display

## Installation

```bash
npm install -g converter-rn
```

## Prerequisites

- Node.js >= 14.0.0
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Usage

Navigate to your project directory and run:

```bash
converter-rn
```

Or using npx:

```bash
npx converter-rn
```

### First Time Setup

1. The CLI will create a `.converter-rn.config.json` file in your project directory
2. You'll be prompted to enter your Gemini API key
3. The key is encrypted and saved for future use

### Main Menu Options

- **Convert Component**: Choose conversion type and convert components
  - Ionic/Angular to React Native/Expo
  - React with Tailwind to Angular 19+
- **Validate Converted Components**: Check syntax and structure of converted files
  - React Native components validation
  - Angular components validation
- **Change Gemini API Key**: Update your Gemini API key
- **Exit**: Close the CLI

## Configuration

The `.converter-rn.config.json` file allows customization:

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
  "icons": {
    "library": "react-icons/fa",
    "mappings": {
      "add": "FaPlus",
      "arrow-back": "FaArrowLeft"
    }
  },
  "codeStyle": {
    "interfacePrefix": "I",
    "componentType": "React.FC",
    "strictMode": true
  }
}
```

## Output

### Ionic/Angular to React Native/Expo

For each converted component, two files are created:

- `ComponentName.tsx` - React Native component
- `ComponentName.styles.ts` - StyleSheet with all styles

### React to Angular 19+

For each converted component, two files are created:

- `component-name.component.ts` - Angular standalone component
- `component-name.component.html` - Angular template with Tailwind classes

## Conversion Rules

### Ionic/Angular to React Native/Expo

#### Component Mappings

| Ionic Component | React Native Equivalent |
| --------------- | ----------------------- |
| ion-button      | TouchableOpacity        |
| ion-content     | ScrollView              |
| ion-input       | TextInput               |
| ion-text        | Text                    |
| ion-card        | View                    |
| ion-list        | FlatList                |

#### Dependency Mappings

| Angular/Capacitor    | React Native/Expo                         |
| -------------------- | ----------------------------------------- |
| @angular/common/http | axios                                     |
| @capacitor/camera    | expo-camera                               |
| @capacitor/storage   | @react-native-async-storage/async-storage |

#### Style Conversion

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
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
```

### React to Angular 19+

#### Component Mappings

| React                        | Angular 19+                            |
| ---------------------------- | -------------------------------------- |
| useState                     | signal()                               |
| useEffect                    | effect() or lifecycle hooks            |
| useMemo                      | computed()                             |
| useContext                   | inject() service                       |
| {condition && <Component />} | @if (condition) { <Component /> }      |
| {items.map()}                | @for (item of items; track item.id) {} |
| className                    | class                                  |
| onClick                      | (click)                                |
| onChange                     | (change) or (input)                    |

#### Angular 19+ Modern Syntax

- Control Flow: @if, @for, @switch (NOT *ngIf, *ngFor)
- Signals: signal(), computed(), effect()
- Standalone: All components are standalone
- Dependency Injection: inject() function
- Inputs/Outputs: input(), output() functions
- Strict TypeScript: No 'any' type allowed
- Tailwind: Preserved inline in templates

## Validation

### React Native Validation

The validator checks:

- React imports present
- Component typed as React.FC
- Export statements exist
- Style files match imports
- StyleSheet.create() usage
- Basic syntax validation

### Angular Validation

The validator checks:

- @Component decorator present
- standalone: true configured
- Modern control flow (@if, @for, not *ngIf, *ngFor)
- No 'any' types
- Template file exists
- Component class exported
- Using signals and modern patterns
- Proper syntax (balanced brackets)

## Partial Outputs

If conversion fails or is incomplete, partial output is saved as `ComponentName.partial.txt` for debugging.

## Development

```bash
# Clone repository
git clone https://github.com/L1malucas/converter-rn.git

# Install dependencies
npm install

# Run locally
npm start
```

## Troubleshooting

### API Key Issues

- Verify your Gemini API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Delete `.converter-rn.config.json` and re-enter the key

### No Components Found

- Ensure you're in the correct directory
- For Ionic conversion: Components must follow Angular naming: `*.page.ts`, `*.page.html`
- For React conversion: Components must be `.tsx` or `.jsx` files

### Conversion Errors

- Check internet connection
- Review partial output files for errors
- Verify component files are readable

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a PR.

## Support

For issues and questions, please open an issue on [GitHub](https://github.com/L1malucas/converter-rn/issues).
