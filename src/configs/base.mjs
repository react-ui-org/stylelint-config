import baseRules from '../rules/base.mjs';
import orderRules from '../rules/order.mjs';
import stylisticRules from '../rules/stylistic.mjs';

/*
 * The config for every stylesheet: `stylelint-config-standard` with stricter rules of our own,
 * the order of the content of declaration blocks and the stylistic rules.
 *
 * Configs and plugins are referenced by name, Stylelint resolves them from this file, so they come
 * from the dependencies of this package.
 */
export default {
  extends: [
    'stylelint-config-standard',
    '@stylistic/stylelint-config',
  ],
  plugins: [
    'stylelint-order',
  ],
  /*
   * A disable comment that does nothing is reported, the same as ESLint reports unused disable
   * directives. It catches comments left behind by a rule that was fixed, renamed or removed,
   * like `max-line-length`, which became `@stylistic/max-line-length`.
   */
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  rules: {
    ...baseRules,
    ...orderRules,
    ...stylisticRules,
  },
};
