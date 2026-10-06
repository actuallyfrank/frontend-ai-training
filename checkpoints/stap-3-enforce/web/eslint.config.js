import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Lint messages are written as instructions: what to do instead, and where to read more.
const HEX_COLOUR = {
  selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
  message:
    'STYLE-01: no hex colours in code. Use var(--rs-*) tokens from src/styles/tokens.css ' +
    '(accent: --rs-spotlight) or <Card highlighted>. See docs/ai/styling.md',
};
const CLICKABLE_DIV = {
  selector: "JSXOpeningElement[name.name=/^(div|span)$/] > JSXAttribute[name.name='onClick']",
  message:
    'A11Y-01: clickable divs/spans are not keyboard accessible. Use <Button> from src/ui ' +
    '(add aria-pressed for toggles). See docs/ai/components.md',
};
const TEST_ID = {
  selector: 'CallExpression[callee.property.name=/^(get|getAll|query|queryAll|find|findAll)ByTestId$/]',
  message:
    'TEST-01: query like a user with getByRole/getByLabelText instead of test ids. See docs/ai/testing.md',
};

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['numeral', 'pretty-ms', 'humanize-duration', 'date-fns', 'dayjs', 'moment'],
              message:
                'DEPS-01: no formatting libraries. Use compact() from src/lib/numbers.ts or ' +
                'humanizeSeconds() from src/lib/time.ts. See docs/ai/rules.md',
            },
            {
              group: ['**/styles/theme'],
              message:
                'STYLE-01: theme.ts is deprecated. Use var(--rs-*) tokens from src/styles/tokens.css. ' +
                'See docs/ai/styling.md',
            },
          ],
        },
      ],
      'no-restricted-syntax': ['error', HEX_COLOUR, CLICKABLE_DIV],
    },
  },
  {
    files: ['src/**/*.test.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error', HEX_COLOUR, CLICKABLE_DIV, TEST_ID],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message:
            'DATA-01: do not call fetch in UI code. Add a hook in src/api/ that uses apiClient ' +
            '(see src/api/useProfile.ts). See docs/ai/data-fetching.md',
        },
      ],
    },
  },
]);
