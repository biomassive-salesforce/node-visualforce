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
	var apexPageFlagsConfiguration = this.getPageFlagsConfiguration();
	var staticResourceName = defaultConfiguration["fileNames"].staticResourceName;
	// generates all the flags for the apex:page tag
	var $flags = "";
	Object.keys(apexPageFlagsConfiguration).forEach(function(item) {
		if (apexPageFlagsConfiguration[item].active === true) {
			$flags += " " + item + "=\"" + apexPageFlagsConfiguration[item].value + "\"";
		}
    });
	var replacementSettings = {
	    "tags": {
	    	"doctype": {
				"name": "<!DOCTYPE>",
				"regex": /<!DOCTYPE(.*?)>/ig,
				"replacement": ""
			},
			"htmlOpen": {
				"name": "<html>",
				"regex": /<html(.*?)>/ig,
				"replacement": "<apex:page" + $flags + ">"
			},
			"htmlClose": {
				"name": "</html>",
				"regex": /<\/html>/ig,
				"replacement": "</apex:page>"
			},
			"link": {
				"name": "<link>",
				"regex": /<link(.*?)href="(.*?)"(.*?)>/ig,
				"replacement": "<apex:stylesheet value='{!URLFOR($Resource." + staticResourceName + ", \"$2\")}'/>"
			},
			"script": {
				"name": "<script>",
				"regex": /<script(.*?)src="(.*?)"(.*?)><\/script>/ig,
				"replacement": "<apex:includeScript value='{!URLFOR($Resource." + staticResourceName + ", \"$2\")}'/>"
			}
		}
	};
    return replacementSettings;
};

/**
 * Apex Page flags configuration settings
 * @return {object} apex page flags configuration object
 */
exports.getPageFlagsConfiguration = function(){
	var apexPageFlags = {
		"action": {
			"value": "{!doAction}",
			"active": true
		},
		"apiVersion": {
			"value": "29.0",
			"active": true
		},
		"applyBodyTag": {
			"value": false,
			"active": false
		},
		"applyHtmlTag": {
			"value": false,
			"active": false
		},
		"cache": {
			"value": false,
			"active": false
		},
		"contentType": {
			"value": "text/html",
			"active": false
		},
		"controller": {
			"value": "",
			"active": false
		},
		"deferLastCommandUntilReady": {
			"value": false,
			"active": false
		},
		"docType": {
			"value": "html-5.0",
			"active": false
		},
		"expires": {
			"value": "600",
			"active": false
		},
		"extensions": {
			"value": "",
			"active": false
		},
		"id": {
			"value": "",
			"active": false
		},
		"label": {
			"value": "",
			"active": false
		},
		"language": {
			"value": "",
			"active": false
		},
		"manifest": {
			"value": "",
			"active": false
		},
		"name": {
			"value": "",
			"active": false
		},
		"pageStyle": {
			"value": "",
			"active": false
		},
		"readOnly": {
			"value": false,
			"active": false
		},
		"recordSetName": {
			"value": "",
			"active": false
		},
		"recordSetVar": {
			"value": "",
			"active": false
		},
		"renderAs": {
			"value": "",
			"active": false
		},
		"rendered": {
			"value": false,
			"active": false
		},
		"setup": {
			"value": false,
			"active": false
		},
		"showChat": {
			"value": false,
			"active": false
		},
		"showHeader": {
			"value": false,
			"active": true
		},
		"sidebar": {
			"value": false,
			"active": true
		},
		"standardController": {
			"value": "",
			"active": false
		},
		"standardStylesheets": {
			"value": "",
			"active": false
		},
		"tabStyle": {
			"value": "",
			"active": false
		},
		"title": {
			"value": "",
			"active": false
		},
		"wizard": {
			"value": false,
			"active": false
		}
	}
    return apexPageFlags;
};