module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      build: {
        src: 'client/main.js',
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
    clean: {
      build: {
        src: [ 'dist' ]
      },
      all: {
        src: ['node_modules']
      }
    },
    copy: {
        build: {
          expand: true,
          cwd: 'static/',
          src: '**',
          dest: 'dist/',
        },
        bootstrap: {
          expand: true,
          cwd: 'node_modules/bootstrap/dist/',
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
    },
    simplemocha: {
        options: {
            globals: ['should'],
            timeout: 3000,
            ignoreLeaks: false,
            ui: 'bdd',
            reporter: 'nyan'
        },

        client: {
            src: ['test/**/*.test.js']
        }
    }
  });
  // Default task(s).
  grunt.registerTask('default', ['jshint', 'browserify', 'copy:bootstrap', 'copy:build', 'uglify' ]);
  grunt.registerTask('test', ['simplemocha' ]);

};
