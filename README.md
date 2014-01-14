##Node-visualforce

Node-visualforce is a Grunt plugin that allows to deploy a static web project into a Salesforce ORG as Visualforce pages including their static resources (css, img, fonts, js).
It converts .html files to visualforce .page format and generates the corresponding apex tags and xml files.
For the static resources it compresses all files in the designated folder to a one .resource file.
This Grunt plugin works using the migration tool API to connect to a Salesforce ORG, so it requires ANT installed. 

###Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-node-visualforce --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:
```js
  grunt.loadNpmTasks('grunt-node-salesforce');
```
If you want to create a 'Build' and 'Deploy' grunt task you can add the following to Gruntfile
```js
  grunt.registerTask('buildAndDeploy', ['build', 'deploy']);
```
Once you added the task to your Gruntfile, you have to put all your project files inside the following folder structure:
```shell
  - /input
    - /pages               #put all your .html files here
    - /staticresources     #static resources folder put your resources files here.
      - /css
      - /js
      - /img
      - /fonts
```
Internally you need to reference the static resources (css, js, img, fonts) using absolute or relative ('../' or '/') paths 

###Configuring the plugin

The plugin is configured in two separate modules called build and deploy showed in the example:

```js
grunt.initConfig({
  build: {
    options: {
      inputPath:'input/',
      outputPath:'output/',
      staticResourceName:'staticResources',
      apexPageFlags: {"flagName1": value1, "flagName2": value2}
    }
  },
  deploy: {
    your_target: {
      options:{
        user:'myusername@test.com',
        pass:      'mypassword',
        token:     'mytoken',
        serverurl: 'https://test.salesforce.com', // default => https://login.salesforce.com
        apiVersion: '29.0'
      },
      // This config option is used by he package.xml generator, you can target specific files or using '*' fot targeting all of a specific type
      pkg: {
        staticresource: ['*'],
        apexpage: ['*']
      }
    }
  }
});
```


###Grunt build
Running the command 'grunt build' creates the following /output folder structure

```shell
  - /output
    - /pages                #visualforce page files will be here
    - /staticresources      #static resources package will be here
```
It generates the visualforce page files (and the corresponding metadata files) from the html files located on the /input/pages folder and put them on /output/pages.

It creates a static resource package (and the corresponding metadata file) from all the files located on the /staticresources subfolders and put it on /output/staticresources.

### Build-Task options

####options.inputPath
Type: `String`
Default value: `'input/'`
This option sets the source folder where there´re the files to process

####options.outputPath
Type: `String`
Default value: `output/`
output folder where the plugin create the *.page files and the static resource file to be deployed on

####options.staticResourceName
Type: `String`
Default value: `staticResources`
static resource file name

###Optional

####options.apexPageFlags
Type: `Object`
Default value: `{"showHeader": false, "standardStylesheets": false}`
This option sets flags to the <apex:page> tag. You must set flag name (i.e. "showHeader") and value (String, Number or Boolean) as you want. Check all the current flags here: http://www.salesforce.com/us/developer/docs/pages/Content/pages_compref_page.htm

The default values ("showHeader" and "standardStylesheets") allows the plugin to override the Org standard stylesheets. They are added automatically to the apex:page tag unless you set those flags to true.


###Grunt Deploy

Running the command 'grunt deploy' deploys all the generated visualforce pages (with metadata) and the static-resources package (with metadata) to the configured Salesforce Org.

###Deploy-Task options

####options.user
Type: `String`
Required: `true`
Your Salesforce.com username.

####options.pass
Type: `String`
Required: `true`
Your Salesforce.com password.

####options.token
Type: `String`
Your Salesforce.com security token.

####options.serverurl
Type: `String`
Default value: `'https://login.salesforce.com'`
This option sets login url.

####options.apiVersion
Type: `String`
Default value: `'29.0'`
This option sets the api version to use for the package deployment.

####Proxy options
If you are under a proxy you will need to add the proxy host and port to the deploy config module so the ant server can reach the org for deployment:
```js
grunt.initConfig({
  deploy: {
    your_target: {
      options:{
          proxyConfig: {
            proxyHost: "proxy.domain.com",
            proxyPort: "1111"
          }
      }
    }
  }
})
```

####Undeploy
running the command 'grunt undeploy' removes all the pages and staticresources specified in the options of the task:
```js
grunt.initConfig({
  undeploy: {
    your_target: {
      options:{
      },
      // Target-specific file lists and/or options go here.
      pkg: {   
        apexpages: [index, section1],
        staticresources: [staticresources]
      }
    }
  }
})
```

Node-Visualforce includes a To Do List simple sample to be able to validate the correct plugin's installation and configuration. Please go to your node_modules/node-visualforce/sample and follow the instructions detailed in the README file.