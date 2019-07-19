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
/* globals setupMenu, hideMenu */
/* globals newFile, openFile, saveFile, saveFileAs, quitApp */

const menuFile = document.getElementById('menuFile');
setupMenu(menuFile);

const butNewFile = document.getElementById('butNew');
butNewFile.addEventListener('click', (e) => {
  hideMenu(menuFile);
  newFile();
});

const butOpenFile = document.getElementById('butOpen');
butOpenFile.addEventListener('click', (e) => {
  hideMenu(menuFile);
  openFile();
});

const butSaveFile = document.getElementById('butSave');
butSaveFile.addEventListener('click', (e) => {
  hideMenu(menuFile);
  saveFile();
});

const butSaveFileAs = document.getElementById('butSaveAs');
butSaveFileAs.addEventListener('click', (e) => {
  hideMenu(menuFile);
  saveFileAs();
});

const butCloseFile = document.getElementById('butClose');
butCloseFile.addEventListener('click', (e) => {
  hideMenu(menuFile);
  quitApp();
});
