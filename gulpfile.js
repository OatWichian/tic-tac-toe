'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

// DEV Task
gulp.task('dev', (done) => {
  const options = {
    script: 'server.js',
    ext: 'js',
    ignore: ['node_modules/', 'public/', 'uploads/', 'tmp/', '.next/', 'pages/', 'src/', 'store/', 'migrations/', 'express/migrations/', 'express/migrations_log/', '0-document/'],
    env: {
      'NODE_ENV': 'development',
      'CONFIG_ENV': 'development',
      'DB_POOL_MAX': '2',
    },
    legacyWatch: true,
  };
  nodemon(options).on('change', () => {
    console.log('gulp nodemon: app changed.');
  });
  done();
});

// DEV Task
gulp.task('prod', (done) => {
  const options = {
    script: 'server.js',
    ext: 'js',
    ignore: ['node_modules/', 'public/', 'uploads/', 'tmp/', '.next/', 'pages/', 'src/', 'store/', 'migrations/', 'express/migrations/', 'express/migrations_log/', '0-document/'],
    env: {
      'NODE_ENV': 'production',
      'CONFIG_ENV': 'production',
      'IS_DEV':'false',
      'IS_NEXT_DEV':'false',
      'BACKEND_ENDPOINT': 'https://localhost',
      'X_API_KEY': 'api-key',
    },
    legacyWatch: true,
  };
  nodemon(options).on('change', () => {
    console.log('gulp nodemon: app changed.');
  });
  done();
});
