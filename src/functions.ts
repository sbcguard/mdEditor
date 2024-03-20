import { ErrorProps, FormInputAndControlElements, SelectionType } from './types';
import { shortcutKeys, allowedUrls } from './store';
import {
  undo,
  redo,
  bold,
  italic,
  underline,
  strikethrough,
  subscript,
  superscript,
  removeFormat,
  outdent,
  indent,
  alignJustify,
  alignLeft,
  alignCenter,
  alignRight,
  link,
  unlink,
} from './icons'; //'@fortawesome/free-solid-svg-icons';
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
export const executeFormatCommand = async (command: string) => {
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
                document.execCommand('createLink', false, urlLink);
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
      }
    } else {
      document.execCommand(command, false, undefined);
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
export const buildFormattingBar = (parent: HTMLElement, el: HTMLTextAreaElement) => {
  try {
    if (!parent) throw new Error('Failed to init format bar, no container element provided.');
    hide(el);
    const fBarContainer = document.createElement('div');
    const newTextarea = document.createElement('div');
    fBarContainer.classList.add('formatting-bar');
    fBarContainer.style.display = 'flex';
    fBarContainer.style.justifyContent = 'space-evenly';
    fBarContainer.style.alignItems = 'center';
    const fBarContainerHTML = `
    <div class="input-group do-controls" style="display: flex; align-items: stretch;">
      ${createFormatButton('undo', 'Undo (Ctrl+Z)', undo)}
      ${createFormatButton('redo', 'Redo (Ctrl+Y)', redo)}        
    </div>
    <div class="input-group font-controls" style="display: flex; align-items: stretch;">
      ${createFormatButton('bold', 'Bold (Ctrl+B)', bold)}
      ${createFormatButton('italic', 'Italicize (Ctrl+I)', italic)}        
      ${createFormatButton('underline', 'Underline (Ctrl+U)', underline)}
      </div>
      <div class="input-group script-controls" style="display: flex; align-items: stretch;">
      ${createFormatButton('strikeThrough', 'Strikethrough (Ctrl+S)', strikethrough)}
      ${createFormatButton('subscript', 'Subscript (Ctrl+H)', subscript)}        
      ${createFormatButton('superscript', 'Superscript (Ctrl+G)', superscript)}
      ${createFormatButton('removeFormat', 'Remove formatting (Ctrl+Q)', removeFormat)}
      </div>
      <div class="input-group dent-controls" style="display: flex; align-items: stretch;">
      ${createFormatButton('outdent', 'Outdent (Ctrl+O)', outdent)}
      ${createFormatButton('indent', 'Indent (Ctrl+M)', indent)}
      </div>
      <div class="input-group justification-controls" style="display: flex; align-items: stretch;">
      ${createFormatButton('justifyLeft', 'Left align (Ctrl+L)', alignLeft)}
      ${createFormatButton('justifyCenter', 'Center (Ctrl+E)', alignCenter)}
      ${createFormatButton('justifyRight', 'Right align (Ctrl+R)', alignRight)}
      ${createFormatButton('justifyFull', 'Justify (Ctrl+J)', alignJustify)}
      </div>
      <div class="input-group link-controls" style="display: flex; align-items: stretch;">
      ${createFormatButton('createLink', 'Create link (Ctrl+K)', link)}
      ${createFormatButton('unlink', 'Unlink (Ctrl+D)', unlink)}
    </div>`;
    fBarContainer.innerHTML = fBarContainerHTML;
    newTextarea.classList.add('body-content');
    newTextarea.classList.add(el.name);
    newTextarea.contentEditable = 'true';
    newTextarea.spellcheck = true;
    parent.insertBefore(fBarContainer, el);
    parent.insertBefore(newTextarea, el);
  } catch (error: any) {
    throwError({ err: error, msg: 'Error in buildFormattingBar:' });
  }
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

const counterEvent = (ev: Event) => {
  try {
    const currentTarget = ev.currentTarget as HTMLTextAreaElement;
    if (currentTarget) {
      const { dataset } = currentTarget;
      const maxcount = dataset?.count;
      if (maxcount) {
        if (currentTarget?.value) {
          const newValue = currentTarget.value.slice(0, parseInt(maxcount));
          // Enforce the max length
          if (currentTarget.value !== newValue) {
            currentTarget.value = newValue;
          }
          const el = getCounterElement(currentTarget);
          if (el) {
            el.textContent = currentTarget.value.length + '/' + maxcount;
          } else {
            throw new Error('Failed to find counter element');
          }
        }
      } else {
        throw new Error('No "data-count" attribute found');
      }
    } else {
      throw new Error('No "currentTarget" attribute found');
    }
  } catch (error: any) {
    throwError({ err: error, msg: 'Error in counterEvent:' });
  }
};
const getCounterElement = (el: HTMLTextAreaElement) => {
  try {
    let target = document.querySelector(`[data-counter-for="${el.id || el.name}"]`);
    if (!target) {
      // Create a span for this message
      target = document.createElement('span');
      //TODO: Replace this with global for target textarea from init()
      target.className = `counter-for-${el.name}`;
      target.setAttribute('data-counter-for', el.id || el.name);
      if (el.parentElement) {
        el.parentElement.insertBefore(target, el.nextSibling);
      } else {
        throw new Error(`Couldn't find ${el.outerHTML} parent element`);
      }
    }
    return target;
  } catch (error: any) {
    throwError({ err: error, msg: 'Error in getCounterElement:' });
  }
};
const createFormatButton = (dataFormat: string, title: string, icon: string) =>
  `<button class="input-group-addon input-group-btn"
                data-formatting-exec-command="${dataFormat}" tabindex="-1" title="${title}" type="button" style="max-width: 2rem;" >${icon}</button>`;
const hide = (el: HTMLElement) => {
  el.style.display = 'none';
  el.style.visibility = 'hidden';
};
