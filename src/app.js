import './style.css'
import client from './client'
import votingService from './votingService'
import likesDislikesFavouritesService from './likesDislikesFavouritesService'
import { createDiv, createElement, createImage } from './domHelper'
import { Gallery } from './gallery';
import {searchBreedByName} from './searchService'

const url = 'https://api.thedogapi.com/v1/images/search';

const imgDogContainer = document.querySelector('.current-dog');
const logo = document.querySelector('.logo');

const navigation = document.querySelector('.navigation .options');
const votingOption = navigation.querySelector('.voting-option');
const breedsOption = navigation.querySelector('.breeds-option');
const galleryOption = navigation.querySelector('.gallery-option');

const homeImg = document.querySelector('.girl-and-pet');

const searchPanel = document.querySelector('.search-head');
const searchForm = searchPanel.querySelector('.search-group');
const btnSearch = searchForm.querySelector('.btn-search');

searchForm.addEventListener('submit', (e) => e.preventDefault())

const linkToLikes = document.querySelector('.link-to-likes');
const linkToFavourites = document.querySelector('.link-to-favour');
const linkToDislikes = document.querySelector('.link-to-dislikes');

const content = document.querySelector('.content');

const panelTegs = content.querySelector('.panel-tegs');
const votingContainer = content.querySelector('.voting-container');

const idElement = panelTegs.querySelector('.tagId');

const sortGallety = panelTegs.querySelector('.sort-group-gallery');
const btnUpload = panelTegs.querySelector('.btn-upload');
const galleryContainer = document.querySelector('.gallery-container');


const sortBreeds = panelTegs.querySelector('.sort-breeds');
const breedsContainer = document.querySelector('.breeds-container');
const breedsName = document.getElementById('select-breed');
const limitSelection = document.getElementById('select-limit');

const likeButton = document.querySelector('.voiting-panel .like');
const dislikeButton = document.querySelector('.voiting-panel .dislike');
const addToFovouriteButton = document.querySelector('.voiting-panel .favourite');

function addHoverClass() {
    const elements = Array.from(this.children)
    elements.forEach(element => {
        if (element.classList.contains('hover')) return;
        element.classList.add('hover');
    })
}
function removeHoverClass() {
    const elements = Array.from(this.children)
    elements.forEach(element => {
        if (element.classList.contains('hover')) {
            element.classList.remove('hover');
        }
    })
}

function homeStylesForConent() {
    Array.from(content.children).forEach(element => element.style.display = 'none');

    content.style.background = '#FBE0DC';
    content.style.height = '840px';
    content.style.width = '680px';
    homeImg.style.display = 'block';
    searchPanel.style.display = 'none';

}
function externalStylesForContent() {
    Array.from(content.children).forEach(element => element.style.display = 'none');

    content.style.background = '#FFFFFF';
    content.style.height = '100%';
    searchPanel.style.display = 'flex';
    sortBreeds.style.display = 'none';
    sortGallety.style.display = 'none';
    btnUpload.style.display = 'none';
    idElement.style.display = 'none'
}


function showHomePage() {
    votingContainer.style.display = 'none';
    homeStylesForConent();
}



function showVotingContent() {
    externalStylesForContent();
    panelTegs.style.display = 'flex';
    panelTegs.querySelector('.teg').innerText = 'VOTING';

    votingContainer.style.display = 'block';

    votingService.selectRandomImage();
    votingService.displayHistory();

    likeButton.addEventListener('click', (e) => {
        votingService.upvote();
        votingService.selectRandomImage();
        votingService.displayHistory()
    })

    dislikeButton.addEventListener('click', (e) => {
        votingService.downvote();
        votingService.selectRandomImage();
        votingService.displayHistory();
    })

    addToFovouriteButton.addEventListener('click', (e) => {
        votingService.addToFavourites();
        votingService.displayHistory();
    })

}


function showBreedsContent(breedName, limit) {
    externalStylesForContent();

    panelTegs.style.display = 'flex';
    sortBreeds.style.display = 'flex';
    panelTegs.querySelector('.teg').innerText = 'BREEDS';
    breedsContainer.style.display = 'block';
    breedsContainer.innerText = '';



    client.get('https://api.thedogapi.com/v1/breeds').then(breeds => {

        if (breedName) {
            console.log("get by name: " + breedName)
            createImageSections(breeds.filter(breed => breed.name === breedName));
        } else {
            console.log("get first 5")

            breedsName.innerHTML = '<option value = "all">All breeds</option>';
            createBreedNameOptions(breeds);
            createImageSections(breeds.slice(0, limit));
        }
    })

}

function createBreedNameOptions(breeds) {
    breeds.forEach(breed => {
        const option = createElement({
            tagName: 'option',
            attributes: {
                value: breed.name
            }
        })

        option.innerText = breed.name;
        breedsName.append(option);
    })
}

function selectBreed(e) {
    console.log(e.target.value);
    client.get('https://api.thedogapi.com/v1/breeds/search?q=' + e.target.value).then(breeds => {
        console.log(breeds);
        createImageSection(breeds.slice(0, 5))
    });

}

function createImageSections(breeds) {
    const chunkSize = 5;
    for (let i = 0; i < breeds.length; i += chunkSize) {
        const chunk = breeds.slice(i, i + chunkSize);
        createImageSection(chunk);
    }
}
function createImageSection(breeds) {
    const section = createElement({
        tagName: 'section',
        className: 'set-images'
    });
    breeds.forEach((breed, i) => {
        const imgContainer = createImageContainer(breed, i + 1)
        section.append(imgContainer);

        imgContainer.addEventListener('click', showDatailsContent);
    });

    breedsContainer.append(section);
}

function showDatailsContent(e) {
    externalStylesForContent();
    const imgElement = this.querySelector('img');

    panelTegs.style.display = 'flex';
    idElement.innerText = imgElement.id;
    idElement.style.display = 'block';



    const dogSection = createElement({ tagName: 'section', className: 'current-dog' });
    dogSection.style.background = `center / 640px url(${imgElement.src}`;
    const datasetInfo = Object.assign(this, imgElement.dataset);

    const infoBlock = createInfoBlock(datasetInfo);
    content.append(dogSection, infoBlock);

}


function createInfoBlock(setInfo) {

    const infoContainer = createElement({ tagName: 'div', className: 'info-container' })
    const breedGroup = createElement({ tagName: 'h2' });
    breedGroup.innerText = setInfo.breedGroup;

    const breedFor = createElement({ tagName: 'h3' });
    breedFor.innerText = setInfo.breedFor;
    const additionalInfo = createElement({ tagName: 'div' });

    const array = [
        '<strong>Temperament: </strong>' + setInfo.temperament,
        '<strong>Weight: </strong>' + setInfo.weight,
        '<strong>Height: </strong>' + setInfo.height,
        '<strong>Life span: </strong>' + setInfo.lifeSpan
    ];
    array.forEach(info => {
        const p = createElement({ tagName: 'p' })
        p.innerHTML = info;
        additionalInfo.append(p)
    })

    infoContainer.append(breedGroup, breedFor, additionalInfo)
    return infoContainer
}

function createImageContainer(breed, i) {
    const imgContainer = createDiv(`img img-${i}`);
    const image = createImage(breed.image.url);

    image.id = breed.id;
    image.dataset.name = breed.name;
    image.dataset.breedGroup = breed.breed_group ?? '';
    image.dataset.breedFor = breed.bred_for ?? '';
    image.dataset.temperament = breed.temperament;
    image.dataset.weight = breed.weight.imperial;
    image.dataset.height = breed.height.imperial;
    image.dataset.lifeSpan = breed.life_span;

    const mask = createDiv('mask');
    const nameOfBreed = createElement({
        tagName: 'span'
    });
    nameOfBreed.innerText = breed.name;
    mask.append(nameOfBreed);
    imgContainer.append(image, mask);
    return imgContainer;
}


async function showGalleryContent() {

    const breeds = await client.get('https://api.thedogapi.com/v1/breeds');
    const gallery = new Gallery(breeds);
    gallery.renderBreedOptions();
    gallery.renderImages();

    externalStylesForContent();
    panelTegs.style.display = 'flex';
    sortGallety.style.display = 'flex';
    btnUpload.style.display = 'block';
    galleryContainer.style.display = 'block';

    panelTegs.querySelector('.teg').innerText = 'GALLERY';
}

const likesDislikesFavsContainer = document.querySelector(".likes-dislikes-favourite-container");

function showLikesContent() {
    externalStylesForContent();
    panelTegs.style.display = 'flex';
    likesDislikesFavsContainer.style.display = 'block'
    panelTegs.querySelector('.teg').innerText = 'LIKES'
    makeActiveButton(linkToLikes)
    likesDislikesFavouritesService.displayLikes()
}

function showFavouritesContent() {
    externalStylesForContent();
    panelTegs.style.display = 'flex';
    likesDislikesFavsContainer.style.display = 'block'
    makeActiveButton(linkToFavourites)
    panelTegs.querySelector('.teg').innerText = 'FAVOURITES'
    likesDislikesFavouritesService.displayFavourites()
}

function showDislikesContent() {
    externalStylesForContent();
    panelTegs.style.display = 'flex';
    likesDislikesFavsContainer.style.display = 'block'
    makeActiveButton(linkToDislikes)
    panelTegs.querySelector('.teg').innerText = 'DISLIKES'
    likesDislikesFavouritesService.displayDislikes()
}

function makeActiveButton(element) {
    document.querySelectorAll(".smiles-group svg").forEach(e => e.classList.remove("active"));
    element.querySelector("svg").classList.add("active");
}

breedsName.addEventListener('change', (e) => {
    const selected = e.target.value;
    if (selected === 'all') {
        showBreedsContent(null, 5);
    } else {
        showBreedsContent(selected, 5);
    }
})
limitSelection.addEventListener('change', (e) => {
    const selected = e.target.value;
    showBreedsContent(null, selected);
})

logo.addEventListener('click', showHomePage)

votingOption.addEventListener('mousemove', addHoverClass);
breedsOption.addEventListener('mousemove', addHoverClass);
galleryOption.addEventListener('mousemove', addHoverClass);

votingOption.addEventListener('mouseout', removeHoverClass);
breedsOption.addEventListener('mouseout', removeHoverClass);
galleryOption.addEventListener('mouseout', removeHoverClass);

votingOption.addEventListener('click', showVotingContent);
breedsOption.addEventListener('click', (e) => { showBreedsContent(null, 5); });
galleryOption.addEventListener('click', showGalleryContent);

linkToLikes.addEventListener('click', showLikesContent)
linkToFavourites.addEventListener('click', showFavouritesContent)
linkToDislikes.addEventListener('click', showDislikesContent)

btnSearch.addEventListener('click', searchBreedByName)




