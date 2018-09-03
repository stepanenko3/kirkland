'use strict';

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    cleancss = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    size = require('gulp-size'),
    changed = require('gulp-changed'),
    browserSync = require('browser-sync').create(),
    dir = { src: './assets/sass/', dist: './assets/css/', libs: [] };

dir.sass = [
    dir.src + '*.scss',
    dir.src + '**/*.scss',
    '!' + dir.src + '_*.scss',
    '!' + dir.src + '**/_*.scss',
];
dir.sass_watch = [
    dir.src + '*.scss',
    dir.src + '**/*.scss',
];

gulp.task( 'sass', function () {
    return gulp.src( dir.sass )
        .pipe( changed( dir.dist )  )
        .pipe( sourcemaps.init() )
        .pipe( sass({ outputStyle: 'expanded' }).on( 'error', sass.logError ) )
        .pipe( autoprefixer({ browsers: ['last 4 versions', '> .5%', 'ie 8', 'ie 7', 'iOS 7'] }) )
        .pipe( gulp.dest( dir.dist ) )

        .pipe( cleancss() )
        .pipe( rename({ suffix: '.min' }) )
        .pipe( gulp.dest( dir.dist ) )

        .pipe( sourcemaps.write('./', { includeContent: false,  mapSources: false }) )
        .pipe( gulp.dest( dir.dist ) )

        .pipe( browserSync.stream() )
        .pipe( size() );
});

gulp.task( 'sass:watch', function () {
    gulp.watch( dir.sass_watch, ['sass'] );
});

gulp.task( 'default', ['watch', 'browser-sync'] );
gulp.task( 'watch', ['sass:watch'] );

gulp.task( 'browser-sync', function() {
    browserSync.init({
        server  : {
            baseDir     : "./"
        },
        port    : 8080,
        open    : true,
        notify  : true,
        logLevel: 'silent'
    });

    gulp.watch("./*.html").on('change', browserSync.reload);
});