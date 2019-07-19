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
/* globals gaEvent */
/* globals setupMenu, hideMenu */
/* globals insertIntoDoc, setFocus */
/* globals setModified */

const menuEdit = document.getElementById('menuEdit');
setupMenu(menuEdit);

const butCut = document.getElementById('butCut');
butCut.addEventListener('click', (e) => {
  hideMenu(menuEdit);
  document.execCommand('cut');
  gaEvent('Edit', 'cut');
});

const butCopy = document.getElementById('butCopy');
butCopy.addEventListener('click', (e) => {
  hideMenu(menuEdit);
  document.execCommand('copy');
  gaEvent('Edit', 'copy');
});

const butPaste = document.getElementById('butPaste');
butPaste.addEventListener('click', async (e) => {
  hideMenu(menuEdit);
  try {
    const contents = await navigator.clipboard.readText();
    insertIntoDoc(contents);
    setModified(true);
    setFocus();
    gaEvent('Edit', 'paste');
  } catch (ex) {
    console.error('Unable to paste', ex);
    gaEvent('Error - Paste', ex.name);
  }
});
