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
/* exported newFile, openFile, saveFile, saveFileAs, quitApp */
/* globals app */
/* globals gaEvent */
/* globals confirmDiscard, setFilename, setModified */
/* globals setFocus */
/* globals getFileHandle, getNewFileHandle, readFile, writeFile */


// Verify the APIs we need are supported, show a polite warning if not.
if ('chooseFileSystemEntries' in window) {
  const divNotSupported = document.getElementById('not-supported');
  divNotSupported.classList.add('hidden');
  app.editor.removeAttribute('disabled');
  gaEvent('File System APIs', 'Supported');
} else {
  app.noFS = true;
  // Open the footer
  const footerContainer = document.getElementById('footer');
  footerContainer.setAttribute('open', true);
  // Disable all of the menu items
  const elems = document.querySelectorAll('header button');
  elems.forEach((butt) => {
    butt.setAttribute('disabled', true);
  });
  gaEvent('File System APIs', 'Not Supported');
}

/**
 * Creates an empty notepad with no details in it.
 */
function newFile() {
  if (!confirmDiscard()) {
    return;
  }
  app.editor.value = '';
  app.fileHandle = null;
  setFilename();
  setModified(false);
  setFocus(true);
  gaEvent('File Action', 'New');
}

/**
 * Opens a file for reading.
 */
async function openFile() {
  if (!confirmDiscard()) {
    return;
  }
  try {
    const fileHandle = await getFileHandle();
    const contents = await readFile(fileHandle);
    app.editor.value = contents;
    app.fileHandle = fileHandle;
    setFilename(fileHandle.name);
    gaEvent('File Action', 'Open');
  } catch (ex) {
    console.error('Unable to open file', ex);
    gaEvent('Error - File Action', ex.name);
  }
  setModified(false);
  setFocus(true);
}

/**
 * Saves a file to disk.
 */
async function saveFile() {
  const fileHandle = app.fileHandle;
  try {
    if (!fileHandle) {
      return await saveFileAs();
    }
    await writeFile(fileHandle, app.editor.value);
    setModified(false);
    gaEvent('File Action', 'Save');
  } catch (ex) {
    console.error('Unable to save file', ex);
    gaEvent('Error - File Action', ex.name);
  }
  setFocus();
}

/**
 * Saves a new file to disk.
 */
async function saveFileAs() {
  try {
    const fileHandle = await getNewFileHandle();
    await writeFile(fileHandle, app.editor.value);
    // eslint-disable-next-line require-atomic-updates
    app.fileHandle = fileHandle;
    setFilename(fileHandle.name);
    setModified(false);
    gaEvent('File Action', 'Save As');
  } catch (ex) {
    console.error('Unable to save file as', ex);
    gaEvent('Error - File Action', ex.name);
  }
  setFocus();
}

/**
 * Attempts to close the window
 */
function quitApp() {
  if (!confirmDiscard()) {
    return;
  }
  gaEvent('File Action', 'Quit');
  window.close();
}
