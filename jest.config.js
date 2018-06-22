module.exports = {
    projects: [{
        displayName: 'test',
        testMatch: ['**/tests/**/*.test.js'],
    }, {
        runner: "jest-runner-eslint",
        displayName: "lint",
        testMatch: ['**/src/**/*.js'],
    }],
};
