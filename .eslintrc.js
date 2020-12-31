module.exports = {
  root: true,

  env: {
    es6: true
  },

  parserOptions: {
    sourceType: 'module'
  },

  plugins: [
    'eslint-comments',
    'react',
    'react-hooks',
    'react-native',
    '@react-native-community',
    'jest'
  ],

  settings: {
    react: {
      version: 'detect'
    }
  },

  overrides: [
    {
      files: ['*.js'],
      parser: 'babel-eslint',
      plugins: ['flowtype'],
      rules: {
        // Flow Plugin
        // The following rules are made available via `eslint-plugin-flowtype`

        'flowtype/define-flow-type': 1,
        'flowtype/use-flow-type': 1
      }
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint/eslint-plugin'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_' }
        ],
        'no-unused-vars': 'off'
      }
    },
    {
      files: [
        '*.{spec,test}.{js,ts,tsx}',
        '**/__{mocks,tests}__/**/*.{js,ts,tsx}'
      ],
      env: {
        jest: true,
        'jest/globals': true
      },
      rules: {
        'react-native/no-inline-styles': 0
      }
    }
  ],

  // Map from global var to bool specifying if it can be redefined
  globals: {
    __DEV__: true,
    __dirname: false,
    __fbBatchedBridgeConfig: false,
    alert: false,
    cancelAnimationFrame: false,
    cancelIdleCallback: false,
    clearImmediate: true,
    clearInterval: false,
    clearTimeout: false,
    console: false,
    document: false,
    ErrorUtils: false,
    escape: false,
    Event: false,
    EventTarget: false,
    exports: false,
    fetch: false,
    FormData: false,
    global: false,
    Headers: false,
    Intl: false,
    Map: true,
    module: false,
    navigator: false,
    process: false,
    Promise: true,
    requestAnimationFrame: true,
    requestIdleCallback: true,
    require: false,
    Set: true,
    setImmediate: true,
    setInterval: false,
    setTimeout: false,
    URL: false,
    URLSearchParams: false,
    WebSocket: true,
    window: false,
    XMLHttpRequest: false
  },
  extends: ['standard', 'standard-react'],

  rules: {
    'react/prop-types': 0,
    'no-unused-vars': 0,
    'no-undef': 0,
    'react/jsx-no-bind': 0,
    'react/jsx-handler-names': 0,
    'no-case-declarations': 0,
    'no-unused-expressions': 0
  }
}
