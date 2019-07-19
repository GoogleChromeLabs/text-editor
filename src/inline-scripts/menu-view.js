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
/* exported toggleCaptureTabs */
/* globals app */
/* globals gaEvent */
/* globals hideMenu, setupMenu */
/* globals adjustFontSize */

const menuView = document.getElementById('menuView');
setupMenu(menuView);

const butWordWrap = document.getElementById('butWordWrap');
butWordWrap.addEventListener('click', (e) => {
  const newVal = document.body.classList.toggle('wordwrap');
  butWordWrap.setAttribute('aria-checked', newVal);
  gaEvent('Word Wrap', newVal ? 'true' : 'false');
});

const butMonospace = document.getElementById('butMonospace');
butMonospace.addEventListener('click', (e) => {
  const newVal = document.body.classList.toggle('monospace');
  butMonospace.setAttribute('aria-checked', newVal);
  hideMenu(menuView);
  gaEvent('Font Face', newVal ? 'monospace' : 'normal');
});

const butCaptureTabs = document.getElementById('butCaptureTabs');
butCaptureTabs.addEventListener('click', (e) => {
  toggleCaptureTabs();
  hideMenu(menuView);
});

const butFontBigger = document.getElementById('butFontBigger');
butFontBigger.addEventListener('click', (e) => {
  adjustFontSize(+2);
  hideMenu(menuView);
  gaEvent('Font Size', 'Up');
});

const butFontSmaller = document.getElementById('butFontSmaller');
butFontSmaller.addEventListener('click', (e) => {
  adjustFontSize(-2);
  hideMenu(menuView);
  gaEvent('Font Size', 'Down');
});

const tabMovesFocus = document.getElementById('tabMovesFocus');

/**
 * Toggles the capture tab functionality
 */
function toggleCaptureTabs() {
  const newVal = !app.captureTabs;
  app.captureTabs = newVal;
  butCaptureTabs.setAttribute('aria-checked', newVal);
  tabMovesFocus.classList.toggle('hidden', newVal);
}
