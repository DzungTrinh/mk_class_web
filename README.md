# UserManagementFe

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.2.

## Development server

To start a local development server, run:

```bash
ng serve
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

# Angular Repository Structure

- **src/**
  - **app/**
    - **core/**: Singleton services, guards, interceptors
      - **auth/**: Auth service, interceptors, etc.
      - **interceptors/**
      - **guards/**
      - **core.module.ts**: (if using NgModule for legacy parts)
    - **shared/**: Reusable components, directives, pipes
      - **components/**: (e.g. Button, Card, InputField)
      - **directives/**
      - **pipes/**
      - **shared.module.ts**: (optional if not using standalone)
    - **features/**: Feature-based modules/screens
      - **auth/**: Login, register, email verification
        - **login/**
          - **login.component.ts**
          - **login.component.html**
          - **login.component.css**
          - **route.ts**: standalone route
        - **register/**: …
        - **auth.routes.ts**
      - **profile/**: Profile management
      - **mfa/**: MFA setup + verification
      - **roles/**: Admin role management
      - **permissions/**: Admin permission management
      - **…**
    - **layout/**: Global layout components
      - **header/**
      - **sidebar/**
      - **layout.component.ts**
    - **app.routes.ts**: Top-level routes
    - **app.component.ts**: Root component
    - **app.config.ts**: Standalone AppConfig
  - **assets/**: Static assets (e.g. logo, icons)
  - **environments/**: environment.ts, environment.prod.ts
  - **index.html**
  - **main.ts**
  - **styles.css**: Global styles