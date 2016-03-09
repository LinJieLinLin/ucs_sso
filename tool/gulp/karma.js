var karma = require("karma").Server;
module.exports = function(gulp, _, dir) {
    gulp.task("karma", function(done) {
        return new karma({
            configFile: dir("karma.conf.js"),
            singleRun: true
        }, done).start();
    });
    gulp.task("watch:karma", function(done) {
        return new karma({
            configFile: dir("karma.conf.js")
        }, done).start();
    });
};
