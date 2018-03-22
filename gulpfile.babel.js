import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import bower from 'gulp-bower';
import browserSync from 'browser-sync';

gulp.task('install', () => bower());

gulp.task('watch', () => {
  gulp.watch('app/views/**', browserSync.reload());
  gulp.watch('public/js/**', browserSync.reload());
  gulp.watch('app/**/*.js', browserSync.reload());
  gulp.watch('public/views/**', browserSync.reload());
  gulp.watch('public/css/common.scss', ['sass']);
  gulp.watch('public/css/**', browserSync.reload());
});

gulp.task('default', ['nodemon', 'watch']);
gulp.task('nodemon', () =>
  nodemon({
    verbose: true,
    script: './dist/server.js',
    ext: 'js html jade json scss css',
    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
    watch: ['app', 'config', 'public', 'server.js'],
    env: {
      PORT: 3000,
      NODE_ENV: 'development'
    },
    tasks: ['babel', 'sass', 'dist-base']
  }));

gulp.task('build', ['babel', 'sass', 'dist-dep', 'dist-base']);
gulp.task('babel', () => {
  gulp
    .src([
      './**/*.js',
      '!dist/**',
      '!node_modules/**',
      '!gulpfile.babel.js',
      '!bower_components/**/*'
    ])
    .pipe(babel())
    .pipe(gulp.dest('./dist'));
});
gulp.task('sass', () => {
  gulp
    .src('public/css/common.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/public/css/'));
});
gulp.task('dist-dep', [
  'mv-angular',
  'mv-bootstrap',
  'mv-jquery',
  'mv-underscore',
  'mv-angularUtils',
  'mv-angular-bootstrap'
]);

gulp.task('dist-base', ['mv-config', 'mv-public', 'mv-jade']);

const move = (from, to) => gulp.src(from).pipe(gulp.dest(to));

gulp.task('mv-angular', () =>
  move('bower_components/angular/**/*.js', './dist/public/lib/angular'));

gulp.task('mv-bootstrap', () =>
  move('bower_components/bootstrap/dist/**/*', './dist/public/lib/bootstrap'));

gulp.task('mv-jquery', () =>
  move('bower_components/jquery/**/*', './dist/public/lib/jquery'));

gulp.task('mv-underscore', () =>
  move('bower_components/underscore/**/*', './dist/public/lib/underscore'));

gulp.task('mv-angularUtils', () =>
  move(
    'bower_components/angular-ui-utils/modules/route/route.js',
    './dist/public/lib/angular-ui-utils/modules'
  ));

gulp.task('mv-angular-bootstrap', () =>
  move(
    'bower_components/angular-bootstrap/**/*',
    './dist/public/lib/angular-bootstrap'
  ));

gulp.task('mv-jade', () => move('app/views/**/*', './dist/app/views'));

gulp.task('mv-config', () => move('config/env/*.json', './dist/config/env'));

gulp.task('mv-public', () =>
  move(['public/**/*', '!public/js/**'], './dist/public'));
