import React from 'react';
import { jsxToNode } from '../../jsxToNode';
import { allowedUrls } from '../../store';
import styles from './urlDialog.module.css';
export const createDialog = async (): Promise<string> => {
  try {
    let returnValue = '';
    let goodURL = true;
    const backdrop = jsxToNode(dialogJSX()) as HTMLDivElement;
    const dialog = backdrop.querySelector('dialog') as HTMLDialogElement;
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    const input = dialog.querySelector('input') as HTMLInputElement;
    const submitButton = dialog.querySelector('button[type="submit"]') as HTMLButtonElement;
    const cancelButton = dialog.querySelector('button[type="button"]') as HTMLButtonElement;
    const errFld = dialog.querySelector('.error') as HTMLDivElement;

    if (input && submitButton && cancelButton && errFld) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
      input.addEventListener('input', () => {
        returnValue = dialog.returnValue = input.value;
      });

      const dialogClosed = new Promise<void>((resolve) => {
        const handleClose = () => {
          dialog.close(input.value.trim());
          errFld.innerHTML = '';
          resolve();
        };

        submitButton.addEventListener('click', (e) => {
          e.preventDefault();
          if (checkURL(input.value.trim())) {
            if (input.value.trim().startsWith('https://')) {
              goodURL = true;
              handleClose();
            } else {
              goodURL = false;
              errFld.innerHTML = `Link must begin with "https://"`;
            }
          } else {
            goodURL = false;
            errFld.innerHTML = `Invalid URL, ${input.value.trim()}.<br /> Allowed domains:<br/> ${allowedUrls.filter((el) => el !== '*').join('<br/>')}`;
          }
        });

        cancelButton.addEventListener('click', (e) => {
          e.preventDefault();
          input.value = '';
          handleClose();
        });
      });

      await dialogClosed;
    } else {
      throw new Error('Error initializing user create link input dialog');
    }

    backdrop.remove();
    return goodURL ? returnValue.trim() : '';
  } catch (error: any) {
    throw error;
  }
  return '';
};
const checkURL = (url: string): boolean =>
  allowedUrls.includes('*') ? true : allowedUrls.some((domain) => url.includes(domain));
const dialogJSX = () => (
  <div className={styles.backdrop}>
    <dialog className={styles.dialog} open={true}>
      <div className={styles.container}>
        <p>Enter the URL of the link:</p>
        <form>
          <input type="url" value="https://" placeholder="https://" size={50} autoFocus={true} />
        </form>
      </div>
      <button className={styles.button} type="submit">
        Ok
      </button>
      <button className={styles.button} type="button">
        Cancel
      </button>
      <div className={styles.container}>
        <div className={`error ${styles.error}`}></div>
      </div>
    </dialog>
  </div>
);
