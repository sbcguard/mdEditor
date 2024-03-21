// Function to toggle bold
import { undoStack, redoStack } from '../store';
export const bold = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontWeight = range.toString().includes('bold') ? 'normal' : 'bold';
    range.surroundContents(span);
  }
};

// Function to toggle italic
export const italic = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontStyle = range.toString().includes('italic') ? 'normal' : 'italic';
    range.surroundContents(span);
  }
};

// Function to toggle underline
export const underline = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.textDecoration = range.toString().includes('underline') ? 'none' : 'underline';
    range.surroundContents(span);
  }
};

// Function to toggle strikeThrough
export const strikeThrough = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.textDecoration = range.toString().includes('line-through') ? 'none' : 'line-through';
    range.surroundContents(span);
  }
};

// Function to toggle subscript
export const subscript = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const sub = document.createElement('sub');
    sub.textContent = range.toString();
    range.deleteContents();
    range.insertNode(sub);
  }
};

// Function to toggle superscript
export const superscript = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const sup = document.createElement('sup');
    sup.textContent = range.toString();
    range.deleteContents();
    range.insertNode(sup);
  }
};

// Function to remove formatting
export const removeFormat = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const parent = range.commonAncestorContainer;
    if (parent instanceof Element) {
      const elementsToRemove = parent.querySelectorAll(
        'b, strong, i, em, u, ins, s, strike, sub, sup',
      );
      elementsToRemove.forEach((el) => {
        el.outerHTML = el.innerHTML; // Remove formatting tags while preserving content
      });
      const styledElements = parent.querySelectorAll('[style]');
      styledElements.forEach((el) => {
        el.removeAttribute('style'); // Remove inline styles
      });
    }
  }
};

// Function to outdent
export const outdent = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const parent = range.commonAncestorContainer;
    const blockElement = getBlockElement(parent);
    if (blockElement) {
      const currentIndent = parseInt(blockElement.style.textIndent || '0', 10);
      if (currentIndent > 0) {
        blockElement.style.textIndent = `${currentIndent - 40}px`; // Decrease by 40px or adjust as needed
      }
    }
  }
};

// Function to indent
export const indent = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const parent = range.commonAncestorContainer;
    const blockElement = getBlockElement(parent);
    if (blockElement) {
      const currentIndent = parseInt(blockElement.style.textIndent || '0', 10);
      blockElement.style.textIndent = `${currentIndent + 40}px`; // Increase by 40px or adjust as needed
    }
  }
};

// Function to justify left
export const justifyLeft = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const parent = range.commonAncestorContainer;
    const blockElement = getBlockElement(parent);
    if (blockElement) {
      blockElement.style.textAlign = 'left';
    }
  }
};

// Function to justify center
export const justifyCenter = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const parent = range.commonAncestorContainer;
    const blockElement = getBlockElement(parent);
    if (blockElement) {
      blockElement.style.textAlign = 'center';
    }
  }
};

// Function to justify right
export const justifyRight = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const parent = range.commonAncestorContainer;
    const blockElement = getBlockElement(parent);
    if (blockElement) {
      blockElement.style.textAlign = 'right';
    }
  }
};

// Function to justify full
export const justifyFull = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const parent = range.commonAncestorContainer;
    const blockElement = getBlockElement(parent);
    if (blockElement) {
      blockElement.style.textAlign = 'justify';
    }
  }
};
//Function to link
export const createLink = (url?: string) => {
  if (url) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const link = document.createElement('a');
      link.href = url;
      link.textContent = range.toString();
      range.deleteContents();
      range.insertNode(link);
    }
  }
};
// Function to unlink
export const unlink = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const link =
      range.commonAncestorContainer.nodeName === 'A'
        ? range.commonAncestorContainer
        : range.commonAncestorContainer.parentElement?.closest('a');
    if (link) {
      const text = document.createTextNode(link.textContent || '');
      link.parentNode?.replaceChild(text, link);
    }
  }
};

// Helper function to get the block element containing the selection
export const getBlockElement = (node: Node | null): HTMLElement | null => {
  while (node) {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      /^(div|p|blockquote|center|header|footer|nav|section|article|aside)$/i.test(node.nodeName)
    ) {
      return node as HTMLElement;
    }
    node = node.parentNode;
  }
  return null;
};
// Function to perform undo action
export const undo = () => {
  const editor = document.activeElement as HTMLDivElement;
  if (editor && editor.contentEditable === 'true') {
    if (undoStack.length > 0) {
      const currentState = editor.innerHTML;
      const newState = undoStack.pop() || '';
      // Create a temporary element to parse the newState
      const tempElement = document.createElement('div');
      tempElement.innerHTML = newState;

      // Find the deepest nested element and its deepest text node
      let deepestElement: HTMLElement | null = tempElement;
      let deepestTextNode: Node | null = null;

      while (deepestElement.lastElementChild) {
        deepestElement = deepestElement.lastElementChild as HTMLElement;
      }

      // Check if the deepest element has a text node
      if (deepestElement.childNodes.length === 1 && deepestElement.firstChild instanceof Text) {
        deepestTextNode = deepestElement.firstChild;
      }

      // If the deepest element has a text node, undo by removing one character
      if (deepestTextNode && deepestTextNode.textContent) {
        const newTextContent = deepestTextNode.textContent.slice(0, -1);
        deepestTextNode.textContent = newTextContent;
      }

      // Update the editor's innerHTML with the modified tempElement content
      editor.innerHTML = tempElement.innerHTML;
      redoStack.push(currentState);
      // editor.innerHTML =
      //   newState === currentState ? newState.substring(0, newState.length - 1) : newState;
    }
  }
};
// Function to perform redo action
export const redo = () => {
  const editor = document.activeElement as HTMLDivElement;
  if (editor && editor.contentEditable === 'true') {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop() || '';
      // editor.innerHTML = nextState || '';
      // Create a temporary element to parse the nextState
      const tempElement = document.createElement('div');
      tempElement.innerHTML = nextState;

      // Find the deepest nested element and its deepest text node
      let deepestElement: HTMLElement | null = tempElement;
      let deepestTextNode: Node | null = null;

      while (deepestElement.lastElementChild) {
        deepestElement = deepestElement.lastElementChild as HTMLElement;
      }

      // Check if the deepest element has a text node
      if (deepestElement.childNodes.length === 1 && deepestElement.firstChild instanceof Text) {
        deepestTextNode = deepestElement.firstChild;
      }

      // If the deepest element has a text node, redo by adding one character
      if (deepestTextNode && deepestTextNode.textContent) {
        const newTextContent = deepestTextNode.textContent + ' ';
        deepestTextNode.textContent = newTextContent;
      }

      // Update the editor's innerHTML with the modified tempElement content
      editor.innerHTML = tempElement.innerHTML;
    }
    // if (!undoStack.includes(editor.innerHTML)) {
    undoStack.push(editor.innerHTML);
    // }
  }
};
// const prevContent = editor.innerHTML
// if (prevContent === '' && nextState === '') {
//   undoStack.pop(); // Remove the empty redo state from undoStack
// } else {
//   undoStack.push(editor.innerHTML); // Push the new content to undoStack
// }
// nextState && undoStack.push(nextState);
