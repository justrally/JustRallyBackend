import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  {
    ignores: [
      'dist/**/*',
      'node_modules/**/*',
      '**/*.test.ts',
      '**/*.spec.ts',
      'libs/prisma/src/generated/**/*',
      'eslint.config.ts',
    ],
  },
];

export default config;
