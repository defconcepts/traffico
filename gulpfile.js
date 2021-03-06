var gulp = require('gulp')
var shell = require('gulp-shell')
var concat = require('gulp-concat')
var cson = require('gulp-cson')
var sass = require('gulp-sass')

gulp.task('lint', shell.task('node node_modules/standard/bin/cmd.js gulpfile.js'))

gulp.task('clean', shell.task(['rm -f .fontcustom-manifest.json', 'rm -rf ./build/']))

gulp.task('compile-font', ['clean'], shell.task('fontcustom compile'))

gulp.task('cson-signs', ['clean'], function () {
  return gulp.src('dev/*.cson')
    .pipe(cson())
    .pipe(gulp.dest('build/signs'))
})

gulp.task('cson-transformations', ['clean'], function () {
  return gulp.src('stylesheets/transformations.cson')
    .pipe(cson())
    .pipe(gulp.dest('build'))
})

gulp.task('concat-traffico-css', ['compile-font'], function () {
  return gulp.src(['build/stylesheets/traffico.css', 'stylesheets/extend.css'])
    .pipe(concat('traffico.css'))
    .pipe(gulp.dest('build/stylesheets'))
})

gulp.task('gen-overview-css', ['clean'], function () {
  return gulp.src('stylesheets/examples.scss').pipe(sass()).pipe(gulp.dest('build/stylesheets'))
})

gulp.task('gen-overview-scss', ['clean'], function () {
  return gulp.src('stylesheets/examples.scss').pipe(gulp.dest('build/gh-pages'))
})

gulp.task('gen-overview', ['cson-signs', 'cson-transformations'], function () {
  return gulp.src('scripts/generate-overview.js').pipe(shell(['mkdir -p build/gh-pages && node <%= file.path %>']))
})

gulp.task('gen-html-map', ['resolve-transformations'], function () {
  return gulp.src('scripts/generate-html-string-dict.js').pipe(shell(['mkdir -p build/string-maps && node <%= file.path %>']))
})

gulp.task('resolve-transformations', ['cson-signs', 'cson-transformations'], function () {
  return gulp.src('scripts/resolve-transformations.js').pipe(shell(['mkdir -p build/signs-simple && node <%= file.path %>']))
})

gulp.task('generate_gh-pages_config', function () {
  return gulp.src('scripts/generate_gh-pages_config.js').pipe(shell(['mkdir -p build/gh-pages && node <%= file.path %>']))
})

gulp.task('patch-names', ['gen-overview'], function () {
  return gulp.src('scripts/patch-names.js').pipe(shell(['node <%= file.path %>']))
})

gulp.task('default', ['concat-traffico-css', 'gen-overview', 'gen-overview-scss', 'gen-overview-css', 'generate_gh-pages_config', 'gen-html-map'])
