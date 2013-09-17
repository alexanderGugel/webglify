'use strict';


module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(function(contrib) {
    grunt.log.ok([contrib + " is loaded"]);
    grunt.loadNpmTasks(contrib);
  });

  require('load-grunt-tasks')(grunt);

  var config = {
    dist: 'dist',
    src: 'src',
    distTest: 'test/dist',
    srcTest: 'test/src'
  };

  // Project configuration.
  grunt.initConfig({
    config: config,
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '<%= config.dist %>/*',
              '<%= config.distTest %>/*',
              '!<%= config.dist %>/.git*'
            ]
          }
        ]
      },
    },
    copy: {
      dist: {
        files: [
          {expand: true, cwd: 'src/', src: ['*/*', '!*/*.coffee'], dest: 'dist/'}
        ]
      }
    },
    nodemon: {
      options: {
        file: 'dist/server/server.js',
      }
    },
    connect: {
      dist: {
        options: {
          port: 8080,
          base: 'dist/server',
          // middleware: liveReloadMiddleware
        }
      }
    },
    concurrent: {
      target: {
        tasks: ['nodemon', 'preview'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.src %>',
          src: '{,*/}*.coffee',
          dest: '<%= config.dist %>',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: '<%= config.srcTest %>',
          src: '{,*/}*.spec.coffee',
          dest: '<%= config.distTest %>',
          ext: '.spec.js'
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
    },
    watch: {
      client: {
        files: ['**/*', '!dist'],
        tasks: ['default'],
        options: {
          livereload: true
        }
      },
      test: {
        files: '<%= config.srcTest %>/specs/*',
        tasks: ['coffee:test', 'simplemocha:backend']
      }
    },
    simplemocha: {
      options: {
        globals: [
        'sinon',
        'chai',
        'should',
        'expect',
        'assert',
        'AssertionError',
        ],
        timeout: 3000,
        ignoreLeaks: false,
        // grep: '*.spec',
        ui: 'bdd',
        reporter: 'spec'
      },
      backend: {
        src: [
          // add chai and sinon globally
          'test/support/globals.js',

          // tests
          'test/dist/**/*.spec.js',
        ],
      },
    },
  });

  grunt.registerTask('coverageBackend', 'Test backend files as well as code coverage.', function () {
    var done = this.async();

    var path = './test/support/runner.js';

    var options = {
      cmd: 'istanbul',
      grunt: false,
      args: [
        'cover',
        '--default-excludes',
        '-x', 'app/**',
        '--report', 'lcov',
        '--dir', './coverage/backend',
        path
      ],
      opts: {
        // preserve colors for stdout in terminal
        stdio: 'inherit',
      },
    };

    function doneFunction(error, result) {
      if (result && result.stderr) {
        process.stderr.write(result.stderr);
      }

      if (result && result.stdout) {
        grunt.log.writeln(result.stdout);
      }

      // abort tasks in queue if there's an error
      done(error);
    }

    grunt.util.spawn(options, doneFunction);
  });


  // Default task.
  grunt.registerTask('default', ['clean', 'copy', 'coffee', 'jshint', 'test']);

  grunt.registerTask('server', ['clean', 'copy', 'coffee', 'jshint', 'concurrent:target']);

  grunt.registerTask('preview', ['connect:dist', 'watch']);

  grunt.registerTask('test', [
    'clean',
    'copy',
    'coffee',
    'jshint',
    'simplemocha:backend',
  ]);

  grunt.registerTask('coverage', [
    'clean',
    'copy',
    'coffee',
    'coverageBackend'
  ]);
};
