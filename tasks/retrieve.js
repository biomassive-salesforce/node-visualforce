'use strict';

var path     = require('path'),
	configuration = require('./lib/configuration').getConfiguration(),
	localTmp = path.resolve(__dirname, '../tmp'),
	localAnt = path.resolve(__dirname, '../ant'),
	DecompressZip = require('decompress-zip'),
	fs = require('fs'),
	utils = require('./lib/utils.js');

/**
 * module that prepares an ant configuration and deploys to an ORG through ant
 * @param  {object} grunt grunt object
 * @return {void}
 */
module.exports = function(grunt){
    var antUtils = require('./lib/antUtils.js')(grunt);
    
    /**
     * Decompress static resource item
     * @param  {String}   input           [description]
     * @param  {String}   output          [description]
     * @param  {Array}   staticResources [description]
     * @param  {Integer}   index           [description]
     * @param  {Function} callback        [description]
     */
    function unzipResources(input, output, staticResources, index, callback){   
    	var filename = staticResources[index],
    		archive = input + filename,
    		name = filename.split('.');

    	var unzipper = new DecompressZip(archive)

    	//Error listener
		unzipper.on('error', function (err) {
		    console.log(String('Error decompressing ' + filename).red);
		});

		//Decompress completion listener
		unzipper.on('extract', function (log) {
		    console.log(String('Finished extracting ' + name[0]).cyan);

		    //Bind callback to decompress the next item in staticResources after 100 milliseconds
		    setTimeout(callback.bind(null, staticResources, index + 1), 100);
		});

		//Decompress the file located on 'archive'
		unzipper.extract({
		    path: output + name[0],
		    filter: function (file) {
		        return file.type !== "SymbolicLink";
		    }
		});
    }

    /**
     * Decompress StaticResources files from 'output' in the folder 'output' using the static resource 
     * name as the name of the folder where the resources will be stored
     * @param  {String}   input           [input folder path]
     * @param  {String}   output          [ouput folder path]
     * @param  {Array]   staticResources  [StaticResources to be decompressed]
     * @param  {Function} done            [Callback]
     */
    function unzipStaticResources(input, output, staticResources, done){
    	var index = 0;
		var length = staticResources.length;

		//Decompress each of the static resources files contained on 'staticResources'
		//staticResources: array containing the StaticResources to be decompressed
		//index: array index to be processed in unzip
		(function unzip(staticResources, index) {		
			if (index < length) {
				//Unzip StaticResources item (unzip is defined as a callback to re-execute the method after the item is 
				//decompressed)
				unzipResources(input, output, staticResources, index, unzip);						
			}else{
				console.log(String('All Static Resources retrieved from org were decompressed').cyan);	
				
				//Clear tmp folder			
				antUtils.clearLocalTmp();

				//Excecute main callback
				done();
			}
		})(staticResources, index); 
    }
  
    /**
     * Filter StaticResources array returning only the .resource files filtering any other file/folder stored in 
     * the array 
     * @param  {Array} staticResources [Array to be filterd]
     * @return {Array}                 [Filterd array including only the .reource files]
     */
    function filterStaticResources(staticResources) {

    	var result = staticResources.filter(function(item){
    		var filename = item.split('.');
			if(filename[filename.length - 1] === 'resource') {
				return true;
			}
    	});	

		return result;
    }

    /**
     * Function that register the grunt task and execute deployment
     * @return {void}
     */
    grunt.registerMultiTask('nv-retrieve', 'Run ANT Retrieve From Salesforce', function() {
    	console.log('This operation could take some seconds or minutes, depending on the size of the static resources to retrieve from the org');
	    	
        antUtils.makeLocalTmp();

        var done = this.async(),
        	target = this.target.green,
         	serverUrl = utils.getServerUrl(this.options),
         	template;

        if (typeof(this.options().proxyConfig) === 'undefined') {
            template = grunt.file.read(localAnt + '/antretrieve.build.xml');
        } else {
            template = grunt.file.read(localAnt + '/antretrieve.build.proxy.xml');
        }

        //object that defines configuration for the task
        var options = this.options({
            user: false,
            pass: false,
            token: false,
            root: localTmp,
            apiVersion: configuration.page.options.apiVersion,
            serverurl: serverUrl,
            pollWaitMillis: 10000,
            maxPoll: 20,
            retrieveTarget: false,
		    unzip: true,
		    existingPackage: false
        });
    	
    	var inputPath = configuration.path.inputPath + configuration.path.staticResourceFolder;

        grunt.log.writeln('Retrieve Target -> ' + target);
        antUtils.parseAuth(options, target);
        options.root = path.normalize(options.root);
        options.unpackaged = path.join(localTmp,'/package.xml');
	    if(!options.retrieveTarget) {options.retrieveTarget = options.root;}
	    var buildFile = grunt.template.process(template, { data: options });
	    grunt.file.write(path.join(localTmp,'/ant/build.xml'), buildFile);

	    if (!options.existingPackage) {
	      var packageXml = antUtils.buildPackageXml(this.data.pkg, options.apiVersion);
	      grunt.file.write(path.join(options.root,'/package.xml'), packageXml);
	      console.log('package created -> ' +  grunt.file.exists(options.root,'/package.xml'));
	    } else {
	      if(grunt.file.exists(options.root,'/package.xml')){
	        grunt.file.copy(path.join(options.root,'/package.xml'), path.join(localTmp,'/package.xml'));
	      } else {
	        grunt.log.error('No Package.xml file found in ' + options.root);
	        console.log('No Package.xml file found in ' + options.root);
	      }
	    }

	    antUtils.runAnt('retrieve', target, function(err, result) {
	    	var tmpStaticResources = path.join(options.root, '/staticresources/');

	      	if(grunt.file.exists(tmpStaticResources)){	      		

		      	var staticResources = fs.readdirSync(tmpStaticResources);

		      	if( staticResources !== null & staticResources.length > 0 ) {

			      	//Filter static Resources discarding the meta xmls
					staticResources = filterStaticResources(staticResources);

					//Decompress all the static resources retrieved from the org
					unzipStaticResources(tmpStaticResources, inputPath, staticResources, done);
				}else{
					console.log('There are not static resources retrieved from the org')
				}
			}
	    });

    });
   
};