##Node-visualforce
----
Node-visualforce is a Grunt plugin that allows to:
- <b>Build</b> and <b>Deploy</b> a static web project into a Salesforce ORG as Visualforce pages including their static resources (css, img, fonts, js).<br>
<b>Build</b> converts .html files to visualforce .page format and generates the corresponding apex tags and xml files. For the static resources compresses all the files in the designated folder to one or more .resource files (according the configuration).
- <b>Retrieve</b> from the org a list of dependent static resources (css, img, fonts, js)
Retrieves a list of static resources, previously configured in Gruntfile.js, and save them, decompressed, in the input/staticresources folder.
- <b>Undeploy</b> from an org a defined list of static resources and visualforce pages configured in the Gruntfile.js.


This Grunt plugin works using the migration tool API to connect to a Salesforce ORG, so it requires [ANT](http://ant.apache.org/bindownload.cgi) and [Java](https://www.java.com/es/download/) installed.

----
###Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. 

Note: In the sample folder you will find a Grunfile.js example to use in your project.

Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install node-visualforce --save-dev
```

Once the plugin has been installed, it could be enabled inside your Gruntfile with this line of JavaScript:
```js
  grunt.loadNpmTasks('node-visualforce');
```
If you want to create a '<b>Build</b>' and '<b>Deploy</b>' grunt task you can add the following to Gruntfile
```js
  grunt.registerTask('buildAndDeploy', ['nv-build', 'nv-deploy']);
```
Once you added the task to your Gruntfile, you have to put all your project files inside the following folder structure:
```shell
  - /input
    - /pages               #put all your .html files here
    - /staticresources     #static resources folder put your resources files here.
      - /<static resource name> # you can have more than one static resource, it                                  will be identified by its folder name
        - /css
        - /js
        - /img
        - /fonts
```
Internally you need to reference the static resources (css, js, img, fonts) using relative ('/') paths, for example:
- <b>StyleSheets:</b> "../staticresources/<b>'static resources name'</b>/css/sample.css"
- <b>JavaScripts:</b> "../staticresources/<b>'static resources name'</b>/js/vendors/jquery.js"
- <b>Images:</b> "../staticresources/<b>'static resources name'</b>/img/sample.png"
- <b>Fonts:</b>  "../fonts/Roboto/Roboto-Regular.ttf" (in sample.css)

----
###Configuring the plugin

The plugin is configured in four separate modules called <b>nv-build</b>, <b>nv-deploy</b>, <b>nv-retrieve</b> and <b>nv-undeploy</b> showed in the example:

```js
grunt.initConfig({
    'nv-build': {
        options: {
            inputPath:'input/',
            outputPath:'output/',
            apexPageFlags: {"flagName1": value1, "flagName2": value2}
        }
    },
    'nv-deploy': {
        your_deploy_target: {
            options:{
                user:   'myusername@test.com',
                pass:   'mypassword',
                token:  'mytoken',
                serverUrl: 'https://test.salesforce.com', 
                /* (By default: https://login.salesforce.com) */
                apiVersion: '29.0'
            },
            /* This config option is used by the package.xml generator, you can                target specific files or using '*' for targeting all of a specific                 type */
            pkg: {
                staticresource: ['*'],
                apexpage: ['*']
            }
        }
    },
    'nv-retrieve': {      
        your__retrieve_target: {
            options: {
                user: 'myusername@test.com',
                pass: 'mypassword',
                token: 'mytoken',
                serverUrl: 'https://test.salesforce.com', 
                /* (By default: https://login.salesforce.com) */
                apiVersion: '29.0'
            },
            /* Target-specific file lists to retrieve. */
            pkg: {
                staticresource: ['*']
            }
        }
    },
    'nv-undeploy': {
      your_target: {
        options:{
            user: 'myusername@test.com',
            pass: 'mypassword',
            token: 'mytoken',    
            serverUrl: 'https://test.salesforce.com', 
            /* (By default: https://login.salesforce.com) */
            apiVersion: '29.0'
        },
        /* Target-specific file lists to undeploy. */
        pkg: {   
          apexpage: ['page1'],
          staticresources: ['resource1']
        }
      }
    }
});
```
----
###Grunt nv-build
Running the command '<b>grunt nv-build</b>' creates the following /output folder structure

```shell
  - /output
    - /pages                #visualforce page files will be here
    - /staticresources      #static resources package will be here
```
It generates the visualforce page files (and the corresponding metadata files) from the html files located on the <b>/input/pages</b> folder and put them on <b>/output/pages</b>.

It creates one static resource package (and the corresponding metadata file) for each of the static resource folders included in <b>input/staticresources</b> containing all the files located on the <b>/staticresources/'static resource name'</b> subfolders and put it on <b>/output/staticresources</b>.

### Build-Task options

####options.inputPath
Type: `String`<br>
Default value: `input/`<br>
This option sets the source folder where there are the files to process.

####options.outputPath
Type: `String`<br>
Default value: `output/`<br> 
Output folder where the plugin create the *.page files and the static resource file to be deployed on.

###Optional

####options.apexPageFlags
Type: `Object`<br>
Default value: `{"showHeader": false, "standardStylesheets": false}`<br>
This option sets flags to the <apex:page> tag. You must set flag name (i.e. "showHeader") and value (String, Number or Boolean) as you want. Check all the current flags here: http://www.salesforce.com/us/developer/docs/pages/Content/pages_compref_page.htm

The default values ("showHeader" and "standardStylesheets") allows the plugin to override the Org standard stylesheets. They are added automatically to the apex:page tag unless you set those flags to true.

----
###Grunt nv-deploy

Running the command '<b>grunt nv-deploy</b>' deploys all the generated visualforce pages (with metadata) and the static-resources packages (with metadata) from <b>/output/pages</b> and <b>/output/staticresources</b> to the configured Salesforce Org.

###Deploy-Task options

####options.user
Type: `String`<br>
Required: `true`<br>
Your Salesforce.com username.

####options.pass
Type: `String`<br>
Required: `true`<br>
Your Salesforce.com password.

####options.token
Type: `String`<br>
Your Salesforce.com security token.

###Optional

####options.serverUrl
Type: `String`<br>
Default value: `'https://login.salesforce.com'`<br>
This option sets login url.

####options.apiVersion
Type: `String`<br>
Default value: `'29.0'`<br>
This option sets the api version to use for the package deployment.

----
###Grunt nv-retrieve

Running the command '<b>grunt nv-retrieve</b>' retrieves from the org specified in the options of the task all the static resources configured in the pkg element.
All the static resources retrieved are decompressed in <b>input/staticresources/'static resource name'</b>.

```js
grunt.initConfig({
    ...
    'nv-retrieve': {      
        your__retrieve_target: {
            options: {
                user: 'myusername@test.com',
                pass: 'mypassword',
                token: 'mytoken',
                serverurl: 'https://test.salesforce.com', 
                /* (By default: https://login.salesforce.com) */
                apiVersion: '29.0'
            },
            /* Target-specific file lists to retrieve. */
            pkg: {
                staticresource: ['*']
            }
        }
    },
    ...
})
```
###Retrieve-Task options
These are the same task options defined in the <b>Deploy-Task options</b> section

----
###Grunt nv-undeploy
Running the command '<b>grunt nv-undeploy</b>' removes, from the org specified in the options of the task, all the pages and staticresources configured on the pkg element:
```js
grunt.initConfig({
    ...
    'nv-undeploy': {
        your_target: {
            options:{
                user:   'myusername@test.com',
                pass:   'mypassword',
                token:  'mytoken',
                serverurl: 'https://test.salesforce.com', 
                /* (By default: https://login.salesforce.com) */
                apiVersion: '29.0'
            },
            /* Target-specific file lists and/or options go here. */
            pkg: {   
                apexpage: [index, section1],
                staticresources: [staticresources]
            }
        }
    }
    ...
})
```

###Undeploy-Task options

These are the same task options defined in the <b>Deploy-Task options</b> section

----
###Proxy options
If you are under a proxy you will need to add the proxy host and port to the '<b>nv-deploy</b>', '<b>nv-retrieve</b>' and '<b>nv-undeploy</b>' tasks config module so the ant server can reach the org:
```js
grunt.initConfig({
    'task module name': {
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
----
###Sample

<b>Node-Visualforce</b> includes a To Do List simple sample to be able to validate the correct plugin's installation and configuration. Please go to your <b>node_modules/node-visualforce/sample</b> and follow the instructions detailed in the README file.