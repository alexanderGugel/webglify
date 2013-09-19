'use strict';


module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['dist/*'],
    copy: {
      main: {
        files: [{expand: true, cwd: 'src/', src: ['**', '!**/*.coffee'], dest: 'dist/'}]
      }
    },
    coffee: {
      main: {
        files: [{expand: true, cwd: 'src/', src: '{,*/}*.coffee', dest: 'dist/', ext: '.js'}]
      }
    },
    nodemon: {
      dev: {}
    },
    watch: {
      options: {livereload: true},
      files: ['src/**/*'],
      tasks: ['default']
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    coffeelint: {
      options: {
        'max_line_length': {
          'level': 'ignore'
        }
      },
      app: ['src/*/*.coffee']
    }
  });
  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', ['jshint', 'coffeelint', 'clean', 'copy', 'coffee']);
  grunt.registerTask('server', ['default', 'concurrent']);
};