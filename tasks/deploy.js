'use strict';

var path     = require('path'),
    configuration = require('./lib/configuration').getConfiguration(),
    localTmp = path.resolve(__dirname, '../tmp'),
    localAnt = path.resolve(__dirname, '../ant'),
    utils = require('./lib/utils.js');

/**
 * module that prepares an ant configuration and deploys to an ORG through ant
 * @param  {object} grunt grunt object
 * @return {void}
 */
module.exports = function(grunt){
    var antUtils = require('./lib/antUtils.js')(grunt);  

    /**
     * funtion that register the grunt task and excute deployment
     * @return {void}
     */
    grunt.registerMultiTask('nv-deploy', 'Run ANT deploy to Salesforce', function() {

        antUtils.makeLocalTmp();

        var done = this.async(),
            target = this.target.green,
            serverUrl = utils.getServerUrl(this.options),
            template;

        if (typeof(this.options().proxyConfig) === 'undefined') {
            template = grunt.file.read(localAnt + '/antdeploy.build.xml');
        } else {
            template = grunt.file.read(localAnt + '/antdeploy.build.proxy.xml');
        }

        console.log('ant ' + serverUrl);

        //object that defines configuration for the task
        var options = this.options({
            user: false,
            pass: false,
            token: false,
            root: configuration.path.outputPath,
            apiVersion: configuration.page.options.apiVersion,
            serverurl: serverUrl,
            pollWaitMillis: 10000,
            maxPoll: 20,
            checkOnly: false,
            runAllTests: false,
            rollbackOnError: true,
            useEnv: false
        });

        grunt.log.writeln('Deploy Target -> ' + target);
        antUtils.parseAuth(options, target);

        options.tests = this.data.tests || [];
        var buildFile = grunt.template.process(template, { data: options });

        grunt.file.write(localTmp + '/ant/build.xml', buildFile);

        var packageXml = antUtils.buildPackageXml(this.data.pkg, options.apiVersion);
        grunt.file.write(options.root + '/package.xml', packageXml);

        antUtils.runAnt('deploy', target, function(err, result) {
            utils.clearSpecifiedFolder(localTmp);
            done();
        });

    });
};