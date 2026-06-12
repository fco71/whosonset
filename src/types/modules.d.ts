// src/types/modules.d.ts
    declare module '*.module.css' {
      const classes: { [key: string]: string };
      export default classes;
    }

    declare module '*.module.scss' {
      const classes: { [key: string]: string };
      export default classes;
    }

    declare module '*.module.sass' {
      const classes: { [key: string]: string };
      export default classes;
    }

    // Plain (non-module) stylesheets are imported for side effects only
    // (e.g. `import './ScreenplayViewer.scss'`, react-pdf's layer CSS).
    // Newer TypeScript (noUncheckedSideEffectImports / TS2882 in editors)
    // requires these ambient declarations; the *.module.* patterns above
    // stay more specific and keep their typed default export.
    declare module '*.css';
    declare module '*.scss';
    declare module '*.sass';