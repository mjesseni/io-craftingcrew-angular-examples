# Angular Best Practices Project

## Overview

This project serves as a sample Angular application demonstrating best practices for building scalable, maintainable, and performant Angular applications. The project utilizes Angular 19 and incorporates state management using NgRx.

## Features

- **State Management:** Centralized state management with NgRx for predictable state transitions.
- **Modular Architecture:** Feature modules for better code organization and lazy loading.
- **Reusable Components:** Encapsulation of logic and design for reuse across the application.
- **Unit Testing:** Comprehensive test coverage for components, services, and state management.
- **Reactive Programming:** Use of RxJS for handling asynchronous data streams efficiently.
- **Accessibility (A11y):** Components follow accessibility standards for inclusive design.
- **Performance Optimization:** Strategies like OnPush change detection and lazy loading.

## Project Structure

```text
src/
├── app/
│   ├── core/          # Core module for singleton services
│   ├── shared/        # Shared module for reusable components and utilities
│   ├── features/      # Feature modules (e.g., dashboard, users)
│   ├── state/         # State management files (actions, reducers, effects, selectors)
│   └── app.module.ts  # Root module
├── assets/            # Static assets (images, styles)
├── environments/      # Environment-specific configurations
├── index.html         # Main HTML file
└── main.ts            # Application entry point
```

## Technologies Used

- **Angular 19**: The latest Angular framework for building SPA applications.
- **NgRx**: State management library for managing application state.
- **RxJS**: Reactive programming library.
- **Angular Material**: UI component library for a modern look and feel.
- **ESLint**: Static code analysis tool to enforce coding standards.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Angular CLI (v15 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mjesseni/io-craftingcrew-angular-examples.git
   cd angular-best-practices
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200`.

## Best Practices Demonstrated

1. **State Management**:
    - Using NgRx for managing application state.
    - Feature-based state slices for modularity.

2. **Component Design**:
    - Use of standalone and reusable components.
    - OnPush change detection for performance.

3. **Testing**:
    - Unit tests with Jasmine and Karma.
    - Mocking state and services for isolated tests.

4. **Code Quality**:
    - Strict TypeScript configurations.
    - ESLint for linting and Prettier for code formatting.

5. **Performance**:
    - Lazy loading of modules.
    - Optimization of RxJS operators for handling streams efficiently.

6. **Styling**:
    - Use of PrimeNG & TailwindCSS for consistent UI.
    - SCSS for modular and reusable styles.

7. **Accessibility**:
    - Focus on keyboard navigation and screen reader support.

## Scripts

- `ng serve`: Run the application in development mode.
- `ng build`: Build the application for production.
- `ng test`: Run unit tests.
- `ng lint`: Lint the codebase.
- `ng e2e`: Run end-to-end tests.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add a new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Create a pull request.

## License

This project is licensed under the Apache Version 2.0 License. See the LICENSE file for details.

## Contact

For any questions or feedback, please reach out to me [Mail](mailto:markus.jessenitschnig@smarter-software.com).
You can also find me on [LinkedIn](https://www.linkedin.com/in/markus-jessenitschnig-190a6812a/)
