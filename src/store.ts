import {
  bold,
  redo,
  undo,
  italic,
  underline,
  strikeThrough,
  subscript,
  superscript,
  removeFormat,
  outdent,
  indent,
  justifyCenter,
  justifyFull,
  justifyLeft,
  justifyRight,
  createLink,
  unlink,
} from './execCommand';
import { ShortcutKeys, commandObj } from './types';
export const shortcutKeys: ShortcutKeys = {
  Z: 'undo',
  Y: 'redo',
  B: 'bold',
  I: 'italic',
  U: 'underline',
  S: 'strikeThrough',
  H: 'subscript',
  G: 'superscript',
  Q: 'removeFormat',
  O: 'outdent',
  M: 'indent',
  L: 'justifyLeft',
  E: 'justifyCenter',
  R: 'justifyRight',
  J: 'justifyFull',
  K: 'createLink',
  D: 'unlink',
};
export const commandExec: commandObj = {
  undo: undo,
  redo: redo,
  bold: bold,
  italic: italic,
  underline: underline,
  strikeThrough: strikeThrough,
  subscript: subscript,
  superscript: superscript,
  removeFormat: removeFormat,
  outdent: outdent,
  indent: indent,
  justifyLeft: justifyLeft,
  justifyCenter: justifyCenter,
  justifyRight: justifyRight,
  justifyFull: justifyFull,
  createLink: createLink,
  unlink: unlink,
};
export const allowedUrls: string[] = ['*'];
