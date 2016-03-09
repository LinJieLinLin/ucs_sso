module.exports = function(gulp, _, dir, config, target) {

    gulp.task('build:common', ['build:img', 'build:tmpl'], function() {
        var arr = [];
        var cssFilter = _.filter('*.css');
        var jsFilter = _.filter('*.js');
        config.common.forEach(function(item) {
            arr.push(dir('dist/' + item));
        });


        return gulp.src(arr)
            .pipe(jsFilter)
            .pipe(_.concat('bundle.min.js'))
            .pipe(_.uglify())
            .pipe(jsFilter.restore())
            .pipe(cssFilter)
            .pipe(_.concat('bundle.min.css'))
            .pipe(_.minifyCss())
            .pipe(cssFilter.restore())
            .pipe(gulp.dest(dir('../www/application/module/common/')));
    });


    gulp.task('build:assets', [], function() {
        var t = [];
        target.forEach(function(item) {
            t.push(dir('build/' + item));
        });
        console.log(t);
        return gulp.src(t)
            .pipe(_.useref())
            .pipe(_.if('*.css', _.minifyCss()))
            .pipe(_.if('**/*.js', _.uglify()))
            // .pipe(_.if('*.html', _.minifyHtml({ empty: true , comments: true})))
            .pipe(gulp.dest('build/tt'));
    });

    gulp.task('build:img', function() {
        return gulp.src(dir(dir('dist/images/**/*')))

        // minify the image
        // .pipe(imagemin())

        .pipe(gulp.dest(dir('../www/images')));
    });

    gulp.task('build:tmpl', function() {
        return gulp.src(['build/js/directive/**/*.html'])
            .pipe(_.if('*.html', _.minifyHtml({ empty: true, comments: true })))
            .pipe(_.ngTemplate({
                filePath: 'tpl.js',
                prefix: ''
            }))
            .pipe(gulp.dest('build/js/directive'));
    });

    gulp.task('build:minify', function() {
        console.log('html');
        return gulp.src([dir('../*.html'), dir('../**/*.*'), '!' + dir('../tool/**'), '!' + dir('../minify/**'), '!' + dir('../coverage/**'), '!' + dir('../test/**')])
            .pipe(_.if('*.css', _.minifyCss()))
            .pipe(_.if('**/*.js', _.uglify()))
            .pipe(_.if('*.html', _.minifyHtml({ empty: true, comments: true })))
            .pipe(gulp.dest(dir('../minify')));
    });

    gulp.task('build', ['build:assets']);
};
