module.exports = {
  plugins: ['import'],
  rules: {
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': ['error', {js: 'never', json: 'always'}],
    'import/exports-last': 'off',
    'import/first': 'error',
    'import/no-anonymous-default-export': 'off',
    'import/max-dependencies': 'off',
    'import/namespace': 'error',
    'import/named': 'error',
    'import/newline-after-import': 'warn',
    'import/no-absolute-path': 'error',
    'import/no-amd': 'error',
    'import/no-commonjs': 'error',
    'import/no-deprecated': 'off',
    'import/no-duplicates': 'error',
    'import/no-dynamic-require': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-internal-modules': 'off',
    'import/no-mutable-exports': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-named-default': 'warn',
    'import/no-namespace': 'off',
    'import/no-nodejs-modules': 'off',
    'import/no-restricted-paths': 'off',
    'import/no-unassigned-import': 'error',
    'import/no-unresolved': 'error',
    'import/no-webpack-loader-syntax': 'error',
    'import/order': 'warn',
    'import/prefer-default-export': 'warn',
    'import/unambiguous': 'error'
  },
  settings: {
    'import/resolve': {
      extensions: ['.js', '.jsx', '.json']
    }
  }
}