import assert from 'node:assert/strict';
import {
  describe, it,
} from 'node:test';

import {
  assertHealthyConfig,
  compositions,
  findings,
  lintCode,
  lintFixture,
} from './helpers/lint.mjs';

describe('CSS Modules config', () => {
  it('accepts valid CSS Modules in SCSS', async () => {
    const result = await lintFixture('valid.module.scss', compositions.scssModules);

    assertHealthyConfig(result);
    assert.deepEqual(result.warnings, []);
  });

  it('accepts valid CSS Modules in CSS', async () => {
    const code = '.rootLarge {\n    padding: 1rem;\n}\n\n:global(.globalClassName) {\n    padding: 2rem;\n}\n';
    const result = await lintCode(code, compositions.cssModules);

    assertHealthyConfig(result);
    assert.deepEqual(result.warnings, []);
  });

  it('reports invalid CSS Modules', async () => {
    const result = await lintFixture('invalid.module.scss', compositions.scssModules);

    assertHealthyConfig(result);
    assert.deepEqual(findings(result), [
      [1, 'selector-class-pattern'],
      [5, 'selector-class-pattern'],
      [9, 'selector-pseudo-class-no-unknown'],
    ]);
  });

  it('overrides the kebab-case class names only when extended last', async () => {
    const code = '.rootLarge {\n    padding: 1rem;\n}\n';
    const [base, scss, cssModules] = compositions.scssModules;
    const result = await lintCode(code, [base, cssModules, scss]);

    assert.deepEqual(findings(result), [[1, 'selector-class-pattern']]);
  });
});
