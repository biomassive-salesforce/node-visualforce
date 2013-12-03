"use strict";

var utils = require("./lib/utils");

/**
 * module that creates meta-data files to final upload
 * @param  {object} grunt grunt object
 * @return {void}       
 */
module.exports = function(grunt) {
	// package module
	grunt.registerTask("package", "This task creates the package", function() {
	
	//Get Static Resource Name from settings.json
	var settings = grunt.file.readJSON("settings.json");
    var staticResourceName = settings["configuration"].staticResourceName;

	//Write Static Resource -meta.xml
	utils.buildXMLMeta("package", staticResourceName);
  });
};