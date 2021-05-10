import votingService from "./votingService";
import favouritesService from "./favouritesService";
import {createImageSections} from "./imageHelper"
import client from "./client";
import {createDiv} from "./domHelper";

class LikesDislikesFavouritesService {

  constructor() {
    this.container = document.querySelector(".likes-dislikes-favourite-container");
  }

  displayLikes() {
    votingService.getVotes().then(values => {
      const likes = values.filter(vote => vote.value === 1);
      const requests = likes.map(value => value.image_id)
        .map(imageId => client.get('https://api.thedogapi.com/v1/images/' + imageId))

      Promise.all(requests).then(values => this.displayImages(values))
    })
  }

  displayDislikes() {
    votingService.getVotes().then(values => {
      const dislikes = values.filter(vote => vote.value === 0);
      const requests = dislikes.map(value => value.image_id)
        .map(imageId => client.get('https://api.thedogapi.com/v1/images/' + imageId))

      Promise.all(requests).then(values => this.displayImages(values))
    })
  }

  displayFavourites() {
    favouritesService.getFavourites().then(values => {
      console.log(values)
      const images = values.map(value => value.image)
      this.displayImages(images)
    })
  }

  displayImages(images) {
    this.container.innerText = '';
    if (images.length) {
      const sections = createImageSections(images);
      this.container.append(...sections);
      this.container.querySelectorAll('.mask').forEach(e => e.parentNode.removeChild(e));
    } else {
      const message = createDiv("message");
      message.innerHTML = '<p>No item found</p>'
      this.container.append(message)
    }
  }

}

export default new LikesDislikesFavouritesService();
