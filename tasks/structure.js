"use strict";

var conf = require("./lib/configuration.js").getConfiguration();

/**
 * module that manage the structure of folders
 * @param  {object} grunt 
 * @return {void}
 */
module.exports = function(grunt) {
  
  // structure module
  grunt.registerTask("structure", "This task creates the folder structure", function() {

    //loop througth directories
    grunt.file.recurse(conf.path.inputPath, function (abspath, rootdir, subdir, filename) {

      var newPath = abspath.replace(conf.path.inputPath, conf.path.outputPath);

      //copies the files and creates the output directory
      grunt.file.copy(abspath, newPath);
    });
  });
};