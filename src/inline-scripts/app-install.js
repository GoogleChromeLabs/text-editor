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

(function(app) {
  const butInstall = document.getElementById('butInstall');

  /**
   * Track successful app installs
   */
  window.addEventListener('appinstalled', (e) => {
    gaEvent('Install', 'installed');
  });

  /**
   * Listen for 'beforeinstallprompt' event, and update the UI to indicate
   * text-editor can be installed.
   */
  window.addEventListener('beforeinstallprompt', (e) => {
    // Don't show the mini-info bar
    e.preventDefault();

    // Log that install is available.
    gaEvent('Install', 'available');

    // Save the deferred prompt
    app.installPrompt = e;

    // Show the install button
    butInstall.removeAttribute('disabled');
    butInstall.classList.remove('hidden');
  });

  // Handle the install button click
  butInstall.addEventListener('click', () => {
    butInstall.setAttribute('disabled', true);
    app.installPrompt.prompt();
    gaEvent('Install', 'clicked');
  });

  myMenus.addKeyboardShortcut(butInstall);
})(app);
