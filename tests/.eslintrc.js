const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    plugins: ["jest"],
    extends: ["eslint:recommended", "plugin:jest/recommended"],
    env: { "jest/globals": true },
    rules: {
        "no-debugger": isProd ? "error" : "off",
        "no-console": isProd ? "error" : "off",
    }
};
