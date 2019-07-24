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
 * Add 'drag-drop' class from body to indicate drag/drop has started.
 */
document.body.addEventListener('dragenter', (e) => {
  // e.stopPropagation();
  // e.preventDefault();
  document.body.classList.toggle('drag-drop', true);
});

/**
 * Remove 'drag-drop' class from body to indicate drag/drop has ended.
 */
document.body.addEventListener('dragleave', (e) => {
  document.body.classList.toggle('drag-drop', false);
});

/**
 * Handle a file being dropped on the surface.
 */
document.body.addEventListener('drop', (e) => {
  e.stopPropagation();
  e.preventDefault();
  if (!app.confirmDiscard()) {
    return;
  }
  gaEvent('FileAction', 'Open', 'Drop');
  const file = e.dataTransfer.files[0];
  if (file && file instanceof File) {
    app.readFile(file);
  }
  document.body.classList.toggle('drag-drop', false);
});
