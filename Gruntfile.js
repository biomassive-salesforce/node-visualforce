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
    'nv-deploy': {
      dev1: {
        options: {
          user: 'myusername@test.com',
          pass: 'mypassword',
          token: 'mytoken'
        },
        pkg: {
          staticresource: ['*'],
          apexpage: ['*']
        }
      }
    },
    'nv-retrieve': {      
      dev1: {
        options: {
          user: 'myusername@test.com',
          pass: 'mypassword',
          token: 'mytoken'
        },
        /* Target-specific file lists to retrieve. */
        pkg: {
          staticresource: ['*']
        }
      }
    },
    'nv-undeploy': {
      your_target: {
        options:{
          user: 'myusername@test.com',
          pass: 'mypassword',
          token: 'mytoken'
        },
        /* Target-specific file lists to undeploy. */
        pkg: {   
          apexpage: ['*'],
          staticresources: ['*']
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