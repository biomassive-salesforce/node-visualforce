'use strict';

module.exports = function(grunt) {

  //Set Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: ['tasks/*.js','tasks/lib/*.js','Gruntfile.js'],
        tasks: ['jshint'],
        options: {
          spawn: false,
          event: ['added', 'changed']
        }
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/lib/*.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    nodeunit: {
      all: ['test/**/*_test.js']
    },
    deploy: {
        options: {
            proxyConfig: {
              proxyHost: 'proxy.corp.globant.com',
              proxyPort: '3128'
            }
        },
        dev1: {
            options: {
                user:  'federico@sfadm.test',
                pass:  'force36206a',
                token: 'aHJVm2eWU4Ibhl8ndwkkd2wtN'
            },
            pkg: {
                staticresource: ['*'],
                apexpage: ['*']
            }
        }
    }
  });
 
  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');
  // By default, lint and run all tests.
  grunt.registerTask('default', ['watch']);

};