# CROW - Configurable React Operational Workspace

A highly flexible, TypeScript-powered data grid system for React that adapts to multiple display modes and use cases.

## Overview

CROW is a demonstration of a versatile data grid component that can be configured to display data in various formats:

- **Fullbleed Gallery Mode**: Borderless image grid with click handlers and modal support
- **Spreadsheet Mode**: Excel/Sheets-like interface with sortable headers and searchable data
- **Workflow/Planning Mode**: Editable cells for task management and planning applications  
- **Nested List Mode**: Hierarchical data display with collapsible sections
- **Custom Modes**: Fully extensible to support any custom data presentation needs

## Key Features

- 🎨 **Multiple Display Modes**: Switch between gallery, spreadsheet, workflow, and list views
- ⚡ **High Performance**: Virtual scrolling for large datasets
- 🔧 **Highly Configurable**: Declarative API for customizing every aspect
- 📊 **Data Agnostic**: Works with any JSON data source (API, mock, local)
- 💾 **Export Capability**: CSV export with extensible format support
- 🎭 **Smooth Animations**: Elegant transitions and user feedback
- 📝 **TypeScript First**: Full type safety and IntelliSense support
- ♿ **Accessible**: WCAG compliant with keyboard navigation

## Tech Stack

- **React 19** with hooks
- **TypeScript 5.9** for type safety
- **Vite** for fast development and building
- **CSS Custom Properties** for theming
- **Vitest** for testing

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see the demo application.

### Build

```bash
npm run build
```

### Test

```bash
npm run test
```

## Project Structure

```
src/
├── components/
│   ├── DataGrid/          # Core grid components
│   ├── features/          # Feature modules (sorting, editing, etc.)
│   └── demo/              # Demo pages
├── types/                 # TypeScript type definitions
├── services/              # Data providers and utilities
├── hooks/                 # Custom React hooks
├── utils/                 # Helper functions
└── data/                  # Mock data for demos
```

## Documentation

- [Architecture Guide](./ARCHITECTURE.md) - System design and technical decisions
- [Development Plan](./PLANNING.md) - Phased development roadmap
- API Documentation - Coming soon

## Usage Example

```typescript
import { DataGrid } from './components/DataGrid';
import type { GridConfig } from './types/grid.types';

const config: GridConfig<MyDataType> = {
  columns: [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'status', header: 'Status' }
  ],
  displayMode: 'spreadsheet',
  features: {
    sorting: { enabled: true },
    export: { formats: ['csv'] }
  }
};

function MyApp() {
  return <DataGrid config={config} dataProvider={myDataProvider} />;
}
```

## Development Status

Currently in **Phase 0** - Project setup and architecture planning.

See [PLANNING.md](./PLANNING.md) for detailed roadmap and progress.

## License

MIT

---

## ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
