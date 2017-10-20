// @TODO: uglify HTML. Source maps in dist. (Don't serve source maps)
// look in useminprepare and/or usemin options uglify sourceMpas:true

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist',
    appVersion: require('./package.json').version || ''
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    project: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    // @TODO: add a watcher for SASS files, rerun SASS compliation
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= project.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:app'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma:cont']
      },

      jsTestCont: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test']
      },
      styles: {
        files: ['<%= project.app %>/styles/{,*/}*.scss'],
        tasks: ['sass:dev', 'autoprefixer']
      },
      templates: {
        files: ['<%= project.app %>/scripts/components/{,*/}*.html',
              '<%= project.app %>/views/{,*/}*.html',
              '<%= project.app %>/scripts/results-tables/{,*/}*.html',
              '<%= project.app %>/scripts/extra-query/{,*/}*.html'],
        tasks: ['html2js']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        options: {
          reload: true
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= project.app %>/scripts/components/{,*/}*.html',
          '<%= project.app %>/views/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= project.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729,
        debug: false,
        protocol: 'http'
      },
      livereload: {
        options: {
          debug: false,
          open: false,
          middleware: function (connect, options, middlewares) {

            var url = require('url');
            var bodyParser = require('body-parser');

            // Since version 0.11 of grunt-connect, static became
            var serveStatic = require('serve-static');
            var proxy = require('http-proxy-middleware');
            var adamaProxy = require('@mediamath/t1proxy');
            var creativeCheck = require('./creativeCheck');

            var mocksProxy = proxy('/mocks', {
              target: 'http://localhost:9050', // grunt.connect.serveMocks
              changeOrigin: true,
              pathRewrite: {
                '^/mocks' : '',     // rewrite path
              },
              headers: {
                'x-grunt-contrib-proxy': 'proxied request',
              }
            });
            var history = require('connect-history-api-fallback');

            middlewares.unshift(
              connect().use(bodyParser.urlencoded({
                extended: true
              })),
              connect().use(bodyParser.json()),
              connect().use(adamaProxy),
              connect().use(history()),
              connect().use(mocksProxy),
              connect().use('/creativeCheck/', creativeCheck),
              serveStatic('.tmp'),
              connect().use(
                '/bower_components', serveStatic('./bower_components')
              ),
              connect().use(
                '/app/styles',
                serveStatic('./app/styles')
              ),
              serveStatic(appConfig.app)
            );

            return middlewares;

          }
        }
      },
      serveMocks: {
        options: {
          open: false,
          debug: true,
          hostname: 'localhost',
          port: 9050,
          middleware: function (connect, options, middlewares) {
            var serveStatic = require('serve-static');

            middlewares.unshift(
              serveStatic('test/mocks')
            );
            return middlewares;
          }
        }
      },
      test: {
        options: {
          hostname: 'localhost',
          port: 9001,
          middleware: function (connect) {
            var serveStatic = require('serve-static');

            return [
              serveStatic('.tmp'),
              serveStatic('test'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              serveStatic(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          hostname: '0.0.0.0',
          port: '8081',
          livereload: false,
          open: false,
          debug: false,
          base: ['<%= project.dist %>'],
          middleware: function (connect, options, middlewares) {
            var url = require('url');
            var bodyParser = require('body-parser');

            // Since version 0.11 of grunt-connect, static became
            var serveStatic = require('serve-static');
            var proxy = require('http-proxy-middleware');
            var adamaProxy = require('@mediamath/t1proxy');
            var creativeCheck = require('./creativeCheck');
            var history = require('connect-history-api-fallback');

            middlewares.unshift(
              connect().use(bodyParser.urlencoded({
                extended: true
              })),
              connect().use(bodyParser.json()),
              connect().use(adamaProxy),
              connect().use(history()),
              connect().use('/creativeCheck/', creativeCheck),
              serveStatic('dist'),
              connect().use('/dist', serveStatic('./dist'))
            );

            return middlewares;
          }
        }
      }
    },

    // Run a code complexity report
    complexity: {
      generic: {
        src: ['app/scripts/**/*.js'],
        exclude: ['test', '*.tpl.js', 'src/**/*spec.js'],
        options: {
          breakOnErrors: false,
          // jsLintXML: 'report.xml',
          // create XML JSLint-like report
          // checkstyleXML: 'checkstyle.xml',
          // create checkstyle report
          // pmdXML: 'pmd.xml',
          // create pmd report
          errorsOnly: false,
          // show only maintainability errors
          cyclomatic: [3, 7, 12],
          // or optionally a single value, like 3
          halstead: [8, 13, 20],
          // or optionally a single value, like 8
          maintainability: 100,
          hideComplexFunctions: false,
          // only display maintainability
          broadcast: false
          // broadcast data over event-bus
        }
      }
    },

    /**
     * Creates a changelog on a new version.
     * https://github.com/btford/grunt-conventional-changelog
     * https://github.com/conventional-changelog/conventional-changelog-core
     * The options are confusing and varied, but mostly it based on info in
     * the package.json
     */
    conventionalChangelog: {
      options: {
        changelogOpts: {
          // conventional-changelog options go here
          preset: 'angular'
        },
        context: {
          // context goes here
        },
        gitRawCommitsOpts: {
          // git-raw-commits options go here
        },
        parserOpts: {
          // conventional-commits-parser options go here
        },
        writerOpts: {
          // conventional-changelog-writer options go here
        }
      },
      release: {
        src: 'CHANGELOG.md'
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      tools: {
        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        },
        src: [
          'Gruntfile.js'
        ]
      },
      app: {
        options: {
          jshintrc: 'app/.jshintrc',
          reporter: require('jshint-stylish')
        },
        src: [
          '<%= project.app %>/scripts/{,*/}*.js',
          '!<%= project.app %>/scripts/**/templates.js'
        ],
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc',
          reporter: require('jshint-stylish')
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= project.dist %>/{,*/}*',
            '!<%= project.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    //
    // We're going to pass on JQuery and Bootstrap widgets,
    // in favor of Angular UI, unless we need them. see:
    // app.exclude
    wiredep: {
      app: {
        exclude: [/angular-mocks/, /jquery/, /bootstrap.js/],
        src: ['<%= project.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= project.dist %>/scripts/{,*/}*.js',
          '<%= project.dist %>/styles/{,*/}*.css',
          '<%= project.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= project.dist %>/styles/fonts/*'
        ]
      }
    },

    /*
    ngconstant generates an angular module with an Angular constant containing
    the API endpoints defined below. The generated constant is injected as a
    dependency into relevant controllers, directives and services
    */

    ngconstant: {
      options: {
        space: '  ',
        wrap: '{\%= __ngModule %}',
        name: 'config',
        dest: '<%= project.app %>/scripts/config.js',
        constants: {
          'APPVERSION': '<%= project.appVersion %>',
          'T1ApiBase':  '/api/v2.0',
          'MediaBase': '/media/v1.0'
        }
      },
      /*
      Locally, this project is served with grunt.connect. The URL the app runs under is
      connect.options.hostname (localhost) and connect.options.port (9000); ie:
      localhost:9000 requests are proxied in connect.options.proxy to pi-qa.mediamath.com
      */
      dev: {
        constants: {
          debug: true,
          'T1URL': '//<%= connect.options.hostname %>' + ':' + '<%= connect.options.port %>',
          'ENV': 'dev'
        }
      },
      qa: {
        constants: {
          debug: true,
          'T1URL': '//api.mediamath.com',
          'ENV': 'qa'
        }
      },
      prod: {
        constants: {
          'T1URL': '//localhost:8081',
          'ENV': 'prod'
        }
      },
      aws: {
        constants: {
          // Change the AWS URL if you want to create a 'UAT' or 'QA' environment.
          // The *master* or *production* domain is:
          // idlookup.swift.mediamath.com
          'T1URL': '//' + 'idlookup.swift.mediamath.com',
          'ENV': 'aws'
        },
      }

    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= project.app %>/index.html',
      options: {
        dest: '<%= project.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },


    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= project.dist %>/{,*/}*.html'],
      css: ['<%= project.dist %>/styles/{,*/}*.css'],
      js: ['<%= project.dist %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= project.dist %>',
          '<%= project.dist %>/images',
          '<%= project.dist %>/styles'
        ],
        patterns: {
          js: [
            [/(mm_site_logo\.svg)/g, 'rewriting ref to mm_site_logo with anti-cache hash'],
            [/(spinner\.gif)/g, 'rewriting ref to spinner with anti-cache hash']
          ]
        }
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= project.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= project.dist %>/scripts/scripts.js': [
    //         '<%= project.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= project.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= project.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= project.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= project.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= project.app %>',
          dest: '<%= project.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= project.dist %>/images',
          src: ['generated/*']
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      dist: [
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      },
      cont: {
        configFile: 'test/karma.conf.js',
        client: {
          captureConsole: true
        },
        logLevel: 'ERROR',
        singleRun: false,
        autoWatch: true,
        colors: true,
        browsers: ['PhantomJS'],
        reporters: ['progress', 'coverage']
      },
      ci: {
        configFile: 'test/karma.conf.js',
        singleRun: true,
        autoWatch: false,
        colors: false,
        browserStack: {
          username: grunt.option('browserStack.username'),
          accessKey: grunt.option('browserStack.accessKey')
        },
        browsers: ['Firefox', 'Chrome', 'bs_edge'],
        reporters: ['progress', 'coverage', 'spec', 'coverage-html-index', 'BrowserStack']
      }
    },

    html2js: {
      options: {
        base: '<%= project.app %>',
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        }
      },
      app: {
        src: ['<%= project.app %>/scripts/components/*.html',
              '<%= project.app %>/views/**/*.html',
              '<%= project.app %>/scripts/results-tables/{,*/}*.html',
              '<%= project.app %>/scripts/extra-query/{,*/}*.html'],
        dest: '<%= project.app %>/scripts/templates/templates.js'
      }
    },


    sass: {
      dev: {
        options: {
          outputStyle: 'extended',
          sourceComments: false,
          sourceMap: true
        },
        files: {
          '.tmp/styles/login.css': '<%= project.app %>/styles/login.scss',
          '.tmp/styles/main.css': '<%= project.app %>/styles/main.scss',
          '.tmp/styles/bootstrap.css': '<%= project.app %>/styles/bootstrap.scss',
          '.tmp/styles/t1.css': '<%= project.app %>/styles/t1.scss'
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed',
          sourceComments: false,
          sourceMap: false
        },
        files: {
          '.tmp/styles/login.css': '<%= project.app %>/styles/login.scss',
          '.tmp/styles/main.css': '<%= project.app %>/styles/main.scss',
          '.tmp/styles/bootstrap.css': '<%= project.app %>/styles/bootstrap.scss',
          '.tmp/styles/t1.css': '<%= project.app %>/styles/t1.scss'
        }
      }
    }

  });


  /*
  define what API endpoints and build tasks are used by passing in
  --environment=:x, where x is dev, qa, or dist. e.g. to serve fully built
  version use `grunt serve --environment=dist`, to preview on local machine use
  `grunt serve --environment=dist`
  */

  grunt.registerTask('serve', 'Compile then start a connect web server', function () {
    var environment = grunt.option('environment');

    if (environment === 'dev' || environment ==='qa') {
      return grunt.task.run([
        'wiredep:app',
        'ngconstant:' + environment,
        'html2js',
        'sass:dev',
        'autoprefixer:server',
        'connect:livereload',
        'connect:serveMocks',
        'watch'
      ]);
    }

    if (environment === 'prod' || environment === 'aws') {
      return grunt.task.run([
        'clean:dist',
        'ngconstant:' + environment,
        'html2js',
        'wiredep:app',
        'useminPrepare',
        'concurrent:dist',
        'sass:dist',
        'autoprefixer',
        'concat',
        'ngAnnotate',
        'copy:dist',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin',
        'connect:dist:keepalive'
      ]);
    }

    grunt.log.error(('Incorrect environment argument – value must be dev, qa or prod'));

  });

  grunt.registerTask('test', [
    'clean:server',
    'ngconstant:prod',
    'html2js',
    'wiredep',
    'sass:dist',
    'autoprefixer',
    'connect:test',
    'jshint:test',
    'karma:unit'
  ]);

  grunt.registerTask('ci', [
    'clean:server',
    'ngconstant:prod',
    'html2js',
    'wiredep',
    'sass:dist',
    'autoprefixer',
    'connect:test',
    'jshint:test',
    'karma:ci'
  ]);

  grunt.registerTask('test:cont', [
    'ngconstant:prod',
    'html2js',
    'wiredep',
    'sass:dist',
    'connect:test',
    'jshint:test',
    'karma:cont'
  ]);

  // define what API endpoints are included with ngconstant by passing in --environment=:x, where x
  // is dev, qa, or dist. e.g. for production build, `grunt build --environment=dist`
  grunt.registerTask('build', function() {
    var environment = grunt.option('environment') || 'aws';

    grunt.log.error(('BUILDING FOR: ' + environment));

    if (environment === 'prod' || environment === 'qa' || environment === 'dev' || environment === 'aws') {
      return grunt.task.run([
      'clean:dist',
      'ngconstant:' + environment,
      'html2js',
      'sass:' + (environment == 'qa' || environment == 'prod' || environment === 'aws' ? 'dist' : 'dev') ,
      'wiredep:app',
      'useminPrepare',
      'concurrent:dist',
      'autoprefixer',
      'concat',
      'ngAnnotate',
      'copy:dist',
      'cssmin',
      'uglify',
      'filerev',
      'usemin',
      'htmlmin'
      ]);
    }

    grunt.log.error(('Incorrect environment argument – value must be dev, qa or prod'));

  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('changelog', ['conventionalChangelog']);

};
