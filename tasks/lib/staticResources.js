"use strict";

var grunt = require("grunt");
var utils = require("./utils.js");
var constants = require("./constants.js");

/**
 * library that helps to build package.
 * @param {object} options configuration object
 * @param {function} done  async flag
 * @return {void}
 */
exports.buildStaticResources = function(options, done) {
	
	//Get Static Resource Name from configuration object
	var inputPath = options.inputPath;
	var outputPath = options.outputPath;
	var staticResourceName = options.staticResourceName;
	var staticResourceFolder = options.staticResourceFolder;
	
	//Compress Static Resources
	var zipper = require('./zipper.js')(grunt);

	zipper.compress(inputPath + staticResourceFolder, outputPath + staticResourceFolder, staticResourceName, 
					constants.STATIC_RESOURCE_EXTENSION, done);

	//Write Static Resource -meta.xml
	utils.buildXMLMeta(constants.XML_META_STATIC_RESOURCE, staticResourceName, constants.STATIC_RESOURCE_EXTENSION, outputPath);
};