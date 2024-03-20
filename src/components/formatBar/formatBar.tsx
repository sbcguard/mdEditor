import React from 'react';
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
} from '../../icons';
import styles from './formatBar.module.css';
const createFormatButton = (dataFormat: string, title: string, icon: React.JSX.Element) => (
  <button
    className={styles.formatBtn}
    data-command={dataFormat}
    tabIndex={-1}
    title={title}
    typeof="button"
  >
    {icon}
  </button>
);
export const formatBarContainer = () => (
  <div className={`formatting-bar ${styles.container}`}>
    <div className={`do-controls ${styles.inputGroup}`}>
      {createFormatButton('undo', 'Undo (Ctrl+Z)', undo)}
      {createFormatButton('redo', 'Redo (Ctrl+Y)', redo)}
    </div>
    <div className={`font-controls ${styles.inputGroup}`}>
      {createFormatButton('bold', 'Bold (Ctrl+B)', bold)}
      {createFormatButton('italic', 'Italicize (Ctrl+I)', italic)}
      {createFormatButton('underline', 'Underline (Ctrl+U)', underline)}
    </div>
    <div className={`script-controls ${styles.inputGroup}`}>
      {createFormatButton('strikeThrough', 'Strikethrough (Ctrl+S)', strikethrough)}
      {createFormatButton('subscript', 'Subscript (Ctrl+H)', subscript)}
      {createFormatButton('superscript', 'Superscript (Ctrl+G)', superscript)}
      {createFormatButton('removeFormat', 'Remove formatting (Ctrl+Q)', removeFormat)}
    </div>
    <div className={`dent-controls ${styles.inputGroup}`}>
      {createFormatButton('outdent', 'Outdent (Ctrl+O)', outdent)}
      {createFormatButton('indent', 'Indent (Ctrl+M)', indent)}
    </div>
    <div className={`justification-controls ${styles.inputGroup}`}>
      {createFormatButton('justifyLeft', 'Left align (Ctrl+L)', alignLeft)}
      {createFormatButton('justifyCenter', 'Center (Ctrl+E)', alignCenter)}
      {createFormatButton('justifyRight', 'Right align (Ctrl+R)', alignRight)}
      {createFormatButton('justifyFull', 'Justify (Ctrl+J)', alignJustify)}
    </div>
    <div className={`link-controls ${styles.inputGroup}`}>
      {createFormatButton('createLink', 'Create link (Ctrl+K)', link)}
      {createFormatButton('unlink', 'Unlink (Ctrl+D)', unlink)}
    </div>
  </div>
);
