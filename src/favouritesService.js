import client from './client';

class FavouritesService {

  addImageToFavourites(imageId) {
    client.post('https://api.thedogapi.com/v1/favourites', {'image_id': imageId})
  }

  getFavourites(limit = null) {
    const params = {};
    if (limit) {
      params['limit'] = limit
    }
    return client.get('https://api.thedogapi.com/v1/favourites', params);
  }

}

export default new FavouritesService();
