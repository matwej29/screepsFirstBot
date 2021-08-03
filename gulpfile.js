const gulp = require("gulp");

//Define your paths to deploy
const SCREEPSPATH1 =
  "C:/Users/matwe/AppData/Local/Screeps/scripts/screeps.com/default";
const SCREEPSPATH2 = "INSERT_PATH_TO_YOUR_LOCAL_SCREEPS_FOLDER";

//Copies all js Files from scripts to SCREEPSPATH1
gulp.task("deploy_1", function () {
  return gulp.src("scripts/*.js").pipe(gulp.dest(SCREEPSPATH1));
});

//Copies all js Files from scripts to SCREEPSPATH2
gulp.task("deploy_2", function () {
  gulp.src("scripts/*.js").pipe(gulp.dest(SCREEPSPATH2));
});
