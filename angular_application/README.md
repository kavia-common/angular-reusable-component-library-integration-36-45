# Angular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.1.

## Tailwind CSS

Tailwind is configured via `postcss.config.js` and `tailwind.config.js`. PrimeNG theme CSS imports remain first in `src/styles.css`, followed by Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) to ensure compatibility with PrimeNG.

- Content paths: `./src/**/*.{html,ts}`, `./src/index.html`
- Theme: extended using Ocean Professional tokens (primary `#2563EB`, secondary `#F59E0B`, background `#f9fafb`, surface `#ffffff`, text `#111827`)
- Example usage is present in `app.component.html` (utility classes on the nav and link).

If utilities are not applied at runtime, ensure dev dependencies are installed:
```
npm install
```
If you see a CLI message "Tailwind CSS configuration file found but the 'tailwindcss' package is not installed", install it:
```
npm i -D tailwindcss postcss autoprefixer
```

Note: In CI environments, make sure devDependencies are installed so Tailwind is present (CI should not use --omit=dev). Otherwise the build may log a Tailwind missing warning.

## Development server

To start a local development server (Vite dev server via Angular builder with custom vite.config.ts):
```bash
# Port precedence: PORT > NG_APP_PORT > default 4200
PORT=4200 ng serve --host 0.0.0.0
```
On startup you will see a diagnostic log like:
```
[vite-config] server.host=0.0.0.0, server.port=4200, allowedHosts=["localhost","127.0.0.1","[::1]","vscode-internal-22785-beta.beta01.cloud.kavia.ai","*"]
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
