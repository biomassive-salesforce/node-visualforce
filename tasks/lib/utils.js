'use strict';

var grunt = require('grunt');
var configuration = require('./configuration.js');

/**
 * function that builds the meta-data files
 * @param  {string} type     config type
 * @param  {string} fileName string with filename
 * @return {void}
 */
exports.buildXMLMeta = function(type, fileName) {
	var defaultConfiguration = configuration.getConfiguration();
	var metaType = defaultConfiguration[type].metaType;
	var outputPath = defaultConfiguration['path'].outputPath + defaultConfiguration[type].outputPath;
  var options = defaultConfiguration[type].options;
  
  var packageXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<'+ metaType +' xmlns="http://soap.sforce.com/2006/04/metadata">'
  ];

  if(options) {
    Object.keys(options).forEach(function(key) {
      packageXml.push('    <' + key + '>' + (key === 'label'?fileName:options[key]) + '</' + key + '>');
    });
  }
  var dest = grunt.template.process(outputPath + fileName) + '-meta.xml';
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
 * @return {string} updatedSrc modified string          
 */
exports.regexReplace = function(src, tagConfig) {
  //takes the src content and changes the content
  var regExp = null,
      updatedSrc;
  if(typeof tagConfig.regex ===  'string'){
    regExp = new RegExp(tagConfig.regex , 'ig'); //regex => string
  } else {
    regExp = tagConfig.regex; //regex => RegExp object
  }
  updatedSrc = String(src).replace(regExp, tagConfig.replacement); //note: substr can be a function
  grunt.log.writeln(tagConfig.name + ' --> ' + tagConfig.replacement);
  return updatedSrc;
};
