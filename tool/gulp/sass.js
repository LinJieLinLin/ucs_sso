module.exports = function (gulp, _, dir) {
    gulp.task('sass', function () {
        return gulp.src(dir('../build/common/*.scss'))
        .pipe(_.plumber())

        // use sourcemaps to help developer to debug.
        // .pipe(sourcemaps.init())

        // compile the sass file to css file.
        .pipe(_.sass({outputStyle: 'expanded'}))

        // add vendor prefixes to the css file
        .pipe(_.autoprefixer({browsers: ['chrome > 35', 'ff > 10', 'opera > 10', 'ie > 6']}))

        // .pipe(sourcemaps.write('./', {
        //     sourceMappingURL: function (file) {
        //         return '/styles/' + file.relative + '.map';
        //     }
        // }))

        .pipe(gulp.dest(dir('../www/common')));
    });


    // use gulpsync to make sure `sass` task is excuted after `sprites` and `iconfont` tasks.
    gulp.task('compile:css', _.sync(gulp).sync(['sass']));

};