'use strict';
export const createGalleryItemMarkup = images => {
  return images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<li class="gallery-item">
      <a class="gallery-link" href="${largeImageURL}">
          <img
            src="${webformatURL}"
            alt="${tags}"
            class="gallery-img img-fluid" loading="lazy" 
          />
          <div class="text-list">
              <p class="text-likes">Likes: ${likes}</p>
              <p class="text-views">Views: ${views}</p>
              <p class="text-comments">Comments: ${comments}</p>
              <p class="text-downloads">Downloads: ${downloads}</p>
          </div>
        </a>
      </li>`
    )
    .join('');
};
