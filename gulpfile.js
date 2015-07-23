var gulp = require('gulp'),
	gutil = require('gulp-util'),
	jshint = require('gulp-jshint'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	
	karma = require('gulp-karma'),
	jasmine = require('gulp-jasmine'),
	sourcemaps = require('gulp-sourcemaps');

var options = {
	mangle:true
}

gulp.task('default', ['watch']);


gulp.task('watch', function(){
	gulp.watch('source/javascript/**/*.js',['jshint', 'build-js', 'spec']);
	gulp.watch('source/scss/**/*.scss', ['build-css', 'spec']);
});

gulp.task('jshint', function(){
	return gulp.src('source/javascript/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-css', function () {
	return gulp.src('source/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(concat('style.css'))
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public/assets/stylesheets'));
});

gulp.task('build-js', function () {
	return gulp.src('source/javascript/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js'))
		.pipe(gutil.env.type === 'production' ? uglify(options) : gutil.noop())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public/assets/javascript'));
});


gulp.task('spec', function () {
    return gulp.src('spec/*.js')
        .pipe(jasmine());
});
