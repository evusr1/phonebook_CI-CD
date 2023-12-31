module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'jest': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  'plugins': ['react'],
  'settings': {
    'react': {
      'pragma': 'React',
      'version': 'detect'
    }
  },
  'rules': {
    'react/react-in-jsx-scope': 0,
    'react/prop-types': 0
  }
}