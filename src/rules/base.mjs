/*
 * Rules added on top of `stylelint-config-standard` to keep the specificity low and the nesting
 * shallow. They apply to every stylesheet, CSS or SCSS.
 */
export default {
  // Except for utility classes and third-party overrides, `!important` can be avoided
  'declaration-no-important': true,
  'declaration-property-value-disallowed-list': [
    {
      // Background images are stored locally, an absolute URL loads them from another origin
      '/^background/': [String.raw`/url\(\s*['"]?\s*(https?:)?\/\//i`],
      /*
       * Only the properties that change are transitioned, so the browser can accelerate them.
       * `all` is matched as a whole word, so `var(--transition-small)` or `allow-discrete` pass.
       */
      '/^transition/': [String.raw`/(^|[\s,])all([\s,]|$)/i`],
    },
    {
      message: (property) => (property.toLowerCase().startsWith('background')
        ? `Expected "${property}" not to load an image from an absolute URL, store the image locally`
        : `Expected "${property}" not to transition all properties, list the ones that change`),
    },
  ],
  /*
   * Deep nesting is hard to read. An at-rule that only wraps rules, like `@media` around nested
   * rules, does not add a level. An at-rule with declarations, like `@media` or `@include` with a
   * block of declarations, does.
   */
  'max-nesting-depth': [
    2,
    {
      ignore: ['blockless-at-rules'],
    },
  ],
  // Keep the selector specificity as low as possible
  'selector-max-compound-selectors': 3,
  // In most cases, IDs are for JavaScript, not for CSS
  'selector-max-id': 0,
  'selector-max-specificity': '0,4,0',
  // Most of the time, we know which elements or classes we are targeting
  'selector-max-universal': 0,
  // In most cases, a qualifying type only increases the specificity needlessly
  'selector-no-qualifying-type': true,
};
