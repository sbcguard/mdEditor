// mdEditor main.js
import { MarkDownObject } from './types';
import { throwError, captureShortcut, setBodyMaxLength } from './functions';
import { buildEditor } from './components';
export async function init(): Promise<void> {
  try {
    // Wait for the DOMContentLoaded event before executing further
    await new Promise<void>((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => resolve());
      } else {
        resolve();
      }
    });

    //Append After form element
    const md_areas: NodeListOf<HTMLTextAreaElement> =
      document.querySelectorAll('[data-mdeditor="true"]');
    //Check for dataset attribute that triggers initialization on the textarea
    if (!md_areas) return;
    //Check that all marked elements are textarea elements
    if (!Array.from(md_areas).every((el) => el.tagName.toLowerCase() === 'textarea')) {
      const badElements = Array.from(md_areas).filter(
        (el) => el.tagName.toLowerCase() !== 'textarea',
      );
      throw new Error(
        `Invalid element(s) selected for mark down editor:\r\n ${badElements.map((el) => el.outerHTML).join('\r\n')}\r\n`,
      );
    }
    //Check for additional required attributes
    md_areas.forEach((md_area: HTMLTextAreaElement) => {
      const mdObj: MarkDownObject = {
        parent: md_area.parentElement || document.body,
        //   //Set md_editor field length
        bodyLength: setBodyMaxLength(md_area),
      };
      //Build md_editor controls
      buildEditor(mdObj, md_area);
      //Start capturing key events
      mdObj.parent.addEventListener('keydown', captureShortcut);
    });
  } catch (error: any) {
    throw new Error(`${error.message}\r\nFailed to initialize mark down editor.`);
  }
}

// Call the init function immediately when the module is imported
init();
