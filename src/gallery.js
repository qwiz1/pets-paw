import client from "./client";
import { createOption } from "./domHelper";
import { createImageSections } from "./imageHelper";
import { UploadImageModal } from "./uploadImageModal";

export class Gallery {

    constructor (breeds) {
        this.breeds = breeds;
        
        this.breedSelection = document.querySelector('.sort-group-gallery #select-breed');
        this.orderSelection = document.querySelector('.sort-group-gallery #select-order');
        this.typeSelection = document.querySelector('.sort-group-gallery #select-type');
        this.limitSelection = document.querySelector('.sort-group-gallery #select-limit');
        this.imagesContainer = document.querySelector('.gallery-container');
        this.reloadButton = document.querySelector('.sort-group-gallery #btn-reload');
        this.uploadImageButton = document.querySelector('.btn-upload');
        this.uploadImageModal = new UploadImageModal();

        this.limit = this.limitSelection.value;
        this.order = this.orderSelection.value;
        this.mimeTypes = this.typeSelection.value;
        this.breed = this.breedSelection.value;

        this.addEventListeners();
    }

    addEventListeners() {
        this.breedSelection.addEventListener('change', (e) => {
            this.breed = e.target.value;
            this.renderImages();
        });
        this.orderSelection.addEventListener('change', (e) => {
            this.order = e.target.value;
            this.renderImages();
        });
        this.typeSelection.addEventListener('change', (e) => {
            this.mimeTypes = e.target.value;
            this.renderImages();
        });
        this.limitSelection.addEventListener('change', (e) => {
            this.limit = e.target.value;
            this.renderImages();
        });
        this.reloadButton.addEventListener('click', (e) => this.renderImages());
        this.uploadImageButton.addEventListener('click', (e) => {
            this.uploadImageModal.open();
        });
    }

    renderBreedOptions() {
        this.breedSelection.innerText = '';
        const allBreedsOption = createOption('all', 'All breeds');
        this.breedSelection.append(allBreedsOption);
        this.breeds.forEach(breed => {
            const option = createOption(breed.id, breed.name);
            this.breedSelection.append(option);
        });
    }

    async renderImages() {
        const params = {
            order: this.order,
            limit: this.limit,
            mime_types: this.mimeTypes
        };
        if (this.breed !== 'all') {
            params.breed_id = this.breed;
        }
        const images = await client.get(`https://api.thedogapi.com/v1/images/search`, params);
        const sections = createImageSections(images);
        this.imagesContainer.innerText = '';
        this.imagesContainer.append(...sections);
    }

}