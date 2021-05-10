import { createElement, createImage, createDiv } from "./domHelper";

export function createImageSections(images) {
    const sections = [];
    const chunkSize = 5;
    for (let i = 0; i < images.length; i += chunkSize) {
        const chunk = images.slice(i, i + chunkSize);
        sections.push(createImageSection(chunk));
    }
    return sections;
}

function createImageSection(images) {
    const section = createElement({ tagName: 'section', className: 'set-images' });
    images.forEach((image, i) => {
        const imgContainer = createImageContainer(image, i + 1);
        section.append(imgContainer);
    });
    return section;
}

function createImageContainer(image, i) {
    const imgContainer = createDiv(`img img-${i}`);
    const imageElement = createImage(image.url);
    const mask = createDiv('mask');
    const maskTextBlock = createElement({ tagName:'span' });
    maskTextBlock.innerText = "icon";
    mask.append(maskTextBlock);
    imgContainer.append(imageElement, mask);
    return imgContainer
}
