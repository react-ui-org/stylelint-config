import scssRules from '../rules/scss.mjs';

/*
 * The addition for SCSS, extended after the base config: `stylelint-config-standard-scss`, which
 * brings the `postcss-scss` syntax and the `stylelint-scss` plugin, and our adjustments of it.
 */
export default {
  extends: [
    'stylelint-config-standard-scss',
  ],
  rules: scssRules,
};
