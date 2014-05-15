'use strict';

module.exports = function(grunt) {

  //Set Project configuration.
  grunt.initConfig({
    deploy: {
        dev1: {
            options: {
                user: 'myusername@test.com',
                pass: 'mypassword',
                token: 'mytoken'
            },
            pkg: {
                staticresource: ['*'],
                apexpage: ['*']
            }
        }
    }
  });
 
  //Load grunt node salesforce plugin
  grunt.loadNpmTasks('node-visualforce');
};