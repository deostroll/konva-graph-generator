var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('serve', function(){
  connect.server({
    root: ['app', 'node_modules/konva', 'node_modules/knockout/build/output', 'node_modules/bootstrap/dist/', 'node_modules/jquery/dist'],
    livereload: true
  });
});

gulp.task('watch', function(){
  gulp.watch('app/*.*', function(){
    gulp.src('app/*.*').pipe(connect.reload());
  });
});


gulp.task('default', ['serve', 'watch']);
