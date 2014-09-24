module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-express-server');
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    express: {
      options: {
        // Override the command used to start the server.
        // (do not use 'coffee' here, the server will not be able to restart
        //  see below at opts for coffee-script support)
        cmd: process.argv[0],
  
        // Will turn into: `node OPT1 OPT2 ... OPTN path/to/server.js ARG1 ARG2 ... ARGN`
        // (e.g. opts: ['node_modules/coffee-script/bin/coffee'] will correctly parse coffee-script)
        opts: [ ],
        args: [ ],
  
        // Setting to `false` will effectively just run `node path/to/server.js`
        background: true,
  
        // Called when the spawned server throws errors
        fallback: function() {
          console.log("opps");
        },
  
        // Override node env's PORT
        port: 9999,
  
        // Override node env's NODE_ENV
        node_env: undefined,
  
        // Consider the server to be "running" after an explicit delay (in milliseconds)
        // (e.g. when server has no initial output)
        delay: 0,
  
        // Regular expression that matches server output to indicate it is "running"
        output: ".+",
  
        // Set --debug
        debug: false
      },
      dev: {
          options: {
            script: 'server.js'
          }
      }
    },
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
          src: ['Gruntfile.js', 'server.js', 'server/**/*.js', 'client/**/*.js']
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
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'server.js', 'client/**/*.js', 'server/*.js'],
        tasks: ['jshint'],
        options: {
          interrupt: true,
        }
      },
      tests: {
        files: ['test/**/*.test.js', 'server.js', 'client/**/*.js', 'server/*.js'],
        tasks: ['simplemocha'],
        options: {
          interrupt: true,
        }
      },
      client: {
        files: 'client/**/*.js',
        tasks: ['browserify', 'copy:bootstrap', 'copy:build', 'uglify'],
        options: {
          interrupt: true,
      },
      express: {
        files:  [ 'server.js', 'server/**/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      }
      }
    },
    simplemocha: {
        options: {
            globals: ['should'],
            timeout: 3000,
            ignoreLeaks: false,
//            reporter: 'nyan',
            ui: 'bdd'
        },

        all: {
            src: ['test/**/*.test.js']
        }
    }
  });
  // Default task(s).
  grunt.registerTask('build', ['jshint', 'browserify', 'copy:bootstrap', 'copy:build', 'uglify' ]);
  grunt.registerTask('default', ['express:dev', 'watch']);
  grunt.registerTask('test', ['jshint', 'build', 'express:dev', 'simplemocha', 'express:dev:stop' ]);  

};
