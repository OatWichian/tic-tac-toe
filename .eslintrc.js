module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'next'],
  plugins: [
    'import',
    'react-hooks',
    'react',
    '@next/eslint-plugin-next',
    'babel-plugin-root-import',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'arrow-body-style': 1,
    'react/prop-types': 1,
    'react/display-name': 0,
    'import/no-unresolved': 2,
    'react/no-children-prop': 0,
    'react/self-closing-comp': 2,
    'react/react-in-jsx-scope': 0,
    '@next/next/no-img-element': 0,
    'react/no-unescaped-entities': 0,
    'import/no-useless-path-segments': 1,
    'no-unused-vars': [
      1,
      {
        ignoreRestSiblings: false,
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
