// mdEditor main.js
import { MarkDownObject } from './types';
import {
  throwError,
  captureShortcut,
  executeFormatCommand,
  setBodyMaxLength,
  buildFormattingBar,
} from './functions';
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
      buildFormattingBar(mdObj.parent, md_area);
      //   //Style md_editor specific elements
      //   await buildStyles();
      //   //Init Counter
      //   await initCounter(md_area, body_max_length);
      //   body_div = document.querySelector('.body-content');
      //   // Capture shortcut keys
      //   body_div.addEventListener('keydown', self.captureShortcut);
      //   // Update the content on every input
      //   body_div.addEventListener('input', self.updateBodyContents);
      //   body_div.addEventListener('keyup', self.updateBodyContents);
      //   body_div.addEventListener('change', self.updateBodyContents);
      //   // Perform an update before the form is submitted
      //   md_area.form.addEventListener('submit', self.updateBodyContents);
      //   // Formatting bar
      //   Array.from(
      //     document.querySelectorAll('.formatting-bar button[data-formatting-exec-command]'),
      //   ).forEach((el) => {
      //     el.addEventListener('click', (e) => {
      //       self.executeFormatCommand(e.currentTarget.getAttribute('data-formatting-exec-command'));
      //     });
      //   });
      //   Array.from(
      //     document.querySelectorAll('.formatting-bar select[data-formatting-exec-command]'),
      //   ).forEach((el) => {
      //     el.addEventListener('change', (e) => {
      //       const { currentTarget: targ } = e;
      //       const { value: checked } = targ.querySelector(':checked');
      //       document.execCommand(target.getAttribute('data-formatting-exec-command'), false, checked);
      //     });
      //   });
    });
  } catch (error: any) {
    throw new Error(`${error.message}\r\nFailed to initialize mark down editor.`);
  }
}

// Call the init function immediately when the module is imported
init();
