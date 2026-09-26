// Private functions, mixins, placeholders and variables are prefixed with `_` instead of `-`
const kebabCaseWithPrivatePrefix = '^(_?[a-z][a-z0-9]*)(-[a-z0-9]+)*$';

/*
 * Adjustments of `stylelint-config-standard-scss` and of the base config for SCSS.
 */
export default {
  /*
   * `stylelint-config-standard-scss` leaves the closing brace of `@if` and `@else` to its own
   * `scss/at-if-closing-brace-*` and `scss/at-else-closing-brace-*` rules, which keep `} @else {`
   * on one line. The stylistic rule would require a newline there.
   */
  '@stylistic/block-closing-brace-newline-after': [
    'always',
    {
      ignoreAtRules: ['if', 'else'],
    },
  ],
  /*
   * `stylelint-config-recommended-scss` turns the core rule off in favour of
   * `scss/comment-no-empty`. The core rule checks only block comments, so it is restored for them.
   */
  'comment-no-empty': true,
  'scss/at-function-pattern': [
    kebabCaseWithPrivatePrefix,
    {
      message: (name) => `Expected function name "${name}" to be kebab-case, prefixed with "_" if private`,
    },
  ],
  // A mixin is always included the same way, with or without arguments
  'scss/at-mixin-argumentless-call-parentheses': 'always',
  'scss/at-mixin-pattern': [
    kebabCaseWithPrivatePrefix,
    {
      message: (name) => `Expected mixin name "${name}" to be kebab-case, prefixed with "_" if private`,
    },
  ],
  // Empty `//` lines structure blocks of double-slash comments
  'scss/comment-no-empty': null,
  // Variables can be grouped using empty lines
  'scss/dollar-variable-empty-line-before': null,
  'scss/dollar-variable-pattern': [
    kebabCaseWithPrivatePrefix,
    {
      message: (name) => `Expected variable name "${name}" to be kebab-case, prefixed with "_" if private`,
    },
  ],
  // Multi-line expressions are easier to read with the operator at the start of the line
  'scss/operator-no-newline-before': null,
  'scss/percent-placeholder-pattern': [
    kebabCaseWithPrivatePrefix,
    {
      message: (name) => `Expected placeholder name "${name}" to be kebab-case, prefixed with "_" if private`,
    },
  ],
  // Only pseudo-classes and pseudo-elements can be nested, which keeps the selectors flat
  'selector-nested-pattern': [
    '^&:',
    {
      message: (selector) => `Expected nested selector "${selector}" to be a pseudo-class or a pseudo-element of "&"`,
    },
  ],
};
