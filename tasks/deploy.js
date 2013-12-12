'use strict';

var path     = require('path');
var metadata = require('./lib/metadata.json');
var configuration = require('./lib/configuration').getConfiguration();
var localTmp = path.resolve(__dirname, '../tmp');
var localAnt = path.resolve(__dirname, '../ant');
var localLib = path.resolve(__dirname, '../deps');


/**
 * function that seeks for the metadata
 * @param  {string} key key definition
 * @return {void}     
 */
function lookupMetadata(key) {
    key = key.toLowerCase();
    var typeName;
    // try to match on metadata type
    if(metadata[key] && metadata[key].xmlType) {
        typeName = metadata[key].xmlType;
    } else {
        // try to match on folder
        Object.keys(metadata).forEach(function(mk) {
            var folder = metadata[mk].folder;
            if(typeof folder === 'string' && folder.toLowerCase() === key) {
                typeName = metadata[mk].xmlType;
            } else if(key === 'documents') {
                typeName = metadata['document'].xmlType;
            } else if(key === 'emails') {
                typeName = metadata['email'].xmlType;
            } else if(key === 'reports') {
                typeName = metadata['report'].xmlType;
            } else if(key === 'dashboards') {
                typeName = metadata['dashboard'].xmlType;
            }
        });
    }
    return typeName;
}

/**
 * module that prepares an ant configuration and deploys to an ORG through ant
 * @param  {object} grunt grunt object
 * @return {void}
 */
module.exports = function(grunt){
    
    /**
     * function that clears the deployment folder structure.
     * @return {void}
     */
    function clearLocalTmp() {
        if(grunt.file.exists(localTmp)) {
            grunt.file.delete(localTmp, { force: true });
        }
    }

    /**
     * function that creates the directories for deployment
     * @return {void} 
     */
    function makeLocalTmp() {
        clearLocalTmp();
        grunt.file.mkdir(localTmp);
        grunt.file.mkdir(localTmp + '/ant');
    }

    /**
     * function that pase if the auth params comes from command line and set them
     * on options object
     * @param  {object} options configuration object
     * @param  {string} target  deployment org
     * @return {void}           
     */
    function parseAuth(options, target) {
        var un = (!options.useEnv) ? options.user  : process.env.SFUSER;
        var pw = (!options.useEnv) ? options.pass  : process.env.SFPASS;
        var tk = (!options.useEnv) ? options.token : process.env.SFTOKEN;
        if(tk){ pw += tk; }
        if(!un) { grunt.log.error('no username specified for ' + target); }
        if(!pw) { grunt.log.error('no password specified for ' + target); }
        if(!un || !pw){ grunt.fail.warn('username/password error'); }
        options.user = un;
        options.pass = pw;
        if(options.useEnv && process.env.SFSERVERURL) {
            options.serverurl = process.env.SFSERVERURL;
        }
        grunt.log.writeln('User -> ' + options.user.green);
    }

    /**
     * function that runs ant task
     * @param  {string}   task   ant task label
     * @param  {string}   target notification text
     * @param  {Function} done   async function
     * @return {void}            
     */
    function runAnt(task, target, done) {
        var args =  [
            '-buildfile',
            localTmp + '/ant/build.xml',
            '-lib',
            localLib,
            '-Dbasedir='     + process.cwd()
        ];
        args.push(task);
        grunt.log.debug('ANT CMD: ant ' + args.join(' '));
        grunt.log.writeln('Starting ANT ' + task + '...');
        var ant = grunt.util.spawn({
            cmd: 'ant',
            args: args
        }, function(error, result, code) {
            if(error) {
                grunt.fail.warn(error, code);
            } else {
                grunt.log.ok(task + ' target ' + target + ' successful');
            }
            done(error, result);
        });
        ant.stdout.on('data', function(data) {
            grunt.log.write(data);
        });
        ant.stderr.on('data', function(data) {
            grunt.log.error(data);
        });
    }

    /**
     * function that build the package xml to deploy resources
     * @param  {object} pkg     meta-data objecte
     * @param  {string} version saleforce api version
     * @return {array}          array whith xml
     */
    function buildPackageXml(pkg, version) {
        var packageXml = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<Package xmlns="http://soap.sforce.com/2006/04/metadata">'
        ];
        if(pkg) {
            Object.keys(pkg).forEach(function(key) {
                var type = pkg[key];
                var typeName = lookupMetadata(key);
                if(!typeName) { grunt.fail.fatal(key + ' is not a valid metadata type'); }
                packageXml.push('    <types>');
                type.forEach(function(t) {
                    packageXml.push('        <members>' + t + '</members>');
                });
                packageXml.push('        <name>' + typeName + '</name>');
                packageXml.push('    </types>');
            });
        }
        packageXml.push('    <version>' + version + '</version>');
        packageXml.push('</Package>');
        return packageXml.join('\n');
    }


    /**
     * funtion that register the grunt task and excute deployment
     * @return {void}
     */
    grunt.registerMultiTask('deploy', 'Run ANT deploy to Salesforce', function() {

        makeLocalTmp();

        var done = this.async();
        var target = this.target.green;

        if (typeof(this.options().proxyConfig) === 'undefined') {
            var template = grunt.file.read(localAnt + '/antdeploy.build.xml');
        } else {
            var template = grunt.file.read(localAnt + '/antdeploy.build.proxy.xml');
        }


        //object that defines configuration for the task
        var options = this.options({
            user: false,
            pass: false,
            token: false,
            root: configuration.path.outputPath,
            apiVersion: configuration.page.options.apiVersion,
            serverurl: 'https://login.salesforce.com',
            pollWaitMillis: 10000,
            maxPoll: 20,
            checkOnly: false,
            runAllTests: false,
            rollbackOnError: true,
            useEnv: false
        });

        grunt.log.writeln('Deploy Target -> ' + target);
        parseAuth(options, target);

        options.tests = this.data.tests || [];
        var buildFile = grunt.template.process(template, { data: options });

        grunt.file.write(localTmp + '/ant/build.xml', buildFile);

        var packageXml = buildPackageXml(this.data.pkg, options.apiVersion);
        grunt.file.write(options.root + '/package.xml', packageXml);

        runAnt('deploy', target, function(err, result) {
            clearLocalTmp();
            done();
        });

    });

    /*************************************
   * antdestroy task
   *************************************/

  grunt.registerMultiTask('undeploy', 'Run ANT destructive changes to Salesforce', function() {

    makeLocalTmp();

    var done = this.async();
    var target = this.target.green;
    var template = grunt.file.read(localAnt + '/antdeploy.build.xml');

    var options = this.options({
      user: false,
      pass: false,
      token: false,
      root: 'build',
      apiVersion: '29.0',
      serverurl: 'https://login.salesforce.com',
      checkOnly: false,
      runAllTests: false,
      rollbackOnError: true,
      useEnv: false
    });

    grunt.log.writeln('Destroy Target -> ' + target);

    parseAuth(options, target);

    options.tests = this.data.tests || [];

    var buildFile = grunt.template.process(template, { data: options });
    grunt.file.write(localTmp + '/ant/build.xml', buildFile);

    var packageXml = buildPackageXml(null, options.apiVersion);
    grunt.file.write(options.root + '/package.xml', packageXml);

    var destructiveXml = buildPackageXml(this.data.pkg, options.apiVersion);
    grunt.file.write(options.root + '/destructiveChanges.xml', destructiveXml);

    runAnt('deploy', target, function(err, result) {
      clearLocalTmp();
      done();
    });

  });

};