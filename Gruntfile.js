'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    jshint:{
      server: {
        src: ['Gruntfile.js', 'server.js', 'models/*.js', 'routes/*.js']
      },
      mocha: {
        src: ['test/*test.js'],
        options:{
          globals: {
            describe: true,
            it: true,
            before: true,
            beforeEach: true,
            after: true,
            afterEach: true
          }
        }
      },
      client: {
        src: ['app/**/*.js'],
        options:{
          globals: {
            angular: true
          }
        }
      },
      options: {
        node: true
      }
    },

    simplemocha: {
      dev: {
        src:['test/*.js']
      }
    },

    webpack:{
      client:{
        entry: __dirname + '/app/js/client.js',
        output: {
          path: 'build/',
          file: 'bundle.js'
        }
      },
      karma_test: {
        entry: __dirname + '/test/karma_tests/test_entry.js',
        output: {
          path: 'test/karma_tests/',
          file: 'bundle.js'
        }
      }
    },

    karma: {
      test: {
        configFile: 'karma.conf.js'
      }
    },

    copy: {
      html: {
        cwd: 'app/',
        expand: true,
        flatten: false,
        src: '**/*.html',
        dest: 'build/',
        filter: 'isFile'
      },
      css: {
        cwd: 'app/',
        expand: true,
        flatten: false,
        src: '**/*.css',
        dest: 'build/',
        filter: 'isFile'
      }
    },

    clean: {
      dev: {
        src: 'build/'
      }
    },

    watch: {
      scripts: {
        files: ['app/**/*.js'],
        tasks: ['build']
      }
    }
  });

  grunt.registerTask('build:dev', ['webpack:client', 'copy:html', 'copy:css']);
  grunt.registerTask('build', ['build:dev']);
  grunt.registerTask('lint', ['jshint:server', 'jshint:mocha', 'jshint:client']);
  grunt.registerTask('mocha', ['simplemocha:dev']);
  grunt.registerTask('test', ['mocha']);
  grunt.registerTask('default', ['test', 'lint']);
  grunt.registerTask('testKarma', ['webpack:karma_test', 'karma:test']);
};
