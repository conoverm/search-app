// Karma configuration
// Generated on Sun Nov 08 2015 13:23:25 GMT-0500 (EST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      '../bower_components/angular/angular.js',
      '../bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      '../bower_components/ng-tags-input/ng-tags-input.js',
      '../bower_components/clipboard/dist/clipboard.js',
      '../bower_components/ngclipboard/dist/ngclipboard.js',
      '../bower_components/angular-route/angular-route.js',
      '../bower_components/angular-resource/angular-resource.js',
      '../bower_components/angular-spinners/dist/angular-spinners.min.js',
      '../bower_components/jquery/dist/jquery.js',
      '../bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
      '../bower_components/tagged-infinite-scroll/taggedInfiniteScroll.js',
      '../bower_components/waypoints/lib/noframework.waypoints.js',
      '../bower_components/angular-waypoints/dist/angular-waypoints.js',
      '../bower_components/angular-ui-router/release/angular-ui-router.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      // endbower

      '../node_modules/xlsx/dist/xlsx.full.min.js',
      '../node_modules/angular-file-saver/dist/angular-file-saver.bundle.js',

      // phantomJS fails on custom event constructors, angular-file-saver uses one.
      'mouseEventHelper.js',

      '../app/scripts/**/*.js',
      'spec/**/*.js',

      // fixtures
      'mocks/*.json',

      // mock modules
      'mocks/*.js'

      // ui.router causes some test issues...
      // https://github.com/angular-ui/ui-router/issues/212#issuecomment-69974072

    ],

    // list of files to exclude
    exclude: [
      'src/assets/**/*.js'
    ],

    preprocessors: {
      '../app/scripts/**/*.js': ['coverage'],
      'mocks/*.json': ['json_fixtures'],
      '../app/scripts/components/{,*/}*.html': ['ng-html2js'],
      '../app/views/{,*/}*.html' : ['ng-html2js'],
      '../app/scripts/results-tables/{,*/}*.html' : ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'templates-app',
    },

    browserStack: {
      username: '',
      accessKey: ''
    },

    // define browsers
    customLaunchers: {
      bs_edge: {
        base: 'BrowserStack',
        browser: 'edge',
        browser_version: '15',
        os: 'Windows',
        os_version: '10'
      }
    },

    coverageReporter: {
      dir: 'coverage',
      reporters: [
      {
        type: 'text-summary'
      },
      {
        type: 'html',
        subdir: function(browser) {
          // normalization process to keep a consistent browser name accross different
          // OS
          return browser.toLowerCase().split(/[ /-]/)[0];
        }
        // Would output the results into: './coverage/firefox/'
      },
      {
        type: 'text',
        subdir: '.',
        file: 'text.txt'
      }

      ]
    },

    jsonFixturesPreprocessor: {
      // strip this from the file path \ fixture name
      // stripPrefix: 'spec/mocks/',
      // strip this to the file path \ fixture name
      // prependPrefix: 'mocks/',
      // change the global fixtures variable name
      variableName: '__mocks__',
      // camelize fixture filenames (e.g 'fixtures/aa-bb_cc.json' becames __fixtures__['fixtures/aaBbCc'])
      camelizeFilenames: true,
      // transform the filename
      transformPath: function(path) {
        return path + '.js';
      }
    },
    // web server port
    // mc -- 9876 is default?
    // port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: false,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // logLevel: config.LOG_INFO,
    logLevel: config.LOG_INFO,

    failOnEmptyTestSuite: true,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    reporters: ['progress', 'coverage', 'spec', 'coverage-html-index'],

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS','Firefox','Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    captureTimeout: 6999
  });
};
