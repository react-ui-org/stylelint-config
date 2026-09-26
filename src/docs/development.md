# Development

No build step, `src` is published as it is. The package supports Node 22.11 and
newer; development uses the versions in `devEngines` and
[`.nvmrc`](../../.nvmrc).

| Command                     | Purpose                                             |
|-----------------------------|-----------------------------------------------------|
| `npm run eslint`            | Lint the package with `@react-ui-org/eslint-config` |
| `npm run eslint:fix`        | The same with autofix                               |
| `npm run markdownlint`      | Lint the documentation                              |
| `npm run lint`              | Both of the above                                   |
| `npm test`                  | Run the tests                                       |
| `npm run inspect -- <file>` | Print the whole exported config for a file          |

CI runs `npm run lint` and `npm test`.

## Layout

* [`src/configs`](../configs) are the published entry points, mapped in
  `exports` of `package.json`. They wire up the extended configs and the
  plugins.
* [`src/rules`](../rules) are bare rule maps, one per concern, used by the
  configs.
* [`src/helpers`](../helpers) are functions building rule settings for
  projects, published as `@react-ui-org/stylelint-config/helpers`.
* [`tests`](../../tests) lint the fixtures in `tests/fixtures` and snippets with
  the configs. They are not published.

Extended configs and plugins are referenced by name, never imported. Stylelint
resolves such a name from the config file that references it, so it always
comes from the dependencies of this package, even when a project has another
version installed.

## Adding a rule

Add the rule to the rule map of its concern and keep the map alphabetical. If
the reason for a setting is not obvious, write it in a comment next to the rule,
the comments are the documentation of the rules. Then add a test that shows what
the rule rejects and, if the rule has exceptions, what it accepts.

## Testing

The tests use [`node:test`](https://nodejs.org/api/test.html) and extend the
configs by the package name, the same way projects do. Node resolves the name to
this package through its own `exports`, so the tests cover what is published.

Every fixture is linted with a composition of the configs. A valid fixture must
pass without a warning, which also proves that no configured rule is unknown,
deprecated or has an invalid option. An invalid fixture lists the expected
problems as `[line, rule]` pairs.

## Verifying a change

A change meant to be a refactor has to prove it changed nothing:

```sh
npm run inspect -- tests/fixtures/valid.scss > before.json
# change something
npm run inspect -- tests/fixtures/valid.scss > after.json
diff before.json after.json
```

`inspect.config.mjs` extends all three configs in the documented order. It
exists only for this and is not used for linting. Custom messages are
functions, which the printed JSON leaves out.

Then pack the package into a project and run its lint:

```sh
npm pack
# in the project
npm install --save-dev ../stylelint-config/react-ui-org-stylelint-config-<version>.tgz
npm run stylelint
```

Keep in mind that `npm install ../stylelint-config` links the directory
instead. The configs then load their plugins from the `node_modules` of this
package, including a second copy of Stylelint, so linking does not test what
projects install. Add `--install-links` to install a copy instead.
