module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
  },
  "extends": ["airbnb/base", "plugin:meteor/recommended"],
  "plugins": [
    "meteor",
    "react",
    "jsx-a11y",
    "import",
  ],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "import/prefer-default-export": "off",
    "no-bitwise": "off",
    "react/prop-types": "off",
    "react/prefer-stateless-function": "off",
    "linebreak-style": "off",
    "no-useless-constructor": "warn"
  }
};