import client from "./client";
import { createOption } from "./domHelper";
import { createImageSections } from "./imageHelper";

export class UploadImageModal {

    constructor () {
        this.uploadImageModal = document.querySelector('#upload-image-modal');
        this.uploadImageModalCloseButton = this.uploadImageModal.querySelector('.btn-close');
        this.openImageButton = this.uploadImageModal.querySelector('.btn-open-img');
        this.imageInput = this.uploadImageModal.querySelector('#img-input-button');
        this.imageBox = this.uploadImageModal.querySelector('.upload-img-box');
        this.imageBoxText = this.uploadImageModal.querySelector('.upload-img-box p');
        this.imageInfoText = this.uploadImageModal.querySelector('.image-info');
        this.uploadBtn = this.uploadImageModal.querySelector('.btn-upload-img');
        this.successMessage = this.uploadImageModal.querySelector('.upload-success');
        this.failedMessage = this.uploadImageModal.querySelector('.upload-failed');

        this.addEventListeners();
    }

    addEventListeners() {
        this.uploadImageModalCloseButton.addEventListener('click', (e) => {
            this.close();
        });
        this.openImageButton.addEventListener('click', (e) => {
            this.imageInput.click();
        });
        this.imageInput.addEventListener('change', (e) => {
            this.file = e.target.files[0];
            this.previewImage()
        });
        this.uploadBtn.addEventListener('click', (e) => {
            this.uploadImage();
        });
    }

    open() {
        this.uploadImageModal.style.display = 'block';
    }

    close() {
        this.uploadImageModal.style.display = 'none';
        this.reset();
    }

    previewImage() {
        const objectUrl = URL.createObjectURL(this.file);
        this.setImageBoxBackground(objectUrl, 'contain');
        this.imageInfoText.innerText = `Image File Name: ${this.file.name}`;
        this.uploadBtn.style.display = 'block';
    }

    uploadImage() {
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('sub_id', '1');

        client.postMultiPartForm('https://api.thedogapi.com/v1/images/upload', formData)
            .then(response => {
                this.reset();
                if (response.status === 201) {
                    this.successMessage.style.display = 'block';
                } else {
                    this.failedMessage.style.display = 'block';
                }
            });
    }

    reset() {
        this.file = null;
        this.imageInput.value = '';
        this.uploadBtn.style.display = 'none';
        this.imageInfoText.innerText = `No file selected`;
        this.setImageBoxBackground('../imgs/image-box-background.jpg', 'auto');
        this.successMessage.style.display = 'none';
        this.failedMessage.style.display = 'none';
    }

    setImageBoxBackground(url, size) {
        this.imageBox.style.backgroundImage = `url('${url}')`;
        this.imageBox.style.backgroundSize = size;
    }
}