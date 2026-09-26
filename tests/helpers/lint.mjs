import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import stylelint from 'stylelint';

const packageRoot = fileURLToPath(new URL('../..', import.meta.url));

/*
 * The configs are extended by the package name, the same way projects do. Node resolves the name
 * to this package through its own `exports`, so the tests cover what is published.
 */
export const configs = {
  base: '@react-ui-org/stylelint-config',
  cssModules: '@react-ui-org/stylelint-config/cssModules',
  scss: '@react-ui-org/stylelint-config/scss',
};

// The compositions projects use, in the documented order
export const compositions = {
  css: [configs.base],
  cssModules: [configs.base, configs.cssModules],
  scss: [configs.base, configs.scss],
  scssModules: [configs.base, configs.scss, configs.cssModules],
};

const lint = async (options, config) => {
  const { results: [result] } = await stylelint.lint({
    config,
    configBasedir: packageRoot,
    ...options,
  });

  return result;
};

// Lints a file from `tests/fixtures` with the given composition
export const lintFixture = (name, composition) => lint(
  { files: [fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url))] },
  { extends: composition },
);

// Lints a snippet with the given composition, optionally with project rules on top of it
export const lintCode = (code, composition, rules = {}) => lint({ code }, {
  extends: composition,
  rules,
});

// Lints a snippet with a config of core rules only, to ask Stylelint itself about the code
export const lintCodeWithRules = (code, rules) => lint({ code }, { rules });

// `[line, rule]` pairs of the warnings, sorted, optionally of the given rule only
export const findings = (result, rule) => result.warnings
  .filter((warning) => rule === undefined || warning.rule === rule)
  .map((warning) => [warning.line, warning.rule])
  .sort(([lineA, ruleA], [lineB, ruleB]) => lineA - lineB || ruleA.localeCompare(ruleB));

// The config resolved without problems: no invalid option, no deprecated or unknown rule
export const assertHealthyConfig = (result) => {
  assert.deepEqual(result.invalidOptionWarnings, []);
  assert.deepEqual(result.deprecations, []);
  assert.deepEqual(result.parseErrors, []);
  assert.deepEqual(
    result.warnings.filter(({ text }) => text.startsWith('Unknown rule')),
    [],
  );
};
