/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/* eslint-env node */
/* eslint require-jsdoc: 0 */

const del = require('del');
const gulp = require('gulp');
const fs = require('fs-extra');
const semver = require('semver');
const copy = require('gulp-copy');
const csso = require('gulp-csso');
const ghPages = require('gh-pages');
const terser = require('gulp-terser');
const eslint = require('gulp-eslint');
const connect = require('gulp-connect');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const workbox = require('workbox-build');
const {series, parallel} = require('gulp');
const inlinesource = require('gulp-inline-source');

let _appVersion;

const SRC_DIR = 'src';
const DEST_DIR = 'build';
const TEMP_DIR = '.tmp';
const TERSER_OPTS = {
  compress: {
    drop_console: true,
  },
  output: {
    beautify: false,
    max_line_len: 120,
    indent_level: 2,
  },
};


/** ***************************************************************************
 * Bump Version Number
 *****************************************************************************/

/**
 * Bumps the version number in the package.json file.
 *
 * @param {string} release - Type of release patch|minor|major.
 * @return {Promise}.
 */
function bumpVersion(release) {
  release = release || 'patch';
  return fs.readJson('package.json')
      .then((data) => {
        const currentVersion = data.version;
        const nextVersion = semver.inc(currentVersion, release);
        data.version = nextVersion;
        return fs.writeJson('package.json', data, {spaces: 2});
      });
}

function bumpPatch() {
  return bumpVersion('patch');
}

function bumpMinor() {
  return bumpVersion('patch');
}

function bumpMajor() {
  return bumpVersion('patch');
}

exports.bumpPatch = bumpPatch;
exports.bumpMinor = bumpMinor;
exports.bumpMajor = bumpMajor;


/** ***************************************************************************
 * Clean
 *****************************************************************************/

function clean() {
  return del(['build/**', '.tmp/**']);
}

exports.clean = clean;


/** ***************************************************************************
 * Linting & Doc Generation
 *****************************************************************************/

function lint() {
  const filesToLint = [
    'gulpfile.js',
    'src/index.html',
    'src/inline-scripts/*',
  ];
  const config = {
    useEslintrc: true,
  };
  return gulp.src(filesToLint)
      .pipe(eslint(config))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
}

exports.lint = lint;


/** ***************************************************************************
 * Generate Service Worker
 *****************************************************************************/

function generateServiceWorker() {
  return workbox.generateSW({
    globDirectory: DEST_DIR,
    globPatterns: [
      '**/*.{html,js,png,jpg,gif,ico}',
    ],
    swDest: `${DEST_DIR}/service-worker.js`,
    clientsClaim: true,
    skipWaiting: true,
    offlineGoogleAnalytics: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'googleapis',
          expiration: {maxEntries: 30},
        },
      },
    ],
  }).then(({warnings}) => {
    for (const warning of warnings) {
      // eslint-disable-next-line no-console
      console.log(warning);
    }
  });
}

exports.generateServiceWorker = generateServiceWorker;


/** ***************************************************************************
 * Build
 *****************************************************************************/

function buildCSS() {
  const cssoOpts = {
    sourceMap: true,
  };
  return gulp.src(`${SRC_DIR}/styles/*.css`)
      .pipe(csso(cssoOpts))
      .pipe(gulp.dest(`${TEMP_DIR}/styles/`));
}

function buildJS() {
  return gulp.src(`${SRC_DIR}/inline-scripts/*.js`)
      .pipe(terser(TERSER_OPTS))
      .pipe(gulp.dest(`${TEMP_DIR}/inline-scripts`));
}

function copyHTML() {
  const filesToCopy = [
    `${SRC_DIR}/index.html`,
  ];
  return gulp.src(filesToCopy)
      .pipe(copy(TEMP_DIR, {prefix: 1}));
}

function buildHTML() {
  const inlineOpts = {
    compress: false,
    pretty: false,
  };
  const htmlMinOpts = {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: false,
    removeComments: true,
  };
  const buildDate = new Date().toISOString();
  const packageJSON = fs.readJsonSync('package.json');
  _appVersion = packageJSON.version;
  return gulp.src(`${TEMP_DIR}/index.html`)
      .pipe(inlinesource(inlineOpts))
      .pipe(replace('[[BUILD_DATE]]', buildDate))
      .pipe(replace('[[VERSION]]', _appVersion))
      .pipe(htmlmin(htmlMinOpts))
      .pipe(gulp.dest(TEMP_DIR));
}

function copyStatic() {
  const filesToCopy = [
    `${TEMP_DIR}/index.html`,
    `${SRC_DIR}/icons/**/*`,
    `${SRC_DIR}/images/**/*`,
    `${SRC_DIR}/sounds/**/*`,
    `${SRC_DIR}/manifest.json`,
    `${SRC_DIR}/robots.txt`,
    `${SRC_DIR}/humans.txt`,
  ];
  return gulp.src(filesToCopy)
      .pipe(copy(DEST_DIR, {prefix: 1}));
}

exports.buildCSS = buildCSS;
exports.buildJS = buildJS;
exports.buildHTML = buildHTML;
exports.copyStatic = copyStatic;
exports.build = series(
    clean,
    parallel(copyHTML, buildCSS, buildJS),
    buildHTML,
    copyStatic
);
exports.buildProd = series(
    clean,
    parallel(copyHTML, buildCSS, buildJS),
    buildHTML,
    copyStatic,
    generateServiceWorker
);


/** ***************************************************************************
 * Development - serving
 *****************************************************************************/

function serveDev() {
  return connect.server({root: 'src'});
}
function serveProd() {
  return connect.server({root: 'build'});
}

exports.serve = serveDev;
exports.serveProd = serveProd;


/** ***************************************************************************
 * Deploy
 *****************************************************************************/

function deployToGHPages(cb) {
  const opts = {
    message: 'Auto-generated deploy commit.',
  };
  if (_appVersion) {
    opts.tag = _appVersion;
  }
  return ghPages.publish('build', opts, (err) => {
    if (err) {
      throw err;
    }
    cb();
  });
}

exports.deployProd = series(
    lint,
    clean,
    bumpPatch,
    parallel(copyHTML, buildCSS, buildJS),
    buildHTML,
    copyStatic,
    generateServiceWorker,
    deployToGHPages
);
