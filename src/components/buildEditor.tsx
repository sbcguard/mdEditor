import React from 'react';
import { MarkDownObject } from '../../src/types';
import {
  hide,
  throwError,
  jsxToNode,
  addEditorEvents,
  addCommandEvents,
  attachSubmitEvent,
} from '../functions';
import { formatBarContainer } from './formatBar';
import { mdTextarea } from './mdTextarea';
import styles from './buildEditor.module.css';
export const buildEditor = (obj: MarkDownObject, el: HTMLTextAreaElement) => {
  try {
    if (!parent) throw new Error('Failed to init format bar, no container element provided.');
    const parentForm = el.closest('form') as HTMLFormElement;
    if (!parentForm) throw new Error(`Failed to find parent form element for ${el.name}`);
    hide(el);
    const formatBar = jsxToNode(formatBarContainer());
    const markDownEditor = jsxToNode(mdTextarea(el.name, obj.bodyLength)) as HTMLDivElement;
    addCommandEvents(formatBar);
    addEditorEvents(markDownEditor);
    obj.parent.insertBefore(formatBar, el);
    obj.parent.insertBefore(markDownEditor, el);
    attachSubmitEvent(parentForm, markDownEditor, el);
  } catch (error: any) {
    throwError({ err: error, msg: 'Error in buildFormattingBar:' });
  }
};
