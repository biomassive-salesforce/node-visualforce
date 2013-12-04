"use strict";

var utils = require("./utils.js");
var constants = require("./constants.js");

/**
 * library that helps to build package.
 * @param {object} options configuration object
 * @return {void}
 */
exports.buildStaticResources = function(options) {
	
	//Get Static Resource Name from configuration object
	var staticResourceName = options.staticResourceName;
	var outputPath = options.outputPath;

	//Write Static Resource -meta.xml
	utils.buildXMLMeta(constants.XML_META_STATIC_RESOURCE, staticResourceName, outputPath);
};