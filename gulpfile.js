const gulp = require('gulp');
const hr = require('gulp-html-replace');
const del = require('del');

// DEPLOYMENT TASKS

// Main task for setup
gulp.task('setup', ['setup:basetag', 'setup:copy']);

// Replace index base tag for relative links (required for Angular)
gulp.task('setup:basetag', ['setup:clean'], function() {
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

// Copy files that do not need processing
gulp.task('setup:copy', ['setup:clean'], function() {
  gulp.src(['app/**/*','!app/index.html'])
    .pipe(gulp.dest('dist'));
});

// Clean the client folder
gulp.task('setup:clean', function() {
  return del(['dist']);
});

