'use strict';

var page = require('./lib/page.js');
var staticResources = require('./lib/staticResources.js');
var configuration = require('./lib/configuration').getConfiguration();
var utils = require('./lib/utils.js');

/**
 * module that builds the package to be exported
 * @param  {object} grunt grunt object
 * @return {void}       
 */
module.exports = function(grunt) {
  grunt.registerTask('build', function(){

    //set default configurations
    var options = this.options({
      inputPath: configuration.path.inputPath,
      outputPath: configuration.path.outputPath,
      staticResourceFolder: configuration.path.staticResourceFolder
    });

    if (utils.inputFolderStructureIsValid(options)) {
      //clears the output structure before build
      utils.clearSpecifiedFolder(options.outputPath);
      staticResources.buildStaticResources(options, this.async());
      page.buildPages(options);
    } else {
      //Creates input structure
      utils.createInputStructure(options);

      //Informs to the user
      console.log(String('The input structure was missing, we created it for you').cyan);
      console.log(String('Please refer to the README file to know how to use it').cyan);
    }
  });
};