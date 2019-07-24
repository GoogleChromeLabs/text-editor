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
  const filePicker = document.getElementById('filePicker');
  const aDownloadFile = document.getElementById('aDownloadFile');

  /**
   * Uses the <input type="file"> to open a new file
   *
   * @return {!Promise<File>} File selected by the user.
   */
  app.getFileLegacy = () => {
    return new Promise((resolve, reject) => {
      filePicker.onchange = (e) => {
        const file = filePicker.files[0];
        if (file) {
          resolve(file);
          return;
        }
        reject(new Error('AbortError'));
      };
      filePicker.click();
    });
  };

  /**
   * Saves a file by creating a downloadable instance, and clicking on the
   * download link.
   *
   * @param {string} filename Filename to save the file as.
   * @param {string} contents Contents of the file to save.
   */
  // function saveAsLegacy(filename, contents) {
  app.saveAsLegacy = (filename, contents) => {
    filename = filename || 'Untitled.txt';
    const opts = {type: 'text/plain'};
    const file = new File([contents], '', opts);
    aDownloadFile.href = window.URL.createObjectURL(file);
    aDownloadFile.setAttribute('download', filename);
    aDownloadFile.click();
  };
})(app);
