var gulp = require('gulp');
var assetRev = require('./index.js');
var argv = require('yargs').argv;
var version = Math.floor(Math.random() * 100000)+1000000;
gulp.task('html',function() {
    gulp.src(argv.path+"/**/*.html")
        .pipe(assetRev({"version": version}))
        .pipe(gulp.dest(argv.path));
});
