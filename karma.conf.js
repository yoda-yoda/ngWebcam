'use strict';

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'node_modules/angular/angular.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'node_modules/underscore/underscore.js',
        'src/{,*/}*.js',
        'tests/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    //register preprocessors
    preprocessors: {
        'src/**/*.js': 'coverage',
        'tests/**/*.js': 'coverage'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit'
    reporters: [
        'progress',
        'coverage',
        'mocha'
    ],

    mochaReporter: {
        output: 'autowatch'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox', 'Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,


    plugins: [
        'karma-jasmine',
        'karma-firefox-launcher',
        'karma-chrome-launcher',
        'karma-coverage',
        'karma-mocha-reporter'
    ],

    //coverage reporters
    coverageReporter: {
        dir: 'tests/coverage/',
        check: {
            global: {
                statements: 100,
                branches: 100,
                lines: 100,
                functions: 100
            }
        },
        reporters: [{
            type: 'html',
            subdir: 'html/'
        }, {
            type: 'text'
        }, {
            type: 'text-summary'
        }]
    }
  });
};
