'use strict';

var page = require('./lib/page.js');
var staticResources = require('./lib/staticResources.js');
var configuration = require('./lib/configuration').getConfiguration();

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
      staticResourceFolder: configuration.path.staticResourceFolder,
      staticResourceName: configuration.fileNames.staticResourceName
    });
  
    staticResources.buildStaticResources(options, this.async());
    page.buildPages(options);
  });
};