var browserSync = require('browser-sync');

module.exports = function(gulp, _, dir) {

    gulp.task('reload', function() {
        console.log('-----------------');
        browserSync.reload();
    });

    gulp.task('copy:file', ['copy:js', 'copy:html', 'copy:css','copy:imgs','copy:png'], function() {
        console.log('copy:file');
        // var jsFilter = _.filter('**/*.js', {
        //     restore: true
        // });
        // // var scssFilter = _.filter('!*.scss', {restore: true});
        // return gulp.src([dir('build/**/*'), '!' + dir('**/*.scss')])
        //     // .pipe(jsFilter)
        //     // .pipe(jsFilter.restore)
        //     // .pipe(htmlFilter)
        //     // .pipe(htmlFilter.restore)
        //     // .pipe(scssFilter)
        //     // .pipe(scssFilter.restore)
        //     .pipe(gulp.dest(dir('../')));
    });
    gulp.task('copy:js', function() {
        console.log('js');
        var jsFilter = _.filter('**/*.js', {
            restore: true
        });
        return gulp.src(dir('build/**/*.js'))
            // .pipe(jsFilter)
            // .pipe(jsFilter.restore)
            .pipe(gulp.dest(dir('../')));
    });
    gulp.task('copy:html', function() {
        console.log('html');
        return gulp.src([dir('build/*.html'),dir('build/**/*.html')])
            .pipe(gulp.dest(dir('../')));
    });
    gulp.task('copy:css', function() {
        console.log('css');
        return gulp.src(dir('build/**/*.css'))
            .pipe(gulp.dest(dir('../')));
    });
    gulp.task('copy:imgs', function() {
        console.log('imgs');
        return gulp.src([dir('build/imgs/*.*'),dir('build/imgs/**/*.*')])
            .pipe(gulp.dest(dir('../imgs')));
    });
    gulp.task('copy:png', function() {
        console.log('png');
        return gulp.src([dir('build/**/*.png')])
            .pipe(gulp.dest(dir('../')));
    });


    gulp.task('watch', function() {
        // gulp.watch('!' + dir('../tool'), [dir('../**/*.js')], _.sync(gulp).sync(['reload']));
        gulp.watch(dir('build/**/*.js'), _.sync(gulp).sync(['copy:js','reload']));
        gulp.watch(dir('build/*.html'), _.sync(gulp).sync(['copy:html','reload']));
        gulp.watch(dir('build/**/*.html'), _.sync(gulp).sync(['copy:html','reload']));
        gulp.watch(dir('build/**/*.css'), _.sync(gulp).sync(['copy:css','reload']));
        gulp.watch(dir('build/imgs/*.*'), _.sync(gulp).sync(['copy:imgs','reload']));

        gulp.watch(dir('build/**/*.scss'), _.sync(gulp).sync(['sass','reload']));

        // gulp.watch(dir('build/**/*'), _.sync(gulp).sync(['reload']));
    });
};
