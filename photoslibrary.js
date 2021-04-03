const Photos = require('googlephotos');

const listPhotos = (accessToken, pageSize = 50) => {
  const photos = new Photos(accessToken)
  return photos.albums.list(pageSize)
}

module.exports = {
  listPhotos
}