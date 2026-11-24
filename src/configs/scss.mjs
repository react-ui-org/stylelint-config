import scssRules from '../rules/scss.mjs';
import { scssStylisticRules } from '../rules/stylistic.mjs';

/*
 * The addition for SCSS, extended after the base config: `stylelint-config-standard-scss`, which
 * brings the `postcss-scss` syntax and the `stylelint-scss` plugin, the stylistic rules for SCSS
 * and our adjustments of them.
 */
export default {
  extends: [
    'stylelint-config-standard-scss',
  ],
  rules: {
    ...scssStylisticRules,
    ...scssRules,
  },
};
