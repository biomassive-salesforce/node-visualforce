"use strict";

/**
 * function that returns config object
 * @return {object} configuration object
 */
exports.getConfiguration = function(){
	var defaultSettings = {
		"path": { // application paths to define output and source files
			"inputPath": "input/",
			"outputPath": "output/src/",
			"staticResourceFolder": "static-resources/"
		},
		"fileNames": {
			"staticResourceName": "staticResources"
		},
		"page": { // visualforce pages build configuration
			"metaType": "ApexPage",
			"outputPath": "pages/",
			"options": {
			"apiVersion": "29.0",
			"description": "Page upload on Salesforce using Grunt SF Deploy plugin",
			"label": "Page Name"
			}
		},
		"package": { // package build configuration
			"metaType": "StaticResource",
			"outputPath": "static-resources/",
			"options": {
			"cacheControl": "Public",
			"contentType": "application/zip",
			"description": "Project Static Resources"
			}
		}
	};
	return defaultSettings;
};


/**
 * Page tags replacement configuration settings
 * @return {object} configuration replacement object
 */
exports.getReplacementConfiguration = function(){
	var defaultConfiguration = this.getConfiguration();
	var staticResourceName = defaultConfiguration["fileNames"].staticResourceName;
	var replacementSettings = {
	    "tags": {
			"htmlOpen": {
				"name": "<html>",
				"regex": /<html(.*?)>/,
				"replacement": "<apex:page>"
			},
			"htmlClose": {
				"name": "</html>",
				"regex": /<\/html>/,
				"replacement": "</apex:page>"
			},
			"link": {
				"name": "<link>",
				"regex": /<link(.*?)href="(.*?)"(.*?)>/,
				"replacement": "<apex:stylesheet value='{!URLFOR($Resource." + staticResourceName + ", \"$2\")}'/>"
			},
			"script": {
				"name": "<script>",
				"regex": /<script(.*?)src="(.*?)"(.*?)><\/script>/,
				"replacement": "<apex:includeScript value='{!URLFOR($Resource." + staticResourceName + ", \"$2\")}'/>"
			}
		}
	};
    return replacementSettings;
};