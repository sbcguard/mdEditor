import ReactDOM from 'react-dom';
export const jsxToNode = (jsxElement: JSX.Element): Node => {
  const tempContainer = document.createElement('div');
  ReactDOM.render(jsxElement, tempContainer);
  const domNode = tempContainer.firstChild;
  if (domNode instanceof Element) {
    // const { children, ...attributes } = jsxElement.props;
    // Object.keys(attributes).forEach((propName) => {
    //   const propValue = attributes[propName];
    //   if (propName.startsWith('on') && typeof propValue === 'function') {
    //     const eventName = propName.substring(2).toLowerCase();
    //     domNode.addEventListener(eventName, propValue);
    //   } else {
    //     domNode.setAttribute(propName, propValue);
    //   }
    // });
    return domNode;
  }
  throw new Error('Failed to convert JSX to DOM node');
};
