module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      build: {
        src: 'main.js',
        dest: 'dist/js/index.js'
      }
    },
    jshint: {
        options: {
          curly: true,
          eqeqeq: true,
          eqnull: true,
          browser: true,
          globals: {
            jQuery: true
          },
        },
        files: {
          src: ['Gruntfile.js', 'main.js']
        }
    },
    copy: {
        main: {
          expand: true,
          cwd: 'static/',
          src: '**',
          dest: 'dist/',
        }
    },
    uglify: {
      index: {
        files: {
          'dist/js/index.min.js': ['dist/js/index.js']
        }
      }
    }
  });

  // Load the plugin that provides the "browserify" task.
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Default task(s).
  grunt.registerTask('default', ['jshint', 'browserify', 'copy', 'uglify']);

};
