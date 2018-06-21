const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    parserOptions: {
        ecmaVersion: 7,
        sourceType: "module",
        ecmaFeatures: {},
    },
    plugins: ["jest"],
    extends: ["eslint:recommended", "plugin:jest/recommended"],
    env: {
        node: true,
        es6: true,
        "jest/globals": true,
    },
    rules: {
        "no-debugger": isProd ? "error" : "off",
        "no-console": isProd ? "error" : "off",
    }
};
