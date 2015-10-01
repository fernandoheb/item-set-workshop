const gulp = require('gulp');
const gutil = require('gulp-util');
const jade = require('gulp-jade');

// DEVELOPMENT TASKS

gulp.task('watch', function() {
  gulp.watch('app/**/*', ['setup']);
});

// DEPLOYMENT TASKS

// Main task for setup
gulp.task('setup', ['setup:jade', 'setup:copy']);

// Preprocess jade files into HTML
gulp.task('setup:jade', function() {
  var jadeStream = jade().on('error', function(e) {
    gutil.log(e);
    jadeStream.end();
  });
  gulp.src('app/**/*.jade')
    .pipe(jadeStream)
    .pipe(gulp.dest('dist'));
});

// Copy files that do not need processing
gulp.task('setup:copy', function() {
  gulp.src(['app/**/*', '!app/**/ *.jade'])
    .pipe(gulp.dest('dist'));
});

