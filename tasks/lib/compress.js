var util = require('./utils.js');
var path = require('path');
var fs = require('fs');

/**
 * method to compress.
 * @param  {string} inputPath  
 * @param  {string} outputPath 
 * @param  {string} filename   
 * @return {void}            
 */
exports.compress = function(inputPath, outputPath, filename){
	util.zipFile(inputPath, outputPath, filename);
}
