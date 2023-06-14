module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'jest': true,
    'cypress/globals': true
  },
  'extends': [
    'eslint:recommended',
  ],
  'plugins': ['cypress'],
  'settings': {

  },
  'rules': {
    'react/react-in-jsx-scope': 0,
    'react/prop-types': 0
  }
}