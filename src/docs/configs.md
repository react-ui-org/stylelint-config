# Configs

| Config                                      | Applies to       | Purpose                                              |
|---------------------------------------------|------------------|------------------------------------------------------|
| `@react-ui-org/stylelint-config`            | every stylesheet | Standard rules, low specificity, order, stylistic    |
| `@react-ui-org/stylelint-config/scss`       | SCSS projects    | SCSS syntax and rules, our naming and nesting        |
| `@react-ui-org/stylelint-config/cssModules` | CSS Modules      | camelCase class names and the `:global` pseudo-class |

A CSS project extends the first one, an SCSS project the first two, an SCSS
project with CSS Modules all three:

```js
export default {
  extends: [
    '@react-ui-org/stylelint-config',
    '@react-ui-org/stylelint-config/scss',
    '@react-ui-org/stylelint-config/cssModules',
  ],
};
```

## Order matters

Stylelint merges the extended configs one by one, the last one that sets a rule
wins, so the order above is part of the contract.

* `scss` extends `stylelint-config-standard-scss`, which extends
  `stylelint-config-standard` again. Extended **before** the base config, it
  would let the base config override its SCSS adjustments.
* `cssModules` replaces the kebab-case `selector-class-pattern` of
  `stylelint-config-standard` with camelCase. Extended **before** `scss`, it is
  **silently** overridden by the kebab-case pattern again. If a rule behaves
  oddly, check the resolved config with `npx stylelint --print-config <file>`.

## Base config

The config for every stylesheet, CSS or SCSS. On top of
[stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard),
it keeps the specificity low and the nesting shallow:

* no `!important`, ID selectors, universal selectors or qualifying types like
  `a.foo`,
* at most 3 compound selectors and specificity `0,4,0` per selector,
* at most 2 levels of nesting, an at-rule that only wraps rules, like `@media`
  around nested rules, does not add a level,
* no `transition` of `all` properties, only the properties that change,
* no background images loaded from an absolute URL, they are stored locally.

The rules and the reasons for them are in [`src/rules/base.mjs`](../rules/base.mjs).

### Order

[stylelint-order](https://github.com/hudochenkov/stylelint-order) checks the
content of declaration blocks:

1. Sass variables,
2. custom properties,
3. Sass `@extend`,
4. Sass `@include` without a block,
5. declarations,
6. nested rules.

Block at-rules, like `@media`, `@supports` or Sass `@if`, can be placed
anywhere. Properties are ordered by groups: `all`, `content`, position,
`appearance`, box model, typography, decorations, effects and transforms,
interactions, transitions and animations. Properties missing from the list in
[`src/rules/order.mjs`](../rules/order.mjs) are not checked.

### Stylistic rules

Stylelint 16 dropped its stylistic rules, the base config brings them back with
[@stylistic/stylelint-config](https://github.com/stylelint-stylistic/stylelint-config):
4 spaces, double quotes, lines up to 120 characters and consistent whitespace
around braces, colons, commas and operators. They are all autofixable.

### Disable comments

A disable comment that does nothing is reported, the same as ESLint reports
unused disable directives: either there is no problem to disable, or the rule is
not enabled. It catches comments left behind by a fixed problem or a renamed
rule, like `max-line-length`, which is `@stylistic/max-line-length` since
Stylelint 16.

### Selectors inside `:is()`, `:not()` and `:has()`

Since Stylelint 17, `selector-max-compound-selectors` and similar rules count
the selectors inside functional pseudo-classes as part of the whole selector,
and `selector-no-qualifying-type` rejects a type selector inside `:is()` or
`:not()` compounded with a class. `.foo:has(> .bar > .baz > .qux)` has 4
compound selectors, not 1. Simplify such a selector, or disable the rule for it
with the reason why the whole chain is needed.

## SCSS config

[stylelint-config-standard-scss](https://github.com/stylelint-scss/stylelint-config-standard-scss)
with the `postcss-scss` syntax and the
[stylelint-scss](https://github.com/stylelint-scss/stylelint-scss) plugin, and
our adjustments of it:

* Functions, mixins, placeholders and variables are kebab-case, private ones
  are prefixed with `_` rather than `-`.
* Only pseudo-classes and pseudo-elements can be nested, `&:hover` or
  `&::before`, so the selectors stay flat and readable.
* A mixin is always included with parentheses, `@include foo()`.
* `} @else {` stays on one line.
* Empty `//` lines can structure a block of comments, and variables can be
  grouped using empty lines.

The rules are in [`src/rules/scss.mjs`](../rules/scss.mjs).

## Helpers

`@react-ui-org/stylelint-config/helpers` exports functions that build rule
settings for what differs between projects.

### `customPropertyPattern(prefixes)`

The `custom-property-pattern` setting for custom properties named the React UI
way: one of the prefixes, then either SUIT CSS for theming of components, or
kebab-case for design tokens and local properties. Stylelint does not check
names generated with a Sass interpolation, like `--rui-local-#{$property}`.

```js
import { customPropertyPattern } from '@react-ui-org/stylelint-config/helpers';

export default {
  extends: [
    '@react-ui-org/stylelint-config',
    '@react-ui-org/stylelint-config/scss',
  ],
  rules: {
    // `--rui-Button--primary__color`, `--rcm-color-primary`
    'custom-property-pattern': customPropertyPattern(['rui', 'rcm']),
  },
};
```

Without it, the base config requires kebab-case custom properties with no
prefix, as `stylelint-config-standard` does.

## CSS Modules config

Class names are camelCase, because they are read with the dot notation in
JavaScript, and `:global()` is a known pseudo-class. The class names inside
`:global()` are checked as well.

Only these essential features are recognized. Other features of CSS Modules,
like `composes`, `:local` or `@value`, can be replaced with Sass and are
reported as unknown.
