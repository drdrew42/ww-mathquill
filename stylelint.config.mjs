export default {
	extends: ['stylelint-config-standard', 'stylelint-config-html', 'stylelint-config-standard-scss'],
	plugins: ['stylelint-scss'],
	ignoreFiles: ['node_modules/**', 'dist/**'],
	rules: {
		'at-rule-no-unknown': null,
		'rule-empty-line-before': ['always', { except: ['first-nested', 'after-single-line-comment'] }],
		'no-descending-specificity': null,
		'no-invalid-position-at-import-rule': null,
		'import-notation': 'string',
		'declaration-property-value-no-unknown': null
	},
	overrides: [
		{
			files: ['**/*.html'],
			customSyntax: 'postcss-html'
		}
	]
};
