const gulp = require('gulp');
const hr = require('gulp-html-replace');
const jade = require('gulp-jade');

const del = require('del');

// DEVELOPMENT TASKS

gulp.task('watch', function() {
  gulp.watch('app/**/*', ['setup']);
});

// DEPLOYMENT TASKS

// Main task for setup
gulp.task('setup', ['setup:basetag', 'setup:jade', 'setup:copy']);

// Replace index base tag for relative links (required for Angular)
gulp.task('setup:basetag', function() {
  gulp.src('app/index.html')
    .pipe(hr({
      base: {
        src: (function() {
          if (process.env.OPENSHIFT_APP_DNS) { // Openshift deployment
            return 'http://' + process.env.OPENSHIFT_APP_DNS + '/';
          } else {  // Local development
            return 'http://localhost:8080/';
          }
        }()),
        tpl: '<base href="%s">'
      }
    }))
    .pipe(gulp.dest('dist'));
});

// Preprocess jade files into HTML
gulp.task('setup:jade', function() {
  gulp.src('app/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('dist'));
});

// Copy files that do not need processing
gulp.task('setup:copy', function() {
  gulp.src(['app/**/*','!app/index.html', '!app/**/ *.jade'])
    .pipe(gulp.dest('dist'));
});

