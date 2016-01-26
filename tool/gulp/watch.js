var browserSync = require('browser-sync');

module.exports = function(gulp, _, dir) {

    gulp.task('reload', function() {
        console.log('-----------------');
        browserSync.reload();
    });

    gulp.task('copy:file', function() {
        var htmlFilter = _.filter('*.html', {
            restore: true
        });
        var jsFilter = _.filter('**/*.js', {
            restore: true
        });
        // var scssFilter = _.filter('!*.scss', {restore: true});
        return gulp.src([dir('build/**/*'), '!' + dir('**/*.scss')])
            // .pipe(jsFilter)
            // .pipe(jsFilter.restore)
            // .pipe(htmlFilter)
            // .pipe(htmlFilter.restore)
            // .pipe(scssFilter)
            // .pipe(scssFilter.restore)
            .pipe(gulp.dest(dir('../')));
    });

    gulp.task('watch', function() {
        gulp.watch(dir('build/*.*'),
            _.sync(gulp).sync(['sass', 'copy:file', 'reload']));
        gulp.watch('!' + dir('../tool'), [dir('../**/*.js')],
            _.sync(gulp).sync(['reload']));
        gulp.watch(dir('../*.html'),
            _.sync(gulp).sync(['reload']));
    });
};
