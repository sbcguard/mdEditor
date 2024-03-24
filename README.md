# Simple Markdown Editor

mdEditor is a Markdown editor built using JSX elements and works with native html features.<br/>
Currently using 'document.execCommand' for executing formatting commands. This will be replaced in the next major release due to since execCommand is deprecated.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

To get started with mdEditor, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/sbcguard/mdEditor.git
```

2. Make any necessary style changes.
3. Rebuild with"

```bash
npm run build
```

4. Utilize the csj, esm, or umd modules at a page level by placing a script tag in the head tag of the page. Utilize the provided styles with a link tag.

```html
<script type="text/javascript" src="path/to/mdEditor.js"></script>
<link rel="stylesheet" href="path/to/mdEditor.css" type="text/css" />
```

Alternately, you can use the prebuilt versions provided in the '/dist' folder of the repository.

## Usage

The modules are designed to run at the time of page load. They search for <textarea> that have the dataset attribute "data-mdeditor" attribute set.
You can have an unlimited number of <textarea> with the dataset attribute on a page.

## License

Simple Markdown Editor is [MIT licensed](./LICENSE).
