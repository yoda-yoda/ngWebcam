'use strict';

var gulp = require('gulp');
var path = require('path');
var util = require('util');
var gutil = require('gulp-util');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var pkg = require('./package.json');
var chalk = require('chalk');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat-util');
var sourcemaps = require('gulp-sourcemaps');
var karma = require('karma');
var gulpDocs = require('gulp-ngdocs');
var less = require('gulp-less');

/** CONFIG  **/

var src = {
    cwd: 'src',
    dist: 'dist',
    docs: 'docs',
    scripts: '*/*.js',
    index: 'module.js'
};

var banner = gutil.template('/**\n' +
    ' * <%= pkg.name %>\n' +
    ' * @version v<%= pkg.version %> - <%= today %>\n' +
    ' * @author <%= pkg.author %>\n' +
    ' * @license <%= pkg.license %>\n' +
    ' */\n', {file: '', pkg: pkg, today: new Date().toISOString().substr(0, 10)});


/** CLEAN **/

// clean tmp folder
gulp.task('clean:tmp', function() {
    return gulp.src(['.tmp/*'], {read: false}).pipe(clean());
});

// clean tests tmp folder
gulp.task('clean:test', function() {
    return gulp.src(['tests/.tmp/*', 'tests/coverage/*'], {read: false}).pipe(clean());
});

// clean dist folder
gulp.task('clean:dist', function() {
    return gulp.src([src.dist + '/*'], {read: false}).pipe(clean());
});

gulp.task('clean:docs', function () {
    return gulp.src(src.docs, {read: false}).pipe(clean());
});

// clean all
gulp.task('clean', function () {
    runSequence('clean:dist', 'clean:test', 'clean:tmp', 'clean:docs');
});

gulp.task('less:examples', function () {
    // make css files for examples folder
    return gulp.src('examples/index.less')
    .pipe(less())
    .pipe(gulp.dest('examples'));
});

/** scripts **/
gulp.task('scripts:dist', function() {
    var merged = merge(
        // Build unified package
        gulp.src([src.index, src.scripts], {cwd: src.cwd})
        .pipe(sourcemaps.init())
        .pipe(concat(pkg.name + '.js', {
            process: function(src) {
              return '// Source: ' + path.basename(this.path) + '\n' + (src.trim() + '\n').replace(
                  /(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1'); }}))
        .pipe(concat.header('(function(window, document, undefined) {\n\'use strict\';\n'))
        .pipe(concat.footer('\n})(window, document);\n'))
        .pipe(concat.header(banner))
        .pipe(gulp.dest(src.dist))
        .pipe(rename(function(path) { path.extname = '.min.js'; }))
        .pipe(uglify())
        .pipe(concat.header(banner))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(src.dist)),

        // Build individual modules
        gulp.src(src.scripts, {cwd: src.cwd})
        .pipe(sourcemaps.init())
        .pipe(rename(function(path){ path.dirname = ''; })) // flatten
        .pipe(concat.header(banner))
        .pipe(gulp.dest(path.join(src.dist, 'modules')))
        .pipe(rename(function(path) { path.extname = '.min.js'; }))
        .pipe(uglify())
        .pipe(concat.header(banner))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.join(src.dist, 'modules')))
    );

    merged.on('error', function(err) {
        gutil.log(chalk.red(util.format('Plugin error: %s', err.message)));
    });

    return merged;
});

/** TEST  **/

// karma unit
gulp.task('karma:unit', function() {
    var server = new karma.Server({
        configFile: path.join(__dirname, 'karma.conf.js'),
    }, function(code) {
        gutil.log('Karma has exited with ' + code);
        process.exit(code);
    });
    server.start();
});


gulp.task('karma:server', function() {
    var server = new karma.Server({
        configFile: path.join(__dirname, 'karma.conf.js'),
        autoWatch: true,
        singleRun: false
  }, function(code) {
        gutil.log('Karma has exited with ' + code);
        process.exit(code);
  });
    server.start();
});


gulp.task('docs', function () {
    var options = {
        'html5Mode': false,
        'title': 'ngWebcam',
        'scripts': [
            'node_modules/underscore/underscore.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-animate/angular-animate.js',
            // TODO: come bakc here and add the dist lib
        ]
    };
    return gulp.src('src/**/*.js')
        .pipe(gulpDocs.process(options))
        .pipe(gulp.dest(src.docs));
});

gulp.task('watch', function () {
    return gulp.watch(
        ['src/**/*.js', 'gulpfile.js'],
        ['default']
    );
});

/** DEFAULT **/
gulp.task('default', function(){
    runSequence('dist', 'less:examples', 'docs');
});

gulp.task('test', function() {
    runSequence('clean:test', ['karma:unit', 'dist']);
});

gulp.task('test:server', function() {
    runSequence('clean:test', 'karma:server');
});

gulp.task('dist', function() {
    runSequence('clean:dist', 'scripts:dist');
});
