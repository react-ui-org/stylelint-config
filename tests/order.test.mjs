import assert from 'node:assert/strict';
import {
  describe, it,
} from 'node:test';

import stylelint from 'stylelint';

import orderRules from '../src/rules/order.mjs';
import {
  compositions,
  findings,
  lintCode,
  lintCodeWithRules,
} from './helpers/lint.mjs';

const properties = orderRules['order/properties-order'];

// Descriptors of `@font-face` in the list, they are known only inside it
const fontFaceDescriptors = ['font-display', 'src'];

// Shorthands and their longhands, with the ones missing from Stylelint's reference data
const longhandsOfShorthands = new Map([
  ...stylelint.reference.longhandSubPropertiesOfShorthandProperties,
  ['text-wrap', new Set(['text-wrap-mode', 'text-wrap-style'])],
  ['white-space', new Set(['text-wrap-mode', 'white-space-collapse'])],
]);

describe('order', () => {
  describe('the list of properties', () => {
    it('has no duplicates', () => {
      const duplicates = properties.filter((property, index) => properties.indexOf(property) !== index);

      assert.deepEqual(duplicates, []);
    });

    it('has only properties known to Stylelint and not deprecated', async () => {
      const code = properties
        .map((property) => (fontFaceDescriptors.includes(property)
          ? `@font-face { ${property}: inherit; }`
          : `a { ${property}: inherit; }`))
        .join('\n');
      const result = await lintCodeWithRules(code, {
        'at-rule-descriptor-no-unknown': true,
        'property-no-deprecated': true,
        'property-no-unknown': true,
      });

      assert.deepEqual(result.warnings.map(({ text }) => text), []);
    });

    /*
     * A shorthand resets its longhands, so a longhand listed before it would be overridden once
     * `--fix` puts the declarations in the order of the list.
     */
    it('has every shorthand before its longhands', () => {
      const misplaced = properties.flatMap((shorthand, index) => [...longhandsOfShorthands.get(shorthand) ?? []]
        .filter((longhand) => properties.includes(longhand) && properties.indexOf(longhand) < index)
        .map((longhand) => `${longhand} before ${shorthand}`));

      assert.deepEqual(misplaced, []);
    });
  });

  it('accepts ordered content and properties', async () => {
    const code = [
      '.a {',
      '    --b: 1px;',
      '',
      '    position: relative;',
      '    display: flex;',
      '    padding: 1rem;',
      '    color: red;',
      '    transition: opacity 0.2s;',
      '',
      '    &:hover {',
      '        opacity: 0.5;',
      '    }',
      '}',
      '',
    ].join('\n');
    const result = await lintCode(code, compositions.css);

    assert.deepEqual(result.warnings, []);
  });

  it('reports unordered content and properties', async () => {
    const code = [
      '.a {',
      '    color: red;',
      '    display: flex;',
      '',
      '    &:hover {',
      '        opacity: 0.5;',
      '    }',
      '',
      '    padding: 1rem;',
      '}',
      '',
    ].join('\n');
    const result = await lintCode(code, compositions.css);

    assert.deepEqual(findings(result), [
      [3, 'order/properties-order'],
      [9, 'order/order'],
    ]);
  });
});
