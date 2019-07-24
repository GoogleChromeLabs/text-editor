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

/**
 * Setup keyboard shortcuts
 */
window.addEventListener('keydown', (e) => {
  // console.log('key', e.code, e.ctrlKey, e.metaKey, e.shiftKey, e.key);

  // Save As
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyS') {
    e.preventDefault();
    app.saveFileAs();
    return;
  }

  // Save
  if ((e.ctrlKey === true || e.metaKey === true) && e.key === 's') {
    e.preventDefault();
    app.saveFile();
    return;
  }

  // Open
  if ((e.ctrlKey === true || e.metaKey === true) && e.key === 'o') {
    e.preventDefault();
    app.openFile();
    return;
  }

  // Close
  if ((e.ctrlKey === true || e.metaKey === true) && e.key === 'n') {
    e.preventDefault();
    app.newFile();
    return;
  }

  // Quit
  if ((e.ctrlKey === true || e.metaKey === true) &&
      (e.key === 'q' || e.key === 'w')) {
    e.preventDefault();
    app.quitApp();
    return;
  }

  // Capture Tabs
  if (e.ctrlKey === true && e.shiftKey === true && e.key === 'M') {
    e.preventDefault();
    e.stopPropagation();
    app.toggleCaptureTabs();
  }
});
