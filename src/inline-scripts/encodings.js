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

"use strict";

/*
<div id="menuEncodings" class="menuContainer">
	<button id="butEncodings" class="menuTop" aria-label="Encodings" aria-haspopup="true" aria-expanded="false">
		<span class="kbdShortcut">E</span>ncoding
	</button>
	<div role="menu" class="menuItemContainer hidden">
		<button disabled type="button" role="menuitem">UTF-8</button>
		...
		<button disabled type="button" role="menuitem">x-user-defined</button>
	</div>
</div>
*/

{
	const menuEncodings = document.getElementById("menuEncodings");

	myMenus.setup(menuEncodings);

	const supportedEncodings = new Map;

	// idbKeyval.get("encoding");
	// idbKeyval.set("encoding", app.options.encoding);

	const buttonContainer = menuEncodings.querySelector(".menuItemContainer");

	const encodingButtons = buttonContainer.children;

	new Set(encodingButtons).forEach(
		async button => {
			const encoding = button.textContent;

			supportedEncodings.set( encoding, new TextDecoder(encoding) );

			button.removeAttribute("disabled");
		}
	);

	// HTMLButtonElement
	// starts as UTF-8
	let [ lastSelectedEncoding ] = encodingButtons;

	// event delegation
	buttonContainer.addEventListener(
		"click",
		({ isTrusted, target }) => {
			if ( isTrusted && target !== lastSelectedEncoding ) {
				const encoding = app.options.encoding = target.textContent;

				// set selected classes and aria attributes

				lastSelectedEncoding.setAttribute("aria-checked", "false");

				if ( target.getAttribute("aria-checked") === "true" ) {
					target.setAttribute("aria-checked", "false"); 
				} else {
					target.setAttribute("aria-checked", "true"); 
				}

				lastSelectedEncoding = target;

				if ( !supportedEncodings.has( encoding ) ) {
					// safey assertion; impossible to reach without tampering with the DOM at runtime, copying the file, or forking the source 
					throw new Error( "unreachable" );
				}

				const decoder = supportedEncodings.get( encoding );

				const data = new TextEncoder().encode( app.getText() );

				app.setText( decoder.decode( data ) );
			}
		}, {
			passive: true
		}
	);

	app.supportedEncodings = supportedEncodings;
}
