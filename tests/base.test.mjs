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

describe('base config', () => {
  it('accepts valid CSS', async () => {
    const result = await lintFixture('valid.css', compositions.css);

    assertHealthyConfig(result);
    assert.deepEqual(result.warnings, []);
  });

  it('reports invalid CSS', async () => {
    const result = await lintFixture('invalid.css', compositions.css);

    assertHealthyConfig(result);
    assert.deepEqual(findings(result), [
      [5, 'at-rule-prelude-no-invalid'],
      [5, 'custom-media-pattern'],
      [8, 'custom-property-pattern'],
      [11, 'keyframes-name-pattern'],
      [15, 'selector-class-pattern'],
      [19, 'selector-id-pattern'],
      [19, 'selector-max-id'],
      [19, 'selector-max-specificity'],
      [26, 'layer-name-pattern'],
      [31, 'layer-name-pattern'],
    ]);
  });

  describe('keeps specificity low and nesting shallow', () => {
    it('rejects `!important`', async () => {
      const result = await lintCode('a {\n    color: red !important;\n}\n', compositions.css);

      assert.deepEqual(findings(result), [[2, 'declaration-no-important']]);
    });

    it('rejects qualifying, universal and too many compound selectors', async () => {
      const code = [
        'a.foo {\n    color: red;\n}\n',
        '.foo * {\n    color: red;\n}\n',
        '.foo .bar .baz .qux {\n    color: red;\n}\n',
        '.a.b.c.d.e {\n    color: red;\n}\n',
      ].join('\n');
      const result = await lintCode(code, compositions.css);

      assert.deepEqual(findings(result), [
        [1, 'selector-no-qualifying-type'],
        [5, 'selector-max-universal'],
        [9, 'selector-max-compound-selectors'],
        [13, 'selector-max-specificity'],
      ]);
    });

    it('rejects nesting deeper than 2 levels', async () => {
      const code = '.a {\n    & .b {\n        & .c {\n            & .d {\n                color: red;\n            }\n        }\n    }\n}\n';
      const result = await lintCode(code, compositions.css);

      assert.deepEqual(findings(result, 'max-nesting-depth'), [[4, 'max-nesting-depth']]);
    });

    it('counts an at-rule with declarations as a level, but not one that only wraps rules', async () => {
      const code = [
        '.a {\n    & .b {\n        @media (width >= 10em) {\n            & .c {\n                color: red;\n            }\n        }\n    }\n}\n',
        '.a {\n    & .b {\n        & .c {\n            @media (width >= 10em) {\n                color: red;\n            }\n        }\n    }\n}\n',
      ].join('\n');
      const result = await lintCode(code, compositions.css);

      assert.deepEqual(findings(result, 'max-nesting-depth'), [[14, 'max-nesting-depth']]);
    });
  });

  describe('rejects absolute URLs of background images', () => {
    const rule = 'declaration-property-value-disallowed-list';

    it('rejects an absolute URL', async () => {
      const code = [
        '.a {\n    background-image: url("https://example.com/a.png");\n}\n',
        '.b {\n    background: url(http://example.com/b.png) no-repeat;\n}\n',
        '.c {\n    background-image: url("//example.com/c.png");\n}\n',
      ].join('\n');
      const result = await lintCode(code, compositions.css);

      assert.deepEqual(findings(result, rule), [[2, rule], [6, rule], [10, rule]]);
      assert.match(result.warnings[0].text, /^Expected "background-image" not to load an image from an absolute URL/);
    });

    it('accepts a local URL and a data URI containing an absolute URL', async () => {
      const code = [
        '.a {\n    background-image: url("images/a.png");\n}\n',
        '.b {\n    background-image: url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'/>");\n}\n',
      ].join('\n');
      const result = await lintCode(code, compositions.css);

      assert.deepEqual(findings(result, rule), []);
    });
  });

  describe('rejects transitioning all properties', () => {
    const rule = 'declaration-property-value-disallowed-list';

    it('rejects `all`', async () => {
      const code = [
        '.a {\n    transition: all 0.2s;\n}\n',
        '.b {\n    transition: opacity 0.2s, ALL 1s;\n}\n',
        '.c {\n    transition-property: all;\n}\n',
      ].join('\n');
      const result = await lintCode(code, compositions.css);

      assert.deepEqual(findings(result, rule), [[2, rule], [6, rule], [10, rule]]);
      assert.match(result.warnings[0].text, /^Expected "transition" not to transition all properties/);
    });

    it('accepts `all` inside other words', async () => {
      const code = [
        '.a {\n    transition: var(--transition-small);\n}\n',
        '.b {\n    transition-behavior: allow-discrete;\n}\n',
      ].join('\n');
      const result = await lintCode(code, compositions.css);

      assert.deepEqual(findings(result, rule), []);
    });
  });

  describe('includes the stylistic rules', () => {
    it('requires 4 spaces and double quotes', async () => {
      const result = await lintCode('a::after {\n  content: \'a\';\n}\n', compositions.css);

      assert.deepEqual(findings(result), [
        [2, '@stylistic/indentation'],
        [2, '@stylistic/string-quotes'],
      ]);
    });
  });

  describe('reports disable comments that do nothing', () => {
    it('reports a disable comment of a rule that is not enabled', async () => {
      const code = 'a {\n    /* stylelint-disable-next-line max-line-length */\n    color: red;\n}\n';
      const result = await lintCode(code, compositions.css);

      assert.deepEqual(findings(result), [
        [2, '--report-invalid-scope-disables'],
        [2, '--report-needless-disables'],
      ]);
    });

    it('reports a disable comment with no problem to disable', async () => {
      const code = 'a {\n    /* stylelint-disable-next-line declaration-no-important */\n    color: red;\n}\n';
      const result = await lintCode(code, compositions.css);

      assert.deepEqual(findings(result), [[2, '--report-needless-disables']]);
    });

    it('accepts a disable comment of a reported problem', async () => {
      const code = 'a {\n    /* stylelint-disable-next-line declaration-no-important */\n    color: red !important;\n}\n';
      const result = await lintCode(code, compositions.css);

      assert.deepEqual(result.warnings, []);
    });
  });
});
