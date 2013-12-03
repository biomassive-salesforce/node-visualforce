"use strict";

var grunt = require("grunt");
var utils = require("./utils.js");
var configuration = require("./configuration.js");

/**
 * module that buids visualforce pages based on html files
 * @return {void}
 */
exports.buildPages = function() {
  //extensions
  var HTML_EXT = "html";
  var PAGE_EXT = "page";

  var defaultConfiguration = configuration.getConfiguration();
  var replacementConfiguration = configuration.getReplacementConfiguration();
  var inputPath = defaultConfiguration["path"].inputPath;
  var outputPath = defaultConfiguration["path"].outputPath + defaultConfiguration["page"].outputPath;
  var tagsToReplace = replacementConfiguration["tags"];

  grunt.file.recurse("./" + inputPath + "/src/html/", function (abspath, rootdir, subdir, filename) {
    
    var delimiterPos = filename.lastIndexOf(".");
    var extension = filename.substring(delimiterPos + 1, filename.length);
    var dest = grunt.template.process(outputPath + filename.replace("." + HTML_EXT,"." + PAGE_EXT));
    
    if(extension === HTML_EXT){
      //creates a -meta.xml file for filename
      utils.buildXMLMeta(PAGE_EXT, filename.substring(0, delimiterPos));
      //creates a .page file for filename and replaces html tags
      var htmlCode = grunt.file.read(abspath);
      for (var tag in tagsToReplace) {
        var tagConfig = tagsToReplace[tag];
        htmlCode = utils.regexReplace(htmlCode, tagConfig);
        grunt.file.write(dest, htmlCode);
      }
    }

  });

};
