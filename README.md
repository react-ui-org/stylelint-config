# stylelint-config

![npm](https://img.shields.io/npm/v/@react-ui-org/stylelint-config)

Shareable [Stylelint](https://stylelint.io) config for CSS, SCSS and CSS
Modules projects. It builds on
[stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard)
and adds stricter rules to keep the specificity low and the nesting shallow, an
opinionated order of properties and the stylistic rules of
[@stylistic/stylelint-config](https://github.com/stylelint-stylistic/stylelint-config).

Stylelint 17 only.

## Sponsors

<p>
    <br />
    <a href="https://www.racom.eu">
      <img src="public/racom.svg" width="190" height="30" alt="RACOM" />
    </a>
    <br />
    <br />
</p>

> Development of this project is largely supported by
> [RACOM]—one of the leading global players in wireless
> Critical Infrastructure.

## Installation

```sh
npm install --save-dev stylelint @react-ui-org/stylelint-config
```

All configs and plugins are bundled. Create `stylelint.config.mjs` and extend
the parts the project needs, in this order:

```js
export default {
  extends: [
    '@react-ui-org/stylelint-config',
    '@react-ui-org/stylelint-config/scss',
    '@react-ui-org/stylelint-config/cssModules',
  ],
};
```

A CSS project extends the first one, an SCSS project the first two. The
`cssModules` config is an addition for projects using CSS Modules, with or
without SCSS. See [Configs](./src/docs/configs.md) for what each part contains
and why the order matters.

### Overrides

Put project rules to `rules`, they override the shared ones. Projects themed
the React UI way name custom properties with a prefix, then SUIT CSS or
kebab-case, which the `customPropertyPattern` helper builds for the given
prefixes:

```js
import { customPropertyPattern } from '@react-ui-org/stylelint-config/helpers';

export default {
  extends: [
    '@react-ui-org/stylelint-config',
    '@react-ui-org/stylelint-config/scss',
    '@react-ui-org/stylelint-config/cssModules',
  ],
  rules: {
    'custom-property-pattern': customPropertyPattern(['rui']),
  },
};
```

## Contributing

Please check out the [Development Guide](./src/docs/development.md). It
describes how the package is laid out, how to add a rule and how to verify a
change. All contributions must pass linting and tests before being merged.

## Releasing

The release process is fully automated. If you plan to release a new version,
please follow the [Releasing Guide](./src/docs/releasing.md), which explains
the version bump and how the changelog is assembled.

[RACOM]: https://www.racom.eu
