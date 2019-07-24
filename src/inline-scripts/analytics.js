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
 * Google Analytics are disable for the demo.
 * To enable, uncomment the two sections marked "Enable Google Analytics Here.",
 * and update the Google Analytics site ID (UA-XXXXXXX-XX).
 */

/* eslint-disable */
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
/* esline-enable */

/* Enable Google Analytics Here. */
// ga('create', 'UA-XXXXXXX-XX', 'auto');
// ga('set', 'transport', 'beacon');



/**
 * Add Analytics script to page
 */
window.addEventListener('DOMContentLoaded', () => {
  if (location.hostname === 'localhost') {
    // eslint-disable-next-line no-console
    console.log('🔕', 'Running on localhost, analytics not loaded.');
    return;
  }

  /* Enable Google Analytics Here. */
  // const gaScript = document.createElement('script');
  // gaScript.src = 'https://www.google-analytics.com/analytics.js';
  // document.head.appendChild(gaScript);
});
