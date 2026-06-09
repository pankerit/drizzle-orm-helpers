const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettier = require('eslint-config-prettier');
const drizzle = require('eslint-plugin-drizzle');
const globals = require('globals');

module.exports = [
	{
		ignores: [
			'**/.DS_Store',
			'node_modules/**',
			'dist/**',
			'.env',
			'.env.*',
			'!.env.example',
			'eslint.config.cjs',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock',
		],
	},
	js.configs.recommended,
	...tsPlugin.configs['flat/recommended'],
	{
		languageOptions: {
			ecmaVersion: 2020,
			globals: {
				...globals.browser,
				...globals.es2017,
				...globals.node,
			},
			sourceType: 'module',
		},
		plugins: {
			drizzle,
		},
		rules: {
			'curly': ['error', 'all'],
			'@typescript-eslint/consistent-type-imports': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ ignoreRestSiblings: true, destructuredArrayIgnorePattern: '^_' },
			],
		},
	},
	prettier,
];
