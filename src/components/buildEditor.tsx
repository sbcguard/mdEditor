import React from 'react';
import { MarkDownObject } from '../../src/types';
import { hide, throwError, jsxToNode, addEditorEvents, addCommandEvents } from '../functions';
import { formatBarContainer } from './formatBar';
import { mdTextarea } from './mdTextarea';
import styles from './buildEditor.module.css';
export const buildEditor = (obj: MarkDownObject, el: HTMLTextAreaElement) => {
  try {
    if (!parent) throw new Error('Failed to init format bar, no container element provided.');
    hide(el);
    const formatBar = jsxToNode(formatBarContainer());
    const markDownEditor = jsxToNode(mdTextarea(el.name, obj.bodyLength));
    addCommandEvents(formatBar);
    addEditorEvents(markDownEditor);
    obj.parent.insertBefore(formatBar, el);
    obj.parent.insertBefore(markDownEditor, el);
  } catch (error: any) {
    throwError({ err: error, msg: 'Error in buildFormattingBar:' });
  }
};
