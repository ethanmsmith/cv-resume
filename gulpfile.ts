const replace = require('gulp-replace');
const gulp = require('gulp');
const { exec } = require('child_process');
import { experience, skill, education, cvItem, personal } from './generator';
import cv from './cv.json';
const outputDir = 'output'
const resumeFinalDir = '../ethanmsmith.github.io/'

gulp.task('writing, formatting, and moving cv.tex', function () {
  return gulp.src(['cv.tex'])
    .pipe(replace('% BASICS', personal(cv.basics)))
    .pipe(replace('FOOTER', `{${cv.basics.name}~~~·~~~Curriculum Vitae}`))
    .pipe(gulp.dest(`${outputDir}/`));
});

gulp.task('writing and moving experiences.tex', () => {
  return gulp.src(['cv/experience.tex'])
    .pipe(replace('EXPERIENCES', cv.work.map(workItem =>
      experience(workItem.position, workItem.company, workItem.location, workItem.startDate, workItem.endDate, workItem.summary, workItem.highlights ? workItem.highlights.map((highlight): cvItem =>
        ({ text: highlight })) : [])).join('\n')))
    .pipe(gulp.dest(`${outputDir}/cv/`));
});

gulp.task('writing and moving education.tex', () =>
  gulp.src(['cv/education.tex'])
    .pipe(replace('EDUCATION', education(cv.education[0].area, cv.education[0].institution, cv.education[0].location, cv.education[0].startDate, cv.education[0].endDate, cv.education[0].courses)))
    .pipe(gulp.dest(`${outputDir}/cv/`))
);

gulp.task('writing and moving skills.tex', () => gulp.src(['cv/skills.tex']).pipe(replace('SKILLS', cv.skills.map(skillItem =>
  skill(skillItem.name, skillItem.keywords)).join('\n')))
  .pipe(gulp.dest(`${outputDir}/cv/`))
);

gulp.task('writing and moving summary.tex', () =>
  gulp.src(['cv/summary.tex']).pipe(replace('SUMMPARAGRAPH', cv.basics.summary))
    .pipe(gulp.dest(`${outputDir}/cv/`))
);

gulp.task('execute xelatex', (cb: any) => {
  // gulp.src(['awesome-cv.cls']).pipe(gulp.dest(`${outputDir}/`));
  // gulp.src(['fontawesome.sty']).pipe(gulp.dest(`${outputDir}/`));
  exec(`cp -f awesome-cv.cls ${outputDir}/;cp -f fontawesome.sty ${outputDir}/;cp -R fonts ${outputDir}/fonts;`, (err: any, stdout: any, stderr: any) => {
    if (err) {
      console.log("ERROR: Some shit happened, not sure what. Good luck.");
    }
    else {
      exec(`xelatex cv.tex;`, {cwd: outputDir}, (err: any, stdout: any, stderr: any) => {
        if (err) {
          console.log("ERROR:");
        }
        else {
          gulp.src(`${outputDir}/cv.pdf`).pipe(gulp.dest(resumeFinalDir));
          cb();
        }
        cb();
      });
    }
  });
});

gulp.task('default', gulp.series('writing, formatting, and moving cv.tex', 'writing and moving summary.tex', 'writing and moving experiences.tex', 'writing and moving education.tex', 'writing and moving skills.tex', 'execute xelatex'));