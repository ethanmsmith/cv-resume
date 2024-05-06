const replace = require("gulp-replace");
const gulp = require("gulp");
const { exec } = require("child_process");
import fs from 'fs';
import { cv } from "./cv";
import { experience, skill, education, cvItem, personal } from "./generator";
let cvData: cv;
const cvJson = "./cv.json"
const outputDir = "output";
const resumeFinalDir = "../ethanmsmith.github.io/";

// Watch for file updates
gulp.task("watch", function () {
  fs.readFile(cvJson, 'utf8', (err, data) => {
      if (err) return;
      cvData = JSON.parse(data);
      (gulp.series("default"))();
  });
  
  gulp.watch(["*.tex","*.cls"]).on("change", (file: any) => {
    (gulp.series("default"))();
  });

  gulp.watch("*.json").on("change", (file: any) => {
    fs.readFile(cvJson, 'utf8', (err, data) => {
      if (err) return;
      cvData = JSON.parse(data);
      (gulp.series("default"))();
    });
  });
});

gulp.task("writing, formatting, and moving cv.tex", function () {
  return gulp
    .src(["cv.tex"])
    .pipe(replace("% BASICS", personal(cvData.basics)))
    .pipe(replace("FOOTER", `{${cvData.basics.name}~~~·~~~Resume}`))
    .pipe(gulp.dest(`${outputDir}/`));
});

gulp.task("writing and moving experiences.tex", () => {
  return gulp
    .src(["cv/experience.tex"])
    .pipe(
      replace(
        "EXPERIENCES",
        cvData.work
          .map((workItem) =>
            experience(
              workItem.position,
              workItem.company,
              workItem.location,
              workItem.startDate,
              workItem.endDate,
              workItem.summary,
              workItem.highlights
                ? workItem.highlights.map(
                  (highlight): cvItem => ({ text: highlight })
                )
                : []
            )
          )
          .join("\n")
      )
    )
    .pipe(gulp.dest(`${outputDir}/cv/`));
});

gulp.task("writing and moving education.tex", () =>
  gulp
    .src(["cv/education.tex"])
    .pipe(
      replace(
        "EDUCATION",
        education(
          cvData.education[0].area,
          cvData.education[0].institution,
          cvData.education[0].location,
          cvData.education[0].startDate,
          cvData.education[0].endDate,
          cvData.education[0].courses
        )
      )
    )
    .pipe(gulp.dest(`${outputDir}/cv/`))
);

gulp.task("writing and moving skills.tex", () =>
  gulp
    .src(["cv/skills.tex"])
    .pipe(
      replace(
        "SKILLS",
        cvData.skills
          .map((skillItem) => skill(skillItem.name, skillItem.keywords))
          .join("\n")
      )
    )
    .pipe(gulp.dest(`${outputDir}/cv/`))
);

gulp.task("writing and moving summary.tex", () =>
  gulp
    .src(["cv/summary.tex"])
    .pipe(replace("SUMMPARAGRAPH", cvData.basics.summary))
    .pipe(gulp.dest(`${outputDir}/cv/`))
);

gulp.task("execute xelatex", (cb: any) => {
  // gulp.src(['awesome-cv.cls']).pipe(gulp.dest(`${outputDir}/`));
  // gulp.src(['fontawesome.sty']).pipe(gulp.dest(`${outputDir}/`));
  exec(
    `cp -f awesome-cv.cls ${outputDir}/;cp -f fontawesome.sty ${outputDir}/;cp -R fonts ${outputDir}/fonts;`,
    (err: any, stdout: any, stderr: any) => {
      if (err) {
        console.log("ERROR: Some shit happened, not sure what. Good luck.");
      } else {
        exec(
          `xelatex cv.tex;`,
          { cwd: outputDir },
          (err: any, stdout: any, stderr: any) => {
            if (err) {
              console.log("ERROR:");
            } else {
              gulp.src(`${outputDir}/cv.pdf`).pipe(gulp.dest(resumeFinalDir));
              cb();
            }
            cb();
          }
        );
      }
    }
  );
});

gulp.task(
  "default",
  gulp.series(
    "writing, formatting, and moving cv.tex",
    "writing and moving summary.tex",
    "writing and moving experiences.tex",
    "writing and moving education.tex",
    "writing and moving skills.tex",
    "execute xelatex"
  )
);
