export function createElement({ tagName, className, attributes = {} }) {
  const element = document.createElement(tagName);

  if (className) {
    const classNames = className.split(' ').filter(Boolean);
    element.classList.add(...classNames);
  }

  Object.keys(attributes).forEach((key) => element.setAttribute(key, attributes[key]));

  return element;
}

export function createDiv(classNames){
  return createElement({
    tagName: 'div',
    className: classNames,
  })
}

export function createImage(url){
  return createElement({
    tagName:'img',
    attributes: {
      src: url
    }
  })
}

export function createOption(optionValue, text){
  const optionElement = createElement({
    tagName:'option',
    attributes: {
      value: optionValue
    }
  });
  optionElement.innerText = text;
  return optionElement;
}

export function createSvgIcon(id, viewbox, classes) {
  const svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	const useElem = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  const classNames = classes.split(' ').filter(Boolean);
  svgElem.classList.add(...classNames);
  svgElem.setAttribute('viewBox', viewbox)
  useElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', id);
  svgElem.appendChild(useElem);
  return svgElem;
}
