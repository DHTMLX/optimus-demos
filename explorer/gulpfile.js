var pkg = require("./package.json");
var webpack_config = require("./webpack.config.js");
var webpack2 = require('webpack');

var gulp = require("gulp");
var gutil = require("gulp-util");


var es = require("event-stream");
var webpack = require("webpack-stream");
var clean = require("gulp-clean");
var eslint = require("gulp-eslint");

var uglify = require("gulp-uglify");
var minify = require("gulp-cssnano");

var rename = require("gulp-rename");
var filter = require("gulp-filter");
var replace = require("gulp-replace");

gulp.task("lint", function(){
	return gulp.src(["sources/**/*.js"])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task("clean", function() {
	return gulp.src([
		"./codebase/*.js",
		"./dist/**/*",
		"./codebase/*.map",
		"./codebase/*.css"
	], {
		read: false
	}).pipe(clean());
});

//JS and CSS files
function codebase_stream() {
	var cssfiles = filter("**/*.css", {
		restore: true
	});
	var jsfiles = filter("**/*.js", {
		restore: true
	});
	var ignoremaps = filter(["**/*.js", "**/*.css"]);

	return gulp.src([pkg.main])
		.pipe(webpack(webpack_config, webpack2))
		.pipe(ignoremaps)
		.pipe(jsfiles)
		.pipe(uglify({
			"mangle": { "toplevel": true },
			"preserveComments": "license"
		}))
		.pipe(jsfiles.restore)
		.pipe(cssfiles)
		.pipe(minify().on("error", gutil.log))
		.pipe(cssfiles.restore);
}

//package for deploy
gulp.task("build", ["clean"], function() {
	var package_name = pkg.name + "_v" + pkg.version;

	//build codebase
	var codebase = codebase_stream()
		.pipe(rename(function(path) {
			path.dirname = "codebase/" + path.dirname;
		}));

	var dhtmlx_files = gulp.src(["codebase/**/*"],{
		dot: false,
		base: "./"
	});

	var server_files = gulp.src(["server/**/*"], {
		dot: false,
		base: "./"
	});

	var htmlfile = gulp.src(["index.html"], {
		dot: false,
		base: "./"
	}).pipe(replace("node_modules/handlebars/dist/", "codebase/"));
		
	var pack = [codebase, server_files, dhtmlx_files, htmlfile];

	return es.merge.apply(es, pack)
		.pipe(gulp.dest("./dist/" + package_name));
});

gulp.task("deploy", ["build"], function(){
	var package_name = pkg.name + "_v" + pkg.version;
	var res = require('child_process').execSync("rsync -ar ./dist/"+package_name+"/* "+pkg.deployPath);
	console.log(res.toString("utf8"));
});