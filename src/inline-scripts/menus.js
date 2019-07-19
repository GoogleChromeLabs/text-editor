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
/* exported addKeyboardShortcutForMenu, hideMenu, setupMenu */
/* globals app */
/* globals setFocus */

/**
 * Initializes a drop down menu.
 *
 * @param {Element} container Container element with the drop down menu.
 */
function setupMenu(container) {
  const toggleButton = container.querySelector('button.menuTop');
  toggleButton.addEventListener('click', () => {
    _toggleMenu(toggleButton);
  });
  addKeyboardShortcutForMenu(toggleButton);
  container.addEventListener('keydown', (e) => {
    if (e.keyCode === 27) {
      hideAllMenus();
      setFocus();
      return;
    }
    if (e.keyCode === 40) {
      const next = e.srcElement.nextElementSibling;
      if (next) {
        next.focus();
      }
      return;
    }
    if (e.keyCode === 38) {
      const prev = e.srcElement.previousElementSibling;
      if (prev) {
        prev.focus();
      }
      return;
    }
  });
}

/* Show shortcuts on menu items when ALT key is pressed, non-Mac only */
if (!app.isMac) {
  window.addEventListener('keydown', (e) => {
    if (e.altKey === true && e.key === 'Alt') {
      document.body.classList.toggle('altKey', true);
    }
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Alt') {
      document.body.classList.toggle('altKey', false);
    }
  });
}

/**
 * Initializes a drop down menu.
 *
 * @param {Element} button Toggle button to show/hide menu.
 */
function addKeyboardShortcutForMenu(button) {
  if (app.isMac) {
    // Keyboard shortcuts aren't available on mac.
    return;
  }
  let key;
  try {
    key = button.querySelector('.kbdShortcut').textContent.trim().toLowerCase();
  } catch (ex) {
    // No keyboard shortcut found.
  }
  if (!key) {
    return;
  }
  window.addEventListener('keydown', (e) => {
    if (e.altKey === true && e.key === key) {
      button.click();
    }
  });
}

/**
 * Hides all visible menus.
 */
function hideAllMenus() {
  const elems = document.querySelectorAll('.menuContainer');
  elems.forEach((elem) => {
    hideMenu(elem);
  });
}

/**
 * Hides a menu dropdown.
 *
 * @param {Element} menuContainer Container element with the drop down menu.
 */
function hideMenu(menuContainer) {
  const button = menuContainer.querySelector('.menuTop');
  button.setAttribute('aria-expanded', false);
  const panel = menuContainer.querySelector('.menuItemContainer');
  if (panel) {
    panel.classList.toggle('hidden', true);
  }
}

/**
 * Shows a menu dropdown.
 *
 * @param {Element} menuContainer Container element with the drop down menu.
 */
function showMenu(menuContainer) {
  hideAllMenus();
  const button = menuContainer.querySelector('.menuTop');
  button.setAttribute('aria-expanded', true);
  const panel = menuContainer.querySelector('.menuItemContainer');
  panel.classList.toggle('hidden', false);
  const firstButton = panel.querySelector('button');
  firstButton.focus();
}

/**
 * Toggles a menu open or closed.
 *
 * @private
 * @param {Element} button Toggle button to show/hide menu.
 */
function _toggleMenu(button) {
  const parent = button.parentElement;
  const expanded = button.getAttribute('aria-expanded');
  if (expanded === 'true') {
    hideMenu(parent);
  } else {
    showMenu(parent);
  }
}
