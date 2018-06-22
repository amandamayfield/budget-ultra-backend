const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: "module",
        ecmaFeatures: {},
    },
    extends: ["eslint:recommended"],
    env: {
        node: true,
        es6: true,
    },
    rules: {
        "no-debugger": isProd ? "error" : "off",
        "no-console": isProd ? "error" : "off",
    }
};
