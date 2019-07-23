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
/* exported confirmDiscard, setFilename, setModified */
/* globals app */

const spanFileName = document.getElementById('headerFileName');
const spanAppName = document.getElementById('headerAppName');
const modifiedHeader = document.getElementById('modifiedHeader');
const modifiedFooter = document.getElementById('modifiedFooter');

// Setup the before unload listener to prevent accidental loss on navigation.
window.addEventListener('beforeunload', (e) => {
  const msg = `There are unsaved changes. Are you sure you want to leave?`;
  if (app.isModified) {
    e.preventDefault();
    e.returnValue = msg;
  }
});

/**
 * Confirms user does not want to save before closing the current doc.
 *
 * @return {boolean} True if it's OK to discard.
 */
function confirmDiscard() {
  if (!app.isModified) {
    return true;
  }
  const confirmMsg = 'Discard changes? All changes will be lost.';
  return confirm(confirmMsg);
}

/**
 * Updates the UI with the current file name.
 * @param {string} filename Filename to display in header.
 */
function setFilename(filename) {
  if (filename) {
    document.title = `${filename} - ${app.appName}`;
    spanFileName.textContent = filename;
    spanAppName.classList.toggle('hidden', false);
  } else {
    document.title = app.appName;
    spanFileName.textContent = app.appName;
    spanAppName.classList.toggle('hidden', true);
  }
  app.fileName = filename;
}

/**
 * Updates the UI if the file has been modified.
 *
 * @param {boolean} val True if the file has been modified.
 */
function setModified(val) {
  if (app.noFS) {
    return;
  }
  const hidden = !val;
  modifiedHeader.classList.toggle('hidden', hidden);
  modifiedFooter.classList.toggle('hidden', hidden);
  app.isModified = val;
}
