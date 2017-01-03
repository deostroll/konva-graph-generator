var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
gulp.task('serve', function() {
  connect.server({
    root: ['app', 'node_modules/konva',
      'node_modules/knockout/build/output',
      'node_modules/bootstrap/dist/', 'node_modules/jquery/dist'
    ],
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch('app/index.html', function() {
    return gulp.src('app/*.*').pipe(connect.reload());
  });
  gulp.watch(['*.js', '!main.js'], {
    cwd: 'app/'
  }, ['concat'], function() {
    gulp.src('app/*.*').pipe(connect.reload());
  });
});

gulp.task('concat', function() {
  return gulp.src(['*.js', 'start.js', '!main.js'], {
      cwd: 'app/'
    })
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/'))
})


gulp.task('default', ['serve', 'watch']);
