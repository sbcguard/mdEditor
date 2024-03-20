//functions.ts types
export type ErrorProps = {
  err: Error;
  msg?: string;
};
export type FormInputAndControlElements =
  | HTMLButtonElement
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export type SelectionType = Selection | null;
//store.ts types
export type ShortcutKeys = { [key: string]: string };

export type commandObj = { [key: string]: (() => void) | ((url?: string) => void) };

export type MarkDownObject = {
  parent: HTMLElement;
  bodyLength: number;
};
