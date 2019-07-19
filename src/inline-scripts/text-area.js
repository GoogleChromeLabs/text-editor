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
/* exported adjustFontSize, insertIntoDoc, setFocus */
/* globals app */
/* globals gaEvent */
/* globals setModified, hideAllMenus */

/* Setup the main textarea */
app.editor.addEventListener('input', (e) => {
  setModified(true);
});
app.editor.addEventListener('focusin', (e) => {
  hideAllMenus();
});
app.editor.style.fontSize = `${app.fontSize}px`;
setFocus();

app.editor.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && app.captureTabs) {
    e.preventDefault();
    insertIntoDoc('\t');
  }
});

/**
 * Inserts a string into the editor.
 *
 * @param {string} contents Contents to insert into the document.
 */
function insertIntoDoc(contents) {
  // Find the current cursor position
  const startPos = app.editor.selectionStart;
  const endPos = app.editor.selectionEnd;
  // Get the current contents of the editor
  const before = app.editor.value;
  // Get everything to the left of the start of the selection
  const left = before.substring(0, startPos);
  // Get everything to the right of the start of the selection
  const right = before.substring(endPos);
  // Concatenate the new contents.
  app.editor.value = left + contents + right;
  // Move the cursor to the end of the inserted content.
  const newPos = startPos + contents.length;
  app.editor.selectionStart = newPos;
}


/**
 * Adjust the font size of the textarea up or down by the specified amount.
 *
 * @param {Number} val Number of pixels to adjust font size by (eg: +2, -2).
 */
function adjustFontSize(val) {
  const newFontSize = app.fontSize + val;
  if (newFontSize >= 2) {
    app.editor.style.fontSize = `${newFontSize}px`;
    app.fontSize = newFontSize;
  }
  gaEvent('Font Size', 'Value', null, newFontSize);
}

/**
 * Moves focus to the text area, and potentially cursor to position zero.
 *
 * @param {boolean} startAtTop
 */
function setFocus(startAtTop) {
  app.editor.focus();
  if (startAtTop) {
    app.editor.selectionStart = 0;
    app.editor.selectionEnd = 0;
  }
}
