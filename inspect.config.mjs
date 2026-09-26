/*
 * Every part of the exported config in the order projects are expected to
 * compose them. Not used for linting, it is the input of `npm run inspect`.
 */
export default {
  extends: [
    '@react-ui-org/stylelint-config',
    '@react-ui-org/stylelint-config/scss',
    '@react-ui-org/stylelint-config/cssModules',
  ],
};
