import { ErrorProps, FormInputAndControlElements, SelectionType } from './types';
import { shortcutKeys, allowedUrls } from './store';
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
