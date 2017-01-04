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
  var files = ['index.html', 'main.js', 'style.css'];
  var opts = { cwd: 'app/'};

  gulp.watch(files, opts, function() {
    return gulp.src(files, opts).pipe(connect.reload());
  });

  gulp.watch(['*.js', '!main.js'], opts, ['concat']);
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
