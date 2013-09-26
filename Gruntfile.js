'use strict';


module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['dist/*'],
    copy: {
      main: {
        files: [{expand: true, cwd: 'src/', src: ['index.html'], dest: 'dist/'}]
      },
      images: {
        files: [{expand: true, cwd: 'src/images/', src: ['**'], dest: 'dist/images/'}]
      }
    },
    coffeeify: {
      options: {
        debug: true
      },
      files: { src:['src/**/*.coffee'], dest: 'dist/build.js' }
    },
    // nodemon: {
    //   dev: {}
    // },
    watch: {
      coffee: {
        files: ['src/**/*.coffee', 'Gruntfile.js'],
        tasks: ['default']
      },
      html: {
        files: ['src/index.html'],
        tasks: ['copy']
      }
    },
    concurrent: {
      tasks: ['watch'],
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
    uglify: {
      files: {
        dest: 'dist/build.min.js', src:['dist/build.js']
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
  grunt.registerTask('default', ['jshint', 'coffeelint', 'clean', 'copy', 'coffeeify', 'uglify', 'concurrent']);
  // grunt.registerTask('server', ['default', 'concurrent']);
};