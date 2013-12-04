"use strict";

var conf = require('./tasks/lib/configuration.js').getConfiguration();

module.exports = function(grunt) {

  var staticResourceInputPath = conf.path.inputPath + conf.path.staticResourceFolder;
  var staticResourceOutputPath = conf.path.outputPath +  conf.path.staticResourceFolder + conf.path.staticResourceName;


  //Set Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compress: {
      main: {
        options: {
          archive: staticResourceOutputPath + '.zip'
        },
        expand: true,
        cwd: staticResourceInputPath,
        src: ['**/*']
      }
    },
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
        "Gruntfile.js",
        "tasks/lib/*.js",
        "tasks/*.js",
      ],
      options: {
        jshintrc: ".jshintrc",
      }
    },
    nodeunit: {
      all: ['test/**/*_test.js']
    }
  });
 
  // These plugins provide necessary tasks.
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Actually load this plugin"s task(s).
  grunt.loadTasks("tasks");
  // By default, lint and run all tests.
  grunt.registerTask("default", ["watch"]);
  
};