'use strict';

var grunt = require('grunt');
var configuration = require('../tasks/lib/configuration').getConfiguration();

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

//Default Configuration 
var options = {
  inputPath: configuration.path.inputPath,
  outputPath: configuration.path.outputPath,
  staticResourceName: configuration.fileNames.staticResourceName
};

/**
 * Copy test files (html and static resources (css, img, js and fonts) into inputPath folders
 * @param  {Array} htmlFiles: files to be saved on inputPath folder
 * @return void
 */
function prepare_test(htmlFiles){
  //Copy HTML file to input/pages
  htmlFiles.forEach(function(file){
    grunt.file.copy('./test/testFiles/' + file, './' + options.inputPath + 'pages/' + file);
  });    

  //Copy Static resources to input/staticresources
  grunt.file.recurse('./test/testFiles/staticresources', function callback(abspath, rootdir, subdir, filename){
    grunt.file.copy(abspath, './' + options.inputPath + 'staticresources/' + subdir + '/' + filename);
  });
};

/**
 * Deletes all the files used during the test
 * @param  {Array} htmlFiles
 * @return {void}
 */
function clean_test(htmlFiles){
  //Deletes htmls from input/pages 
  htmlFiles.forEach(function(file){
    grunt.file.delete('./' + options.inputPath + 'pages/' + file + '.html');
  });

  //Deletes static resources from input/staticresources
  grunt.file.delete('./' + options.inputPath + 'staticresources/css');
  grunt.file.delete('./' + options.inputPath + 'staticresources/img');
  grunt.file.delete('./' + options.inputPath + 'staticresources/js');
  grunt.file.delete('./' + options.inputPath + 'staticresources/fonts');

  //Removes outputh path with all the content (pages and pages-meta.xml from outputPath + 'pages')' and .resource and
  //.resource-meta.xml from outputPath + 'staticresources' 
  grunt.file.delete('./' + options.outputPath);
}

/**
 * Validates input htmls insertion
 * @param  {Object} test: nodeunit object
 * @param  {Array} filesArray: files used on the test
 * @return {void}
 * Executes filesArray.length expected assertions
 */
function validate_input_htmls(test, filesArray){
  filesArray.forEach(function(filename){
    var fileExist = grunt.file.exists('./' + options.inputPath + 'pages/' + filename);    
    test.ok(fileExist, 'Input file was not saved on the input/pages folder');
  });
}

/**
 * Validates .page creation and replacements 
 * @param  {Object} test: nodeunit object
 * @param  {String} filename: page file name being processed
 * @return {void}
 * Executes 12 expected assertions
 */
function validate_page_creation_and_replacements(test, filename){
  //Validate .page creation
  var page = grunt.file.read('./' + options.outputPath + 'pages/' + filename + '.page'); 
  test.ok(page, 'The .page was not created on the output/pages folder');

  //Validate removed tags
  test.ok(page.match(/<!DOCTYPE(.*?)>/ig) == null , 'The .page file contains an <!DOCTYPE> tag');
  test.ok(page.match(/<html(.*?)>/ig) == null , 'The .page file contains an <html ..> tag');
  test.ok(page.match(/<\/html>/ig) == null , 'The .page file contains an </html> tag');
  test.ok(page.match(/<link(.*?)href="(.*?)"(.*?)>/ig) == null , 'The .page file contains an <link ..> tag');
  test.ok(page.match(/<script(.*?)src="(.*?)"(.*?)><\/script>/ig) == null , 'The .page file contains an <script ..> tag');

  //Validates replaced tags
  test.ok(page.match(/<apex:page(.*?)>/g) , 'The .page file does not contains an <apex:page> tag');
  test.ok(page.match(/<\/apex:page>/g) , 'The .page file does not contains an </apex:page> tag'); 
  test.ok(page.match(/<apex:stylesheet(.*?)>/g), 'The .page file contains <apex:stylesheet ..> tag');
  test.ok(page.match(/<apex:includeScript value='{!URLFOR((.*?), (.*?)jquery.min.js(.*?))}'\/>/ig), 'The .page file contains <apex:includeScript .. "js/libs/jquery.min.js"> tag');
  test.ok(page.match(/<apex:includeScript value='{!URLFOR((.*?), (.*?)underscore.min.js(.*?))}'\/>/ig), 'The .page file contains <apex:includeScript .. "js/libs/underscore.min.js"> tag');
  test.ok(page.match(/<apex:includeScript value='{!URLFOR((.*?), (.*?)backbone.min.js(.*?))}'\/>/ig), 'The .page file contains <apex:includeScript .. "js/libs/backbone.min.js"> tag');
}

/**
 * Validates .page-meta.xml creation and content
 * @param  {Object} test: nodeunit object
 * @param  {String} filename: page file name being processed
 * @return {void}
 * Executes 7 expected assertions
 */
function validate_page_meta_xml_creation_and_content(test, filename){
  //Validate .page-meta.xml creation
  var pageMeta = grunt.file.read('./' + options.outputPath + 'pages/' + filename + '.page-meta.xml');      
  test.ok(pageMeta, 'The .page-meta.xml was not created on the output/pages folder');

  //Validates meta-xml content
  var labelRegex = new RegExp('<label>' + filename + '</label>', "g");
  test.ok(pageMeta.match(/<?xml(.*?)>/g) , 'The .page-meta.xml file does not contains an <?xml ..> tag');
  test.ok(pageMeta.match(/<ApexPage(.*?)>/g) , 'The .page-meta.xml file does not contains an <ApexPage ..> tag');
  test.ok(pageMeta.match(/<apiVersion>(.*?)<\/apiVersion>/g) , 'The .page-meta.xml file does not contains an <apiVersion ..> tag');
  test.ok(pageMeta.match(/<description>(.*?)<\/description>/g) , 'The .page-meta.xml file does not contains an <description ..> tag');
  test.ok(pageMeta.match(labelRegex) , 'The .page-meta.xml file does not contains an <label ..> tag');
  test.ok(pageMeta.match(/<\/ApexPage(.*?)>/g) , 'The .page-meta.xml file does not contains an </ApexPage ..> tag');
}

/**
 * Validates static resource creation
 * @param  {Object} test: nodeunit object
 * @return {void}
 * Executes 1 expected assertions 
 */
function validate_static_resource_creation(test){
  var staticResourceExists = grunt.file.exists('./' + options.outputPath + 'staticresources/' + 
                             options.staticResourceName + '.resource'); 
  test.ok(staticResourceExists, 'The .resource was not created on the output/staticresources folder');
}

/**
 * Validates static resource meta xml creation and content
 * @param  {Object} test: nodeunit object
 * @return {void}
 * Executes 7 expected assertions 
 */
function validate_static_resource_meta_xml_creation_and_content(test){
  var staticResourceMeta = grunt.file.read('./' + options.outputPath + 'staticresources/' + options.staticResourceName + 
                           '.resource-meta.xml'); 
  test.ok(staticResourceMeta, 'The .resource-meta.xml was not created on the output/staticresources folder');

  //Validates meta-xml content
  test.ok(staticResourceMeta.match(/<?xml(.*?)>/g) , 'The .resource-meta.xml file does not contains an <?xml ..> tag');
  test.ok(staticResourceMeta.match(/<StaticResource(.*?)>/g) , 'The .resource-meta.xml file does not contains an <StaticResource ..> tag');
  test.ok(staticResourceMeta.match(/<cacheControl>Public<\/cacheControl>/g) , 'The .resource-meta.xml file does not contains an <cacheControl ..> tag');
  test.ok(staticResourceMeta.match(/<contentType>application\/zip<\/contentType>/g) , 'The .resource-meta.xml file does not contains an <contentType ..> tag');
  test.ok(staticResourceMeta.match(/<description>(.*?)<\/description>/g) , 'The .resource-meta.xml file does not contains an <label ..> tag');
  test.ok(staticResourceMeta.match(/<\/StaticResource(.*?)>/g) , 'The .resource-meta.xml file does not contains an </StaticResource ..> tag');
}

/**
 * Performs Build Task test
 * @param  {Object} test: node unit Object
 * @param  {Array} inputFilesArray: files to be used in the test
 * @param  {Boolean} cleanData: defines if the data needs to be cleaned after the test
 * @return {void}
 * Executes inputFilesArray.length expected assertions 
 */
function do_build_test(test, inputFilesArray, cleanData){
  var fileNameArray = [];

  //Validate inputs
  validate_input_htmls(test, inputFilesArray);

  //Call build test task
  grunt.util.spawn({ grunt: true, args: ['build'], opts: options}, function() {
    //Validates .page and .page-meta.xml creation for each file on inputPath / pages
    grunt.file.recurse('./' + options.inputPath + 'pages/', function callback(abspath, rootdir, subdir, filename){

      //Validates that the file processed is expected
      test.ok(inputFilesArray.indexOf(filename) != -1, 'The file ' + filename + ' was not expected');

      //Remove the extension
      var filenameWithoutExtension = filename.substring(0, filename.lastIndexOf("."));

      //Validate .page creation and .page replacements
      validate_page_creation_and_replacements(test, filenameWithoutExtension);
     
      //Validate .page-meta.xml creation and meta-xml content
      validate_page_meta_xml_creation_and_content(test, filenameWithoutExtension);

      fileNameArray.push(filenameWithoutExtension);
    });

    //Validates Static Resource creation
    validate_static_resource_creation(test);
   
    //Validates Static Resources meta-xml creation and content
    validate_static_resource_meta_xml_creation_and_content(test);
    
    test.done();

    if ( cleanData ){
      //Delete files used on test
      clean_test(fileNameArray);
    }
  });
  
}

exports.build = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  /**
   * Tests a .page and .page-meta.xml creation from a single html, a .resource and .resource-meta.xml creation
   * from staticresources (css, img, js) 
   * @param  {Object} test: node unit Object
   * @return void
   */
  validate_page_creation: function(test){    
    var cleanData = true;
    
    //Configure input html files
    var inputFilesArray = ['test_file.html'];
   
    //Prepare test files
    prepare_test(inputFilesArray);
    
    test.expect(29);

    //Run test and clean test Data 
    do_build_test(test, inputFilesArray, cleanData);     
  },
  /**
   * Tests a .page and .page-meta.xml creation from three html, a .resource and .resource-meta.xml creation
   * from staticresources (css, img, js) 
   * @param  {Object}  test: node unit Object
   * @return void
   */
  validate_three_page_creation: function(test){    
    var cleanData = true;
    
    //Configure input html files
    var inputFilesArray = ['test_file.html', 'test_2_file.html', 'test_3_file.html'];

    //Prepare test files
    prepare_test(inputFilesArray);
    
    test.expect(71);

    //Run test and clean test Data 
    do_build_test(test, inputFilesArray, cleanData);     
  }
};