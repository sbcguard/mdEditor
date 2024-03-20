import React, { FormEventHandler } from 'react';
import styles from './mdTextarea.module.css';

export const mdTextarea = (name: string, bodyLength: number) => (
  <div className="mdeditor-wrapper">
    <div className={`${name} ${styles.editor}`} contentEditable="true" spellCheck="true" />
    <span className={`${name}-counter`}>0/{bodyLength}</span>
    <div className={`undo-stack ${styles.undoStack}`} />
    <div className={`redo-stack ${styles.redoStack}`} />
  </div>
);
