import { createDiv, createSvgIcon } from './domHelper'
import favouritesService from './favouritesService';
import client from './client';

function convertTime(date) {
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  return hours + ':' + minutes
}

const MAX_HISTORY_TO_DISPLAY = 4;

class VotingService {
  constructor() {
    this.currentImageId = undefined;
    this.currentDogElement = document.querySelector(".current-dog")
    this.historyElement = document.querySelector(".notices");
  }

  selectRandomImage() {
    this.getRandomImage().then(response => {
      const image = response[0];
      this.currentDogElement.style.backgroundImage = `url(${image.url})`
      this.currentImageId = image.id;
    })

  }

  displayHistory() {
    Promise.all([
      favouritesService.getFavourites(),
      this.getVotes()
    ]).then(values => {
      const historyItems = [];
      const [favs, votes] = values
      favs.map(this.convertFavourite).forEach(value => historyItems.push(value));
      votes.map(this.convertVote).forEach(value => historyItems.push(value));
      historyItems.sort((x,y) => y.timestamp - x.timestamp)

      this.historyElement.innerHTML = '';
      historyItems.slice(0, MAX_HISTORY_TO_DISPLAY)
        .map(value => value.element)
        .forEach(element => this.historyElement.appendChild(element))

    })
  }

  convertFavourite(fav) {
    const createdAt = new Date(fav.created_at);
    const time = convertTime(createdAt);
    const paragraph = `<p><span class="time">${time}</span> Image ID: <b>${fav.image_id}</b> was added to Favourites</p>`;
    const svg = createSvgIcon('#icon-favourite', '0 0 30 26', 'notice-sm notice-heart')

    const element = createDiv("notice");
    element.innerHTML = paragraph;
    element.append(svg);

    return {
      timestamp: createdAt,
      element: element
    }
  }

  convertVote(vote) {
    const createdAt = new Date(vote.created_at);
    const like = vote.value;
    const icon = like ? "#icon-like" : "#icon-dislike";
    const iconClass = like ? "notice-pos" : "notice-neg"
    const time = convertTime(createdAt);
    const paragraph = `<p><span class="time">${time}</span> Image ID: <b>${vote.image_id}</b> was added to ${like? 'Likes' : 'Dislikes'}</p>`;
    const svg = createSvgIcon(icon, '0 0 30 30', 'notice-sm ' + iconClass)

    const element = createDiv("notice");
    element.innerHTML = paragraph;
    element.append(svg);

    return {
      timestamp: createdAt,
      element: element
    }
  }

  getRandomImage() {
    return client.get('https://api.thedogapi.com/v1/images/search?limit=1&size=full');
  }

  upvote() {
    if (this.currentImageId) {
      this.vote(this.currentImageId, true);
    }
  }

  downvote() {
    if (this.currentImageId) {
      this.vote(this.currentImageId, false);
    }
  }

  addToFavourites() {
    if (this.currentImageId) {
      favouritesService.addImageToFavourites(this.currentImageId);
    }
  }

  vote(imageId, like) {
    return client.post('https://api.thedogapi.com/v1/votes', {
      'image_id': imageId,
      'value': like? 1 : 0
    })
  }

  getVotes(limit = null) {
    const params = {};
    if (limit) {
      params['limit'] = limit
    }
    return client.get('https://api.thedogapi.com/v1/votes', params);
  }

}

export default new VotingService();
