// Karma configuration
// Generated on Mon Feb 12 2018 12:39:14 GMT-0500 (EST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'karma-typescript'],

    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json"
    },

    // list of files / patterns to load in the browser
    files: [
      'src/**/*.ts',
      'spec/**/*.spec.ts'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    mime: {
      'text/x-typescript': ['ts','tsx']
    },

    preprocessors: {
      "src/**/*.ts": "karma-typescript",
      "spec/**/*.ts": "karma-typescript"
    },

    reporters: ["mocha", "progress", "karma-typescript"],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
