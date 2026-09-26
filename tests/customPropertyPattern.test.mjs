import assert from 'node:assert/strict';
import {
  describe, it,
} from 'node:test';

import { customPropertyPattern } from '@react-ui-org/stylelint-config/helpers';
import {
  compositions,
  findings,
  lintCode,
} from './helpers/lint.mjs';

const rule = 'custom-property-pattern';
const lintProperties = (names, prefixes) => lintCode(
  `:root {\n${names.map((name) => `    --${name}: 0;`).join('\n')}\n}\n`,
  compositions.scss,
  { [rule]: customPropertyPattern(prefixes) },
);

describe('customPropertyPattern', () => {
  it('accepts SUIT CSS and kebab-case with one of the prefixes', async () => {
    const result = await lintProperties([
      'rui-Button__color',
      'rui-Button--primary__color',
      'rui-Button--primary--hover__background-color',
      'rui-FormField--box--outline--default__box-shadow',
      'rui-FormField--check__input--toggle--default__background-image',
      'rui-color-primary',
      'rcm-local-card-padding',
    ], ['rui', 'rcm']);

    assert.deepEqual(result.warnings, []);
  });

  it('rejects a missing or another prefix and other cases', async () => {
    const names = [
      'color-primary',
      'foo-color-primary',
      'rui-fooBar',
      'rui-Button',
      'rui-button__color',
      'rui-Color-primary',
      'rui-color-',
      'rui-color--primary',
      'rui-Button__color-',
      'rui-Button-__color',
      'rui-Button__color--a--b--c',
    ];
    const result = await lintProperties(names, ['rui']);

    assert.deepEqual(findings(result), names.map((name, index) => [index + 2, rule]));
  });

  it('does not backtrack on a long name that does not match', () => {
    const pattern = new RegExp(customPropertyPattern(['rui'])[0]);
    const start = performance.now();

    ['rui-button-background-color-primary-hover-disabled-State', `rui-Button${'__a-b'.repeat(30)}X`]
      .forEach((name) => assert.equal(pattern.test(name), false));

    assert.ok(performance.now() - start < 100, 'Expected the names to be rejected in less than 100 ms');
  });

  it('leaves names with a Sass interpolation to Stylelint, which does not check them', async () => {
    const result = await lintProperties(['foo-#{$property}'], ['rui']);

    assert.deepEqual(result.warnings, []);
  });

  it('names the prefixes in the message', async () => {
    const result = await lintProperties(['foo'], ['rui', 'rcm']);

    assert.equal(
      result.warnings[0].text,
      `Expected custom property name "--foo" to start with "rui-" or "rcm-" and follow either SUIT CSS or kebab-case (${rule})`,
    );
  });

  it('refuses invalid prefixes', () => {
    [undefined, [], ['rui-'], ['Rui'], 'rui'].forEach((prefixes) => {
      assert.throws(() => customPropertyPattern(prefixes), TypeError);
    });
  });
});
