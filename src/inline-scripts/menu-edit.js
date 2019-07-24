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
  const menuEdit = document.getElementById('menuEdit');
  myMenus.setup(menuEdit);

  document.getElementById('butCut').addEventListener('click', () => {
    myMenus.hide(menuEdit);
    document.execCommand('cut');
    gaEvent('Edit', 'Cut');
  });

  document.getElementById('butCopy').addEventListener('click', () => {
    myMenus.hide(menuEdit);
    document.execCommand('copy');
    gaEvent('Edit', 'Copy');
  });

  document.getElementById('butPaste').addEventListener('click', async () => {
    myMenus.hide(menuEdit);
    try {
      const contents = await navigator.clipboard.readText();
      app.insertIntoDoc(contents);
      app.setModified(true);
      app.setFocus();
      gaEvent('Edit', 'Paste');
    } catch (ex) {
      console.error('Unable to paste', ex);
      gaEvent('Error', 'Paste', ex.name);
    }
  });
})(app);
