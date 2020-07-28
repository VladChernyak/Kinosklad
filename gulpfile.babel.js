import { src, pipe, dest, task, watch } from 'gulp';
import less from 'gulp-less';
import cleanCss from 'gulp-clean-css';
import concatCss from 'gulp-concat-css';
import autoprefixer from 'gulp-autoprefixer';
import path from 'path';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';
import buffer from 'vinyl-buffer';
import concat from 'gulp-concat';


task('bundle', function () {
    return browserify({
        entries: [
            './src/js/index.js'
            ]
    })
    .transform(babelify.configure({
        presets: ["@babel/preset-env"]
    }))
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(dest('./src/js/'))
})

task('js', function () {
    return src([
        './src/js/libs/jquery-3.5.1.min.js',
        './src/js/libs/owl.carousel.min.js',
        './src/js/bundle.js'
    ])
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(dest('./build/js'))
})

task('less', function () {
    return src('./src/less/styles.less')
      .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ]
      }))
      .pipe(dest('./src/css'));
  });

task('css', function () {
    return src([
        './src/css/libs/*.css',
        './src/css/styles.css'
    ])
    .pipe(concatCss('styles.css'))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(cleanCss())
    .pipe(dest('./build/css'))
})
