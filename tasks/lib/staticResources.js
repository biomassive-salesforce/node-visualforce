"use strict";

var utils = require("./utils.js");
var configuration = require("./configuration.js");
var constants = require("./constants.js");

/**
 * library that helps to build package.
 * @return {void}
 */
exports.buildStaticResources = function() {
	var defaultConfiguration = configuration.getConfiguration();

	//Get Static Resource Name from settings.json
	var staticResourceName = defaultConfiguration[constants.FILENAME_CONFIGURATION_KEY].staticResourceName;

	//Write Static Resource -meta.xml
	utils.buildXMLMeta(constants.XML_META_STATIC_RESOURCE, staticResourceName);
};