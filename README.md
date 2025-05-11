# vue-package-json

This template helps you get started with Vue 3 in Vite, and demonstrates how to dynamically generate and use a `version.json` file containing your app's version and git info.

## Version Info POC: Dynamic version.json

This project includes a custom Vite plugin that:

- Reads version info from `package.json` and git (tag, commit hash, timestamp)
- Injects compile-time constants (`import.meta.env.APP_VERSION`, `import.meta.env.APP_TAG`)
- Serves `/version.json` dynamically during development
- Emits `dist/version.json` after build

### How to Use

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run in development:**
   ```sh
   npm run dev
   ```
   - Visit the app to see version info from both compile-time and runtime
   - Or visit `/version.json` directly in your browser
3. **Build for production:**
   ```sh
   npm run build
   ```
   - After build, `dist/version.json` will contain the version info
4. **Access version info in your app:**
   - **Compile-time:** Use `import.meta.env.APP_VERSION` and `import.meta.env.APP_TAG`
   - **Runtime:** Fetch `/version.json` (e.g., `fetch('/version.json')`)

---

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

[Documentation](https://deepwiki.com/alexanderop/vueNewVersion/1-overview)