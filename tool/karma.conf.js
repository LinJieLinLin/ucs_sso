/* eslint-env node,jasmine */
module.exports = function(config) {
    config.set({
        basePath: "../",
        frameworks: ["jasmine"],
        files: [
            "../angular/*.js",
            "../angular-mocks/*.js",
            "../angular-placeholder-ie/*.js",
            "../config-dy/*.js",
            "../jquery/dist/*.js",
            "js/main/*.js",
            "js/**/*.js",
            "test/*.spec.js",
            "test/**/*.spec.js"
        ],
        exclude: [
            // "sso/tool/**/*.js"
        ],
        preprocessors: {
            'js/main/*.js': 'coverage'
        },
        reporters: ["progress", "coverage"],
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ["Chrome"],
        singleRun: false
    });
};
