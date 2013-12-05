"use strict";

/**
 * function that returns config object
 * @return {object} configuration object
 */
exports.getConfiguration = function(){
	//Default configuration
	var defaultSettings = {		
		"path": { // application paths to define output and source files
			//inputPath: source input path, where the src/html and static-resources (css, fonts, img, js) folders needs to be 
			//located
			"inputPath": "input/",
			//outputPath: output folder where the plugin create the *.page files and the static resource file to be deployed on 
			//the configured Salesforce Org
			"outputPath": "output/src/",
			//staticResourceFolder: folder used on input and output path to store the static resources (this property shouldn't 
			//be changed)
			"staticResourceFolder": "staticresources/",
			//pagesFolder: folder used on input path to store the html pages (this property shouldn't be changed)
			"pagesFolder": "pages/"
		},
		"fileNames": {//application file name configuration
			//staticResourceName: static resource file name (configurable)
			"staticResourceName": "staticResources"
		},
		"page": { // visualforce pages meta xml build configuration
			//metatype: page meta type
			"metaType": "ApexPage",
			//outputPath: folder to store the page meta xml
			"outputPath": "pages/",
			"options": {// page meta configuration items
				//apiVersion: api version to be used by the page
				"apiVersion": "29.0",
				//description: general page description
				"description": "Page upload on Salesforce using Grunt SF Deploy plugin",
				//label: page name 
				"label": "Page Name"
			}
		},
		"package": { // package meta xml build configuration
			//metatype: static resource meta type
			"metaType": "StaticResource",
			//outputPath: folder to store the static resource meta xml
			"outputPath": "staticresources/",
			"options": {//static resource meta configuration items
				//cacheControl: static resource cache control
				"cacheControl": "Public",
				//contentType: static resource content type
				"contentType": "application/zip",
				//description: static resource description 
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