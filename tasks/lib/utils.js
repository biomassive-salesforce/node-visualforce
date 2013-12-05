'use strict';

var grunt = require('grunt');
var configuration = require('./configuration.js');
var constants = require("./constants.js");

/**
 * function that builds the meta-data files
 * @param  {string} type     config type
 * @param  {string} fileName string with filename
 * @param  {string} outputDir output folder
 * @return {void}
 */
exports.buildXMLMeta = function(type, fileName, extension, outputDir) {
	var defaultConfiguration = configuration.getConfiguration();
	var metaType = defaultConfiguration[type].metaType;
	var outputPath = outputDir + defaultConfiguration[type].outputPath;
  var options = defaultConfiguration[type].options;

  var LABEL = "label";
  
  var packageXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<'+ metaType +' xmlns="http://soap.sforce.com/2006/04/metadata">'
  ];

  if(options) {
    Object.keys(options).forEach(function(key) {
      packageXml.push('    <' + key + '>' + (key === LABEL?fileName:options[key]) + '</' + key + '>');
    });
  }
  var dest = grunt.template.process(outputPath + fileName + '.' + extension) + '-meta.xml';
  packageXml.push('</'+ metaType +'>');
  grunt.file.write(dest, packageXml.join('\n'));
};

/**
 * function that replaces a src file using regex
 * @param  {string} src       src string to be replaced
 * @param  {object} tagConfig tag configuration object:
 *                          - regex: regular expresion to search
 *                          - replacement: string to use as a replacement
 *                          - name: string to use for log actions
 * @return {string} modified string          
 */
exports.regexReplace = function(src, tagConfig) {
  return String(src).replace(tagConfig.regex, tagConfig.replacement);
};
