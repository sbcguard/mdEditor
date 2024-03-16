//mdEditor.js
//sbcguard
//Enabled by setting the target element (textarea) with the attribute data-mdeditor="true"
'use strict';
// Custom Error Handler
const mdEditor = new (function () {
  //Constants/Variables
  const self = this;
  const bcURLs = allowedUrls;
  let md_area = undefined,
    body_div = undefined,
    body_max_length = 0;
  // Ensure body contents are updated when editable div is updated
  self.updateBodyContents = () => {
    try {
      // Update textarea to the contents of the body div, replacing characters at code point 128 and above with HTML entities, and removing <br> inside other tags
      md_area.value = body_div.innerHTML
        .replace(/\r?\n/g, '<br>') // Make newlines breaks
        .replace(/[\u0080-\uFFFF]/g, (m) => {
          return '&#' + m.charCodeAt(0) + ';';
        }) // Replace with HTML entities
        .replace(/<[^>]*(<br>[^>]*?)+>/gi, (m) => {
          return m.replace(/<br>/gi, '');
        }) // Remove <br> inside tags
        .replace(/<[^>]*(<br\/>[^>]*?)+>/gi, (m) => {
          return m.replace(/<br\/>/gi, '');
        }); // Remove <br/> inside tags
      // Show character counter
      if (md_area.value.trim() === '<br>') md_area.value = '';
      if (body_div.innerHTML.trim() === '<br>') body_div.innerHTML = '';
      if (body_div.textContent.trim() === '') body_div.innerHTML = '';
      self.getCounterElement(md_area).innerText = md_area.value.length + '/' + body_max_length;
    } catch (error) {
      throwError(error, 'Error in updateBodyContents:');
    }
  };
  //COUNTER ELEMENT CONTROLS
  self.addCounterElement = (el, maxlength) => {
    try {
      self.removeCounterElement(el);
      // Set data-count depending on passed value or maxlength, if appropriate
      if (maxlength !== undefined) {
        el.setAttribute('data-count', maxlength);
      } else if (isNaN(parseInt(el.getAttribute('data-count')))) {
        el.setAttribute('data-count', el.getAttribute('maxlength'));
      }
      el.addEventListener('input', counterEvent);
      el.addEventListener('keypress', counterEvent);
      el.addEventListener('change', counterEvent);
      el.addEventListener('blur', counterEvent);
      counterEvent({ currentTarget: el }); // Show count immediately
      return self;
    } catch (error) {
      throwError(error, 'Error in addCounterElement:');
    }
  };
  self.removeCounterElement = (el) => {
    try {
      el.removeEventListener('input', counterEvent);
      el.removeEventListener('keypress', counterEvent);
      el.removeEventListener('change', counterEvent);
      el.removeEventListener('blur', counterEvent);
      self.getCounterElement(el).textContent = '';
      return self;
    } catch (error) {
      throwError(error, 'Error in removeCounterElement:');
    }
  };
  // Set up the form when the DOM finishes loading
  const initialize = async () => {
    try {
      //Append After form element
      md_area = document.querySelector('[data-mdeditor="true"]');
      if (!md_area) return;
      if (md_area.tagName.toLowerCase() !== 'textarea')
        throwError(
          `Mark down editor can only be used with a <textarea> element, was applied to <${md_area.tagName.toLowerCase()}>. Check implementation.`,
        );
      const parentContainer = md_area.parentElement;
      //Set md_editor field length
      await setBodyMaxLength(md_area);
      //Build md_editor controls
      await buildFormattingBar(parentContainer);
      //Style md_editor specific elements
      await buildStyles();
      //Init Counter
      await initCounter(md_area, body_max_length);
      body_div = document.querySelector('.body-content');
      // Capture shortcut keys
      body_div.addEventListener('keydown', self.captureShortcut);
      // Update the content on every input
      body_div.addEventListener('input', self.updateBodyContents);
      body_div.addEventListener('keyup', self.updateBodyContents);
      body_div.addEventListener('change', self.updateBodyContents);
      // Perform an update before the form is submitted
      md_area.form.addEventListener('submit', self.updateBodyContents);
      // Formatting bar
      Array.from(
        document.querySelectorAll('.formatting-bar button[data-formatting-exec-command]'),
      ).forEach((el) => {
        el.addEventListener('click', (e) => {
          self.executeFormatCommand(e.currentTarget.getAttribute('data-formatting-exec-command'));
        });
      });
      Array.from(
        document.querySelectorAll('.formatting-bar select[data-formatting-exec-command]'),
      ).forEach((el) => {
        el.addEventListener('change', (e) => {
          const { currentTarget: targ } = e;
          const { value: checked } = targ.querySelector(':checked');
          document.execCommand(target.getAttribute('data-formatting-exec-command'), false, checked);
        });
      });
    } catch (error) {
      throwError(error, 'Error in initialize:');
    }
  };
  const initCounter = async (md_el, maxlength) => {
    try {
      self.addCounterElement(md_el, maxlength);
      let count = md_el.getAttribute('data-count');
      if (count != 'true' && isNaN(parseInt(count))) {
        console.log('data-count invalid: ' + md_el.getAttribute('data-count'));
      }
      self.addCounterElement(md_el, maxlength);
    } catch (error) {
      throwError(error, 'Error in initCounter:');
    }
  };
  const setBodyMaxLength = async (md_el) => {
    try {
      //Hooks into native mPower textarea onkeypress attribute to obtain field length dynamically.
      const keyPressValue = md_el?.onkeypress?.toString() || '(null,10000)';
      const startIndex = keyPressValue.indexOf(',');
      const endIndex = keyPressValue.lastIndexOf(')');
      const fldLength = keyPressValue.substring(startIndex + 1, endIndex);
      body_max_length = !isNaN(fldLength) ? parseInt(fldLength) : 0;
    } catch (error) {
      throwError(error, 'Error in setBodyMaxLength:');
    }
  };
  const buildFormattingBar = async (container) => {
    try {
      if (!container) throwError('Failed to init format bar, no container element provided.');
      const origChild = container.querySelector('[data-mdeditor="true"]');
      const bodyElName = origChild.name;
      const fBarContainer = document.createElement('div');
      const newBodyTextarea = document.createElement('div');
      if (!origChild.classList.contains('hidden')) {
        origChild.classList.add('hidden');
      }
      fBarContainer.classList = 'formatting-bar';
      fBarContainer.innerHTML = `<div class="input-group do-controls">
                                            <button class="fa fa-undo input-group-addon input-group-btn" data-formatting-exec-command="undo" tabindex="-1" title="Undo (Ctrl+Z)" type="button"></button>
                                            <button class="fa fa-repeat input-group-addon input-group-btn" data-formatting-exec-command="redo" tabindex="-1" title="Redo (Ctrl+Y)" type="button"></button>
                                        </div>
                                        <div class="input-group font-controls">
                                            <button class="fa fa-bold input-group-addon input-group-btn" data-formatting-exec-command="bold" tabindex="-1" title="Bold (Ctrl+B)" type="button"></button>
                                            <button class="fa fa-italic input-group-addon input-group-btn" data-formatting-exec-command="italic" tabindex="-1" title="Italicize (Ctrl+I)" type="button"></button>
                                            <button class="fa fa-underline input-group-addon input-group-btn" data-formatting-exec-command="underline" tabindex="-1" title="Underline (Ctrl+U)" type="button"></button>
                                        </div>
                                        <div class="input-group script-controls">
                                            <button class="fa fa-strikethrough input-group-addon input-group-btn" data-formatting-exec-command="strikeThrough" tabindex="-1" title="Strikethrough (Ctrl+S)" type="button"></button>
                                            <button class="fa fa-subscript input-group-addon input-group-btn" data-formatting-exec-command="subscript" tabindex="-1" title="Subscript (Ctrl+H)" type="button"></button>
                                            <button class="fa fa-superscript input-group-addon input-group-btn" data-formatting-exec-command="superscript" tabindex="-1" title="Superscript (Ctrl+G)" type="button"></button>
                                            <button class="fa fa-eraser input-group-addon input-group-btn" data-formatting-exec-command="removeFormat" tabindex="-1" title="Remove formatting (Ctrl+Q)" type="button"></button>
                                        </div>
                                        <div class="input-group dent-controls">
                                            <button class="fa fa-outdent input-group-addon input-group-btn" data-formatting-exec-command="outdent" tabindex="-1" title="Outdent (Ctrl+O)" type="button"></button>
                                            <button class="fa fa-indent input-group-addon input-group-btn" data-formatting-exec-command="indent" tabindex="-1" title="Indent (Ctrl+M)" type="button"></button>
                                        </div>
                                        <div class="input-group justification-controls">
                                            <button class="fa fa-align-left input-group-addon input-group-btn" data-formatting-exec-command="justifyLeft" tabindex="-1" title="Left align (Ctrl+L)" type="button"></button>
                                            <button class="fa fa-align-center input-group-addon input-group-btn" data-formatting-exec-command="justifyCenter" tabindex="-1" title="Center (Ctrl+E)" type="button"></button>
                                            <button class="fa fa-align-right input-group-addon input-group-btn" data-formatting-exec-command="justifyRight" tabindex="-1" title="Right align (Ctrl+R)" type="button"></button>
                                            <button class="fa fa-align-justify input-group-addon input-group-btn hidden" data-formatting-exec-command="justifyFull" tabindex="-1" title="Justify (Ctrl+J)" type="button"></button>
                                        </div>
                                        <div class="input-group link-controls">
                                            <button class="fa fa-link input-group-addon input-group-btn" data-formatting-exec-command="createLink" tabindex="-1" title="Create link (Ctrl+K)" type="button"></button>
                                            <button class="fa fa-unlink input-group-addon input-group-btn" data-formatting-exec-command="unlink" tabindex="-1" title="Unlink (Ctrl+D)" type="button"></button>
                                        </div>`;
      newBodyTextarea.classList = `body-content ${bodyElName}`;
      newBodyTextarea.contentEditable = true;
      newBodyTextarea.spellCheck = true;
      container.insertBefore(fBarContainer, origChild);
      container.insertBefore(newBodyTextarea, origChild);
    } catch (error) {
      throwError(error, 'Error in buildFormattingBar:');
    }
  };
  const buildStyles = async () => {
    try {
      const targElName = document.querySelector('[data-mdeditor="true"]').name;
      const styleEl = document.createElement('style');
      styleEl.innerHTML = `.formatting-bar {
    margin-bottom: 5px;
    display: flex;
    justify-content: space-evenly;
}
.${targElName} {
    background-color: #fff;
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    border-color: #ccc;
    overflow: hidden;
    width: 100%;
    white-space: pre-wrap;
}
.body-content {
min-height: 250px;
background-color: white;
}
.counter-for-${targElName} {
    background-color: #E7E7E7;
    padding: 5px;
    border: 1px solid #A9A9A9;
    font-size: 0.875rem /* 14px */;
    display: inline-block;
}
.md-dialog {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border: 1px solid orange;
  background-color: white;
  padding: 1rem;
  margin: 0.5rem;
  text-align: center;
  width: 40rem;
  max-height: 90vh;
  z-index: 10;
  position: fixed;
  top: 7.5vh;
  overflow: auto;
  left: calc(50% - 20rem);
}
.md-dialog button {
  margin-right: 1rem;
}
.md-dialog-container { 
  margin-bottom: 1rem;
}
.md-backdrop {
  position: fixed;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.75);
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
}
`;
      document.head.appendChild(styleEl);
    } catch (error) {
      throwError(error, 'Error in buildStyles:');
    }
  };
  //Checks links to ensure they are only to County pages
  const checkURL = (urlToCheck) => bcURLs.some((url) => urlToCheck.includes(url));
  try {
    document.addEventListener('DOMContentLoaded', initialize); //initializes mdEditor on document load
    if (document.readyState === 'complete') {
      initialize();
    } //allows for defer/"lazy" loading
  } catch (error) {
    throwError(error, 'Failed to initialize Markdown Editor:');
  }
})();
