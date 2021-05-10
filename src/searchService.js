import { createImageSections } from './imageHelper'
import client from './client'
import { createElement } from './domHelper';

export function searchBreedByName() {

    const breedsContainer = document.querySelector('.breeds-container');
    breedsContainer.innerText = '';
    const panelTegs = document.querySelector('.panel-tegs');
    const searchForm = document.querySelector('.search-group');

    const searchValue = searchForm.querySelector('input');
    panelTegs.style.display = 'flex';
    panelTegs.querySelector('.teg').innerText = 'SEARCH';
    const p = createElement({tagName: 'p'});
    p.innerHTML  = `Search results for: <strong>${searchValue.value}</strong>`;
    p.style.margin = '0 0 20px 20px';
    breedsContainer.append(p)
    client.get('https://api.thedogapi.com/v1/breeds/search', { q: searchValue.value })
        .then(breeds => {
            const requests = breeds
            .filter(breed => breed.reference_image_id)
            .map(breed => {
                return client.get('https://api.thedogapi.com/v1/images/' + breed.reference_image_id)
            });

            Promise.all(requests).then(images => {
                const sections = createImageSections(images);
                breedsContainer.append(...sections);
            })
        });
    searchValue.value = '';
}

