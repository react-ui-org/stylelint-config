import {
  defineStylistic, rules as stylisticConfigRules,
} from '@stylistic/stylelint-config';

/*
 * Adjustments of `@stylistic/stylelint-config`, which brings back the stylistic rules removed from
 * Stylelint 16. Everything else is taken over as it is.
 *
 * The rules are named by their short names. `@stylistic/stylelint-plugin` registers every rule
 * once per syntax, `@stylistic/indentation` for plain CSS and `@stylistic/scss/indentation` for
 * SCSS, and `defineStylistic` names the adjustments under the namespace of the given syntax.
 */
const adjustments = {
  // Stylesheets are indented with 4 spaces, the same as in `.editorconfig` of our projects
  indentation: 4,
  // Dropped from `@stylistic/stylelint-config` 6, kept to check the code as before
  'no-multiple-whitespaces': true,
};

// The adjustments for plain CSS, under `@stylistic/`
export default defineStylistic({ rules: adjustments });

/*
 * The adjustments for SCSS, under `@stylistic/scss/`, for the `*.scss` files linted with the base
 * config, the same files `@stylistic/stylelint-config` sets its SCSS rules for.
 */
export const scssAdjustments = defineStylistic({
  rules: adjustments,
  syntax: 'scss',
});

/*
 * Every rule of `@stylistic/stylelint-config` with the adjustments, under `@stylistic/scss/`, for
 * the SCSS config. It parses every stylesheet with `postcss-scss`, a `.css` file or a snippet
 * without a file name included, which the rules under `@stylistic/` do not read.
 */
export const scssStylisticRules = defineStylistic({
  rules: {
    ...stylisticConfigRules,
    ...adjustments,
  },
  syntax: 'scss',
});
