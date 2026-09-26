import { configs } from '@react-ui-org/eslint-config';
import { defineConfig } from 'eslint/config';

/*
 * The package is a plain Node ESM project, so only the base config applies.
 */
export default defineConfig([
  ...configs.base.recommended,
]);
