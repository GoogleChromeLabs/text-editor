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
/* globals getFileLegacy, saveAsLegacy */
/* globals confirmDiscard, setFilename, setModified */
/* globals setFocus */
/* globals getFileHandle, getNewFileHandle, readFile, writeFile */


// Verify the APIs we need are supported, show a polite warning if not.
if ('chooseFileSystemEntries' in window) {
  const divNotSupported = document.getElementById('not-supported');
  divNotSupported.classList.add('hidden');
  app.editor.removeAttribute('disabled');
  gaEvent('File System APIs', 'Native');
} else {
  app.noFS = true;
  document.getElementById('legacyFSLabel').classList.toggle('hidden', false);
  document.getElementById('butSave').classList.toggle('hidden', true);
  gaEvent('File System APIs', 'Legacy');
}

app.editor.removeAttribute('disabled');

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
  gaEvent('FileAction', 'New');
}

/**
 * Opens a file for reading.
 */
async function openFile() {
  if (!confirmDiscard()) {
    return;
  }
  let file;
  let fileHandle;

  if (app.noFS) {
    gaEvent('FileAction', 'Open', 'Legacy');
    file = await getFileLegacy();
  } else {
    try {
      gaEvent('FileAction', 'Open', 'Native');
      fileHandle = await getFileHandle();
      file = await fileHandle.getFile();
    } catch (ex) {
      if (ex.name === 'AbortError') {
        return;
      }
      gaEvent('Error', 'FileOpen', ex.name);
      const msg = 'An error occured trying to open the file.';
      console.error(msg, ex);
      alert(msg);
    }
  }

  if (!file) {
    return;
  }

  try {
    const contents = await readFile(file);
    // eslint-disable-next-line require-atomic-updates
    app.editor.value = contents;
    // eslint-disable-next-line require-atomic-updates
    app.fileHandle = fileHandle;
    setFilename(file.name);
    setModified(false);
    setFocus(true);
  } catch (ex) {
    gaEvent('Error', 'FileRead', ex.name);
    const msg = `An error occured reading ${app.fileName}`;
    console.error(msg, ex);
    alert(msg);
  }
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
    gaEvent('FileAction', 'Save');
    await writeFile(fileHandle, app.editor.value);
    setModified(false);
  } catch (ex) {
    gaEvent('Error', 'FileSave', ex.name);
    const msg = 'Unable to save file';
    console.error(msg, ex);
    alert(msg);
  }
  setFocus();
}

/**
 * Saves a new file to disk.
 */
async function saveFileAs() {
  if (app.noFS) {
    gaEvent('FileAction', 'Save As', 'Legacy');
    saveAsLegacy(app.fileName, app.editor.value);
    setModified(false);
  } else {
    gaEvent('FileAction', 'Save As', 'Native');
    let fileHandle;
    try {
      fileHandle = await getNewFileHandle();
    } catch (ex) {
      if (ex.name === 'AbortError') {
        return;
      }
      gaEvent('Error', 'FileSaveAs1', ex.name);
      const msg = 'An error occured trying to open the file.';
      console.error(msg, ex);
      alert(msg);
    }
    try {
      await writeFile(fileHandle, app.editor.value);
      // eslint-disable-next-line require-atomic-updates
      app.fileHandle = fileHandle;
      setFilename(fileHandle.name);
      setModified(false);
    } catch (ex) {
      gaEvent('Error', 'FileSaveAs2', ex.name);
      const msg = 'Unable to save file.';
      console.error(msg, ex);
      alert(msg);
      gaEvent('Error', 'Unable to write file', 'Native');
    }
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
  gaEvent('FileAction', 'Quit');
  window.close();
}
