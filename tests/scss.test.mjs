import assert from 'node:assert/strict';
import {
  describe, it,
} from 'node:test';

import {
  assertHealthyConfig,
  compositions,
  findings,
  lintFixture,
} from './helpers/lint.mjs';

describe('SCSS config', () => {
  it('accepts valid SCSS', async () => {
    const result = await lintFixture('valid.scss', compositions.scss);

    assertHealthyConfig(result);
    assert.deepEqual(result.warnings, []);
  });

  it('reports invalid SCSS', async () => {
    const result = await lintFixture('invalid.scss', compositions.scss);

    assertHealthyConfig(result);
    assert.deepEqual(findings(result), [
      [3, 'scss/dollar-variable-pattern'],
      [4, 'scss/dollar-variable-pattern'],
      [6, 'scss/percent-placeholder-pattern'],
      [10, 'scss/at-function-pattern'],
      [14, 'scss/at-mixin-pattern'],
      [19, 'scss/at-mixin-argumentless-call-parentheses'],
      [21, 'selector-nested-pattern'],
      [25, 'selector-nested-pattern'],
      [33, 'scss/at-if-closing-brace-newline-after'],
      [33, 'scss/at-if-closing-brace-space-after'],
    ]);
    assert.equal(
      result.warnings.find(({ rule }) => rule === 'scss/dollar-variable-pattern').text,
      'Expected variable name "FOO" to be kebab-case, prefixed with "_" if private (scss/dollar-variable-pattern)',
    );
  });
});
