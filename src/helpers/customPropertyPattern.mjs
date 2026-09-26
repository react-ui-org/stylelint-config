/*
 * Every part is written so that a name can be matched in one way only. Nested quantifiers that can
 * split the same text in many ways, like `([a-z0-9]+-?)+`, backtrack exponentially on a name that
 * does not match, and a single such name could block the linter for minutes.
 */

// kebab-case for design tokens and local properties, e.g. `color-primary`
const kebabCase = '[a-z0-9]+(-[a-z0-9]+)*';

// SUIT CSS for theming of components, e.g. `Button--primary__color`, derived from the BEM pattern
// (https://gist.github.com/Potherca/f2a65491e63338659c3a0d2b07eee382): a component with optional
// modifiers, then one or more elements, each with up to two modifiers
const suitCss = `[A-Z][A-Za-z0-9]*(--?[A-Za-z0-9]+)*(__${kebabCase}(--${kebabCase}){0,2})+`;

const prefixPattern = /^[a-z][a-z0-9]*$/;

/**
 * Returns the `custom-property-pattern` setting that requires a custom property name to start
 * with one of the prefixes and follow either SUIT CSS or kebab-case, which is how React UI names
 * its custom properties.
 *
 * @param {string[]} prefixes Prefixes without the trailing hyphen, e.g. `['rui']`
 * @returns {[string, { message: (name: string) => string }]}
 */
export const customPropertyPattern = (prefixes) => {
  if (!Array.isArray(prefixes) || prefixes.length === 0 || !prefixes.every((prefix) => prefixPattern.test(prefix))) {
    throw new TypeError(`Expected prefixes to be a non-empty array of lowercase words, got ${JSON.stringify(prefixes)}`);
  }

  const allowedPrefixes = prefixes.map((prefix) => `"${prefix}-"`).join(' or ');

  return [
    `^(${prefixes.join('|')})-(${suitCss}|${kebabCase})$`,
    {
      message: (name) => `Expected custom property name "${name}" to start with ${allowedPrefixes} and follow either SUIT CSS or kebab-case`,
    },
  ];
};
