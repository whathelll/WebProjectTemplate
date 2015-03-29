'use strict';

// Include gulp
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var del = require('del');
//var pagespeed = require('psi');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

// Lint JavaScript
gulp.task('jshint', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
    // For best performance, don't add Sass partials to `gulp.src`
    return gulp.src([
        'app/styles/*.scss',
        'app/styles/**/*.css',
        'app/styles/components/components.scss'
    ])
        .pipe($.changed('styles', {extension: '.scss'}))
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10
        })
            .on('error', console.error.bind(console))
    )
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest('.tmp/styles'))
        // Concatenate And Minify Styles
        .pipe($.if('*.css', $.csso()))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size({title: 'styles'}));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
    var assets = $.useref.assets({searchPath: '{.tmp,app}'});

    return gulp.src('app/**/*.html')
        .pipe(assets)
        // Concatenate And Minify JavaScript
        .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
        // Remove Any Unused CSS
        // Note: If not using the Style Guide, you can delete it from
        // the next line to only include styles your project uses.
        .pipe($.if('*.css', $.uncss({
            html: [
                'app/index.html',
                'app/styleguide.html'
            ],
            // CSS Selectors for UnCSS to ignore
            ignore: [
                /.navdrawer-container.open/,
                /.app-bar.open/
            ]
        })))
        // Concatenate And Minify Styles
        // In case you are still using useref build blocks
        .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        // Update Production Style Guide Paths
        .pipe($.replace('components/components.css', 'components/main.min.css'))
        // Minify Any HTML
        .pipe($.if('*.html', $.minifyHtml()))
        // Output Files
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'html'}));
});


// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));


// Watch Files For Changes & Reload
gulp.task('serve', ['styles'], function () {



    browserSync({
        notify: false,
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        port: 8088,
        server: {
            baseDir: ['.tmp', 'app']
        }
    });

    gulp.watch(['app/**/*.html'], reload);
    gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
    gulp.watch(['app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['app/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
    browserSync({
        notify: false,
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: {
            baseDir: 'dist'
        }

    });
});


// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
    runSequence('styles', ['jshint', 'html', 'copy'], cb);
});
