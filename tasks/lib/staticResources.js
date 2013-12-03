"use strict";

var utils = require("./utils.js");
var configuration = require("./configuration.js");

/**
 * library that helps to build package.
 * @return {void}
 */
exports.buildStaticResources = function() {
	var defaultConfiguration = configuration.getConfiguration();

	//Get Static Resource Name from settings.json
	var staticResourceName = defaultConfiguration.fileNames.staticResourceName;

	//Write Static Resource -meta.xml
	utils.buildXMLMeta("package", staticResourceName);
};