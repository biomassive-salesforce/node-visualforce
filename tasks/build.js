'use strict';

var page = require('./lib/page.js');
//var staticResources = require('./lib/staticResources.js'); 

/**
 * module that builds the package to be exported
 * @param  {object} grunt grunt object
 * @return {void}       
 */
module.exports = function(grunt) {
  grunt.registerTask('build', function(){
    //staticResources.buildStaticResources();
    page.buildPages();
  });
};