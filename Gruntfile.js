module.exports = function( grunt ) {
	'use strict';
	//
	// Grunt configuration:
	//
	// https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
	//
	grunt.initConfig({

		// Project configuration
		// ---------------------

		// specify an alternate install location for Bower
		bower: {
			dir: 'app/components'
		},

		// Coffee to JS compilation
		min: {
			default: {
				src: ['src/js/index.js'],
				dest: 'app/js/index.js'
			}
		},
		coffee : {
			compile: {
				files: {
					'app/js/*.js' : 'src/coffee/*.coffee',
					'src/js/*.js' : 'src/coffee/*.coffee',
					'test/js/*.js' : 'test/coffee/*.test.coffee'
				}
			}
		},

		concat: {
			default: {
				src: [
					,'src/js/header.txt'
					,'src/js/index.js'
					,'src/js/footer.txt'
				],
				dest: 'src/js/index.js'
			},
			prod : {
				src: '<config:concat.default.src>',
				dest: 'app/js/index.js'
			}
		},

		// compile .scss/.sass to .css using Compass
		compass : {
			dev:{
				src: 'src/sass',
				dest: 'app/css',
				images : 'app/images',
				outputstyle: 'expanded',
				linecomments: false,
				forcecompile: true,
				debugsass: false,
				iconspritepath : 'app/images',
				iconwhitespritepath : 'app/images',
				relativeassets: true
			},
			prod:{
				src: 'src/sass',
				dest: 'app/css',
				images : 'app/images',
				outputstyle: 'compressed',
				linecomments: false,
				forcecompile: true,
				debugsass: false,
				relativeassets: true
			}
		},
		//hogan.js
		hogan: {
			default:{
				templates : "src/hogan/*.mustache",
				output : "src/js/templates.hogan.js"
			}
		},
		// generate application cache manifest
		manifest:{
			dest: ''
		},

		// headless testing through PhantomJS
		mocha: {
			all: ['test/**/*.html']
		},

		// default watch configuration
		watch: {
			default : {
				files: 'src/coffee/*.coffee',
				tasks: 'coffee notifyGrowl:coffee'
			},
			compass : {
				files: 'src/sass/*',
				tasks: 'compass:dev notifyGrowl:compass'
			},
			test : {
				files: 'test/coffee/*',
				tasks: 'coffee:test mochaPhantomjs'
			},
			hogan : {
				files: 'src/hogan/*.mustache',
				tasks: 'hogan'
			},
			reload: {
				files: [
					'app/*.html',
					'app/css/*.css',
					'app/js/*.js',
					'app/images/*'
				],
				tasks: 'reload'
			}
		},

		// default lint configuration, change this to match your setup:
		// https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
		lint: {
			files: [
				//'Gruntfile.js',
				//'app/scripts/**/*.js',
				//'spec/**/*.js'
			]
		},

		// specifying JSHint options and globals
		// https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#specifying-jshint-options-and-globals
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				jQuery: true
			}
		},

		// Build configuration
		// -------------------

		// the staging directory used during the process
		staging: 'tmp/',
		// final build output
		output: 'dist/',

		mkdirs: {
			staging: 'dist/'
		},

		// Below, all paths are relative to the staging directory, which is a copy
		// of the app/ directory. Any .gitignore, .ignore and .buildignore file
		// that might appear in the app/ tree are used to ignore these values
		// during the copy process.

		// concat css/**/*.css files, inline @import, output a single minified css
		css: {
			'css/style.css': ['css/**/*.css']
		},

		// renames JS/CSS to prepend a hash of their contents for easier
		// versioning
		rev: {
			js: 'js/**/*.js',
			css: 'css/**/*.css',
			img: 'images/**'
		},

		// usemin handler should point to the file containing
		// the usemin blocks to be parsed
		'usemin-handler': {
			html: 'index.html'
		},

		// update references in HTML/CSS to revved files
		usemin: {
			html: ['**/*.html'],
			css: ['**/*.css']
		},

		// HTML minification
		html: {
			files: ['**/*.html']
		},

		// Optimizes JPGs and PNGs (with jpegtran & optipng)
		img: {
			dist: '<config:rev.img>'
		},

		// rjs configuration. You don't necessarily need to specify the typical
		// `path` configuration, the rjs task will parse these values from your
		// main module, using http://requirejs.org/docs/optimization.html#mainConfigFile
		//
		// name / out / mainConfig file should be used. You can let it blank if
		// you're using usemin-handler to parse rjs config from markup (default
		// setup)
		rjs: {
			// no minification, is done by the min task
			optimize: 'none',
			baseUrl: './scripts',
			wrap: true,
			name: 'main'
		},

		// requirejs
		requirejs: {
			//compile : {
			std : {
				/*almond: true,
				replaceRequireScript: [{
					files: ['build/index.html'],
					modulePath: 'js/index'
				}],*/
				appDir: "./app",
				dir : "build",
				baseUrl: "js",
				optimize : "uglify",
				keepBuildDir: false,
				//include : ["index", "main", "sub"],
				paths : {
					//require : '../../components/requirejs/require'//yeoman install require
					//jquery : '../../components/jquery/jquery'//yeoman install jquery
				},
				pragmas: {
					doExclude: true
				},
				//out : "index.js",
				modules : [{ name : "index" }],
				/*wrap: {
				 start: "(function($) {",
				 end: "}).call(this, jQuery);"
				 },*/
				//wrap : false,
				skipModuleInsertion: true,
				optimizeAllPluginResources: false,
				findNestedDependencies: true,
				exclude : ["js/main.js", "js/sub.js"],
				fileExclusionRegExp : /^components$/,
				onBuildWrite   : function( name, path, contents ) {
					//console.log( 'Writing: ' + name );
					return contents
				}/*,
				removeCombined : true*/
			}
		},

		//yuidoc
		yuidoc: {
			dist: {
				'name': 'Project Name',
				'description': 'Project Description',
				'version': '0.0.2',
				'url': 'http://projecturl.com/',
				options: {
					paths: 'src/coffee',
					// paths: 'dest/js',
					outdir: 'docs',
					syntaxtype: 'coffee',
					extension: '.coffee'
				}
			}
		},

		notifyGrowl : {
			coffee : {
				message : grunt.template.today() + " : coffeescript compiled",
				title : "coffee ＼(^o^)／"
			},
			compass : {
				message : grunt.template.today() + " : compass compiled",
				title : "compass ＼(^o^)／"
			},
			hogan : {
				message : grunt.template.today() + " : hogan compiled",
				title : "hogan ＼(^o^)／"
			},
			production : {
				message : grunt.template.today() + " : production compiled",
				title : "production ＼(^o^)／"
			}
		}
	});

	// Alias the `test` task to run the `mocha` task instead
	grunt.registerTask('test', 'mocha');

	// Default task.
	grunt.registerTask('default', 'coffee');
	grunt.loadNpmTasks('grunt-compass');
	grunt.loadNpmTasks('grunt-requirejs');

	grunt.registerTask('production', 'compile coffee and compass to productioin', function(){
		grunt.task.run( "hogan" );
		grunt.task.run( "concat coffee concat:prod min" );
		grunt.task.run( "compass:prod" );
		grunt.task.run( "notifyGrowl:production" );
	});

	grunt.registerTask('mochaPhantomjs', 'start test unit with mocha-phantomjs', function(){
		var sys = require('sys');
		var exec = require('child_process').exec;
		exec("mocha-phantomjs test/index.html", function( error, stdout, stderr ){
			sys.print('stdout: ' + stdout);
			sys.print('stderr: ' + stderr);
			/*growl(
			 stdout.replace(/\[1m/g, '')
			 .replace(/\[0m/g, '')
			 .replace(/\[32m/g, '')
			 .replace(/\[31m/g, ''),
			 {
			 title: "test ＼(^o^)／",
			 image : "growl-images/success_icon.png"
			 }
			 )*/
			if (error !== null) {
				console.log('exec error: ' + error);
				//throw error;
			}
		});
	});

	/* Inside grunt.js file (don't forget to add "growl" as a project dependency) */

	/*grunt.utils.hooker.hook(grunt.fail, "warn", function(opt) {
	 require('growl')(opt.name, {
	 title: opt.message,
	 image: 'Console'
	 });
	 });*/

	/* ... or, since fail.fatal() will stop grunt it seems a good idea to track it too */

	var growl = require('growl');
	['warn', 'fatal'].forEach(function(level) {
		grunt.utils.hooker.hook(grunt.fail, level, function(opt) {
			growl(opt.name, {
				title: opt.message,
				image: 'growl-images/fail_icon.png'
			});
		});
	});
	grunt.task.registerMultiTask("notifyGrowl", "compile success", function() {
		growl( this.data.message, {
			title: this.target + "＼(^o^)／",
			image : "growl-images/success_icon.png"
		});
	});
	grunt.task.registerMultiTask( 'hogan', 'Precompile with `hogan.js`', function() {
		var Hogan = require('hogan.js'),
			path = require('path'),
			data = this.data,
			result ="var templates = templates || {}";
		result = "var templates = {};\n"

		var templates = grunt.file.expand(data.templates);

		templates.forEach(function(template) {
			var name = path.basename(template, path.extname(template));
			try {
				result += "\ntemplates['" + name +"']=new Hogan.Template(" +
					Hogan.compile(grunt.file.read(template).toString(), {asString:true}) + ");";
			} catch (error) {
				grunt.log.writeln("Error compiling template " + name + " in " + template);
				throw error;
			}
		});
		grunt.file.write(data.output, result);
	});

};