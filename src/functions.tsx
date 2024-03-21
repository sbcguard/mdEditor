import React from 'react';
import ReactDOM from 'react-dom';
import { ErrorProps, FormInputAndControlElements, SelectionType } from './types';
import { shortcutKeys, allowedUrls, commandExec, undoStack, redoStack } from './store';
import { undo } from './execCommand';
export const throwError = ({ err, msg }: ErrorProps) => {
  // On any error, disable all forms to prevent bad emails from being sent
  const forms = document.querySelectorAll<HTMLFormElement>('form');
  forms.forEach((form) => {
    const targetElements = form.querySelectorAll<FormInputAndControlElements>(
      'input,select,textarea,button',
    );
    targetElements.forEach(
      (el) => (el.disabled = !(el.disabled || el.getAttribute('disabled') === '')),
    );
  });
  if (err) {
    // Basic error message
    throw new Error(msg ? `${msg} ${err.message}` : err.message);
  } else {
    // Error handling for error handling
    throw new Error('Invalid error object/message');
  }
};
export const captureShortcut = (ev: KeyboardEvent) => {
  try {
    const key = ev.key.toUpperCase();
    if (ev.ctrlKey && shortcutKeys[key] !== undefined) {
      // Execute the shortcut
      executeFormatCommand(shortcutKeys[key]);
      // A special key was captured, so prevent the default behavior
      ev.preventDefault();
      ev.stopPropagation();
    }
  } catch (error: any) {
    throwError({ err: error, msg: 'Error in captureShortcut:' });
  }
};
export const addCommandEvents = (formatBar: Node) => {
  try {
    // Add a click event listener to the formatting bar
    formatBar.addEventListener('click', (ev) => {
      try {
        const target = ev.target as HTMLElement;
        const tagname = target.tagName.toLowerCase();
        if (['button'].includes(tagname)) {
          ev.preventDefault();
          const command = target.getAttribute('data-command');
          if (command) {
            executeFormatCommand(command);
          }
        }
      } catch (error: any) {
        throwError({ err: error, msg: 'Error in addCommandEvent event listener application:' });
      }
    });
  } catch (error: any) {
    throwError({ err: error, msg: 'Error in addCommandEvent:' });
  }
};
const executeFormatCommand = async (command: string) => {
  try {
    const win: Window | undefined = window;
    if (win) {
      if (command.toLowerCase() == 'createlink') {
        // Preserve text selection so link can be applied correctly
        const selection: SelectionType = win.getSelection();
        if (selection) {
          const rangeCount: number = selection.rangeCount;
          if (rangeCount > 0) {
            const dialogRange: Range = selection.getRangeAt(0);
            const urlLink = await createDialog();
            if (urlLink && checkURL(urlLink)) {
              if (urlLink.startsWith('https://')) {
                selection.removeAllRanges();
                selection.addRange(dialogRange);
                commandExec[command](urlLink);
                //document.execCommand('createLink', false, urlLink);
              } else {
                alert(`Link must begin with "https://"`);
              }
            } else {
              alert(`Link must be to an allowed URL: \r\n${allowedUrls.join('\r\n')}`);
            }
          } else {
            alert(
              "A selection must be made before creating a link. High the text to add a link to and click the 'Create Link' button again.",
            );
          }
        }
      } else {
        commandExec[command]();
        //document.execCommand(command, false, undefined);
      }
    }
  } catch (error: any) {
    throwError({ err: error, msg: 'Error in executeFormatCommand:' });
  }
};
export const setBodyMaxLength = (el: HTMLTextAreaElement): number => {
  try {
    //Hooks into native HTML textarea maxlength attribute to obtain field length, default to 10,000.
    const maxlength = el.maxLength || 10000;
    if (!(el.maxLength > 0)) {
      console.warn(el, ': missing maxlength attribute, defaulting to 10000 allowed characters');
    }
    return maxlength;
  } catch (error: any) {
    throwError({ err: error, msg: 'Error in setBodyMaxLength:' });
  }
  return 0;
};

const createDialog = async (): Promise<string> => {
  try {
    let returnValue = '';
    const backdrop = document.createElement('div');
    const dialog = document.createElement('dialog');

    dialog.open = true;
    dialog.innerHTML = `
      <div class="md-dialog-container">
        <p>Enter the URL of the link:</p>
        <form>
          <input type="url" value="https://" size="50" autofocus>
          <button type="submit">Ok</button>
          <button type="button">Cancel</button>
        </form>
      </div>
    `;

    const input = dialog.querySelector('input');
    const submitButton = dialog.querySelector('button[type="submit"]');
    const cancelButton = dialog.querySelector('button[type="button"]');

    if (input && submitButton && cancelButton) {
      input.addEventListener('input', () => {
        returnValue = input.value;
      });

      const dialogClosed = new Promise<void>((resolve) => {
        const handleClose = () => {
          dialog.close(input.value);
          resolve();
        };

        submitButton.addEventListener('click', (e) => {
          e.preventDefault();
          handleClose();
        });

        cancelButton.addEventListener('click', (e) => {
          e.preventDefault();
          handleClose();
        });
      });

      await dialogClosed;
    } else {
      throw new Error('Error initializing user input dialog');
    }

    backdrop.remove();
    return returnValue;
  } catch (error: any) {
    throwError({ err: error, msg: 'Error in createDialog:' });
  }
  return '';
};
const checkURL = (url: string): boolean =>
  allowedUrls.includes('*') ? true : allowedUrls.some((url) => url.includes(url));

export const addEditorEvents = (el: Node) => {
  try {
    el.addEventListener('input', updateClipboard);
    el.addEventListener('input', updateCount);
    el.addEventListener('keypress', updateCount);
    el.addEventListener('change', updateCount);
    el.addEventListener('blur', updateCount);
  } catch (error: any) {
    throw error;
  }
};
const updateClipboard = (ev: Event) => {
  try {
    const parent = ev.currentTarget as HTMLDivElement;
    const editor = parent.querySelector('div') as HTMLDivElement;
    const content = editor.innerHTML;
    undoStack.push(content);
    redoStack.length = 0;
    const prevState = undoStack.length > 1 ? undoStack[undoStack.length - 1] : null;
    window.history.replaceState({ content: content, prevState: prevState }, '');
  } catch (error: any) {
    throw error;
  }
};
const updateCount = (ev: Event) => {
  try {
    let maxAllowed = 10000;
    const parent = ev.currentTarget as HTMLDivElement;
    const editor = parent.querySelector('div') as HTMLDivElement;
    const countSpan: HTMLSpanElement | null = parent.querySelector(
      `span[class="${editor.classList[0]}-counter"]`,
    );
    const origInput: HTMLTextAreaElement | null = document.querySelector(
      `textarea[name=${editor.classList[0]}]`,
    );
    const count = editor.textContent?.length || 0;
    if (countSpan) {
      const [val, max] = countSpan.textContent?.split('/') || [0, 10000];
      maxAllowed = parseInt(max.toString());
      countSpan.textContent = `${count}/${max}`;
    }
    if (origInput) {
      if (editor.innerHTML.length > maxAllowed) {
        ev.preventDefault();
        origInput.value = editor.innerHTML.substring(0, maxAllowed - 1);
      } else {
        origInput.value = editor.innerHTML;
      }
    }
  } catch (error: any) {
    throw error;
  }
};
export const hide = (el: HTMLElement) => {
  el.style.display = 'none';
  el.style.visibility = 'hidden';
};
export const jsxToNode = (jsxElement: JSX.Element): Node => {
  const tempContainer = document.createElement('div');
  ReactDOM.render(jsxElement, tempContainer);
  const domNode = tempContainer.firstChild;
  if (domNode instanceof Element) {
    const { children, ...attributes } = jsxElement.props;
    // Object.keys(attributes).forEach((propName) => {
    //   const propValue = attributes[propName];
    //   if (propName.startsWith('on') && typeof propValue === 'function') {
    //     const eventName = propName.substring(2).toLowerCase();
    //     domNode.addEventListener(eventName, propValue);
    //   } else {
    //     domNode.setAttribute(propName, propValue);
    //   }
    // });
    return domNode;
  }
  throw new Error('Failed to convert JSX to DOM node');
};
