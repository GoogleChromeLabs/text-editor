/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * Allows the user to choose what encoding to read files as
 * 
 * TODO: make sure files are written in the proper encoding too!
*/

if ('arrayBuffer' in Blob.prototype) {
  const menuEncodings = document.getElementById('menuEncodings');

  myMenus.setup(menuEncodings);

  // if Blob#arrayBuffer exists, then they can choose an encoding
  menuEncodings.querySelector('#butEncodings').removeAttribute('disabled');

  const { supportedEncodings } = app;

  const buttonContainer = menuEncodings.querySelector('.menuItemContainer');

  const encodingButtons = buttonContainer.children;

  // Set for iteration
  new Set(encodingButtons).forEach(
    // async for errors
    async button => {
      const encoding = button.textContent;

      supportedEncodings.set(encoding, new TextDecoder(encoding));

      // if creating the TextDecoder threw,
      // then this line won't be reached,
      // and the client won't be allowed to select it
      button.removeAttribute('disabled');
    }
  );

  app.encodeFile = async (
    file_promise = app.file.handle.getFile(),
    encoding = app.options.encoding
  ) => {
    // await default params aren't allowed
    const file = await file_promise;

    if (!supportedEncodings.has(encoding)) {
      // safey assertion;
      // impossible to reach without tampering with the DOM at runtime,
      // using dev tools,
      // editing the file,
      // or forking the source
      alert('An error occurred when encoding or decoding a file');

      throw new Error('unreachable');
    }

    const decoder = supportedEncodings.get(encoding);

    const buffer = await file.arrayBuffer();

    return decoder.decode(buffer);
  };

  // HTMLButtonElement
  // starts as UTF-8
  let [lastSelectedEncoding] = encodingButtons;

  // event delegation across all encoding buttons
  buttonContainer.addEventListener(
    'click',
    async ({ isTrusted, target }) => {
      // if they select the currently selected button: nop
      if (isTrusted === true && target !== lastSelectedEncoding) {
        {
          const encoding = app.options.encoding = target.textContent;

          idbKeyval.set('encoding', encoding);
        }

        // set selected classes and aria attributes

        lastSelectedEncoding.setAttribute('aria-checked', 'false');

        {
          // reverses current aria-checked
          const isNotChecked = target.getAttribute('aria-checked') === 'false';

          target.setAttribute('aria-checked', isNotChecked.toString());
        }

        lastSelectedEncoding = target;

        app.setText(await app.encodeFile());
      }
    }, {
      passive: true
    }
  );

  // gets last selected encoding; initializes `lastSelectedButton`
  (async () => {
    const encoding = app.options.encoding = await idbKeyval.get('encoding');
    // set button

    lastSelectedEncoding.setAttribute('aria-checked', 'false');

    // is there a more efficient way to do this?
    lastSelectedEncoding = Array.from(encodingButtons).find(
      (button) => button.innerText === encoding
    );

    lastSelectedEncoding.setAttribute('aria-checked', 'true');
  })();

} else {
  console.warn('Encoding is not configurable.');
}
