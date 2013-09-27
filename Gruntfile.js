'use strict';


module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['dist/*'],
    copy: {
      main: {
        files: [{expand: true, cwd: 'src/', src: ['*.html', 'HTMLexamples/*.html'], dest: 'dist/'}]
      },
      images: {
        files: [{expand: true, cwd: 'src/images/', src: ['**'], dest: 'dist/images/'}]
      },
      lib: {
        files: [{expand: true, cwd: 'lib/', src: ['three.js', 'three.min.js'], dest: 'dist/lib/'}]
      }
    },
    coffeeify: {
      options: {
        debug: true
      },
      files: { src:['src/**/*.coffee'], dest: 'dist/lib/WebGLify.js' }
    },
    watch: {
      coffee: {
        files: ['src/**/*.coffee', 'Gruntfile.js'],
        tasks: ['default']
      },
      html: {
        files: ['src/**.html'],
        tasks: ['default']
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
        dest: 'dist/lib/WebGLify.min.js', src:['dist/lib/WebGLify.js']
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
};