/*
 * Essential compatibility with CSS Modules: camelCase class names and the `:global` pseudo-class.
 * Other CSS Modules features, like `composes`, `:local` or `@value`, are not recognized.
 */
export default {
  // Class names are read with the dot notation in JavaScript, so they are camelCase
  'selector-class-pattern': [
    '^([a-z][a-z0-9]*)([A-Z][a-z0-9]+)*$',
    {
      message: (selector) => `Expected class selector "${selector}" to be camelCase`,
    },
  ],
  // `:global()` produces a global class name
  'selector-pseudo-class-no-unknown': [
    true,
    {
      ignorePseudoClasses: ['global'],
    },
  ],
};
