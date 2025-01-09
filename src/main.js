'use strict';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createGalleryItemMarkup } from './js/render-functions.js';
import { fetchPhotosByQuery } from './js/pixabay-api.js';
import { PER_PAGE } from './js/pixabay-api.js';

import axios from 'axios';

const galleryEl = document.querySelector('.js-gallery');
const searchFormEl = document.querySelector('.js-search-form');
const loaderEl = document.querySelector('.loader');
const btnmEl = document.querySelector('.btn-more');

let imagePage = 1;
let totalPages = 0;
let searchQuery;
btnmEl.classList.add('d-none');

async function onSearchFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  searchQuery = form.elements.searchKeyword.value;
  galleryEl.innerHTML = '';
  btnmEl.classList.add('d-none');

  if (searchQuery.trim() === '') {
    iziToast.error({
      message: 'Input field can not be empty',
      color: 'red',
      position: 'topRight',
      timeout: 2000,
      close: true,
    });
    form.reset();
    return;
  }
  galleryEl.innerHTML = '';
  loaderEl.classList.remove('is-hidden');

  try {
    const { data } = await fetchPhotosByQuery(searchQuery);
    if (data.total === 0) {
      iziToast.show({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        color: 'red',
        timeout: 2000,
        close: true,
      });
      return;
    }

    galleryEl.insertAdjacentHTML(
      'beforeend',
      createGalleryItemMarkup(data.hits)
    );

    const lightbox = new SimpleLightbox('.js-gallery a', {
      captionPosition: 'bottom',
      captionDelay: 250,
      captionsData: 'alt',
    });
    lightbox.refresh();

    if (PER_PAGE < data.total) {
      totalPages = Math.ceil(data.total / PER_PAGE);
      console.log(imagePage);
      if (totalPages > 1) {
        btnmEl.classList.remove('d-none');
      }
    } else {
      iziToast.show({
        message: "We're sorry, but you've reached the end of search results",
        position: 'topRight',
        color: 'red',
        timeout: 2000,
        close: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
  form.reset();
  loaderEl.classList.add('is-hidden');
  imagePage = 1;
}

const smoothScrollOnLoadMore = () => {
  const lastImage = galleryEl.querySelector('.gallery-item');
  const imageHeight = lastImage.getBoundingClientRect().height;
  const scrollHeight = imageHeight * 2;

  window.scrollBy({
    top: scrollHeight,
    left: 0,
    behavior: 'smooth',
  });
};

const onLoadMorePressed = async event => {
  try {
    imagePage += 1;
    btnmEl.classList.remove('d-none');
    loaderEl.classList.remove('is-hidden');
    const { data } = await fetchPhotosByQuery(searchQuery, imagePage);

    if (data.total === 0) {
      btnmEl.classList.add('d-none');
      loaderEl.classList.add('is-hidden');
      iziToast.show({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        color: 'red',
        timeout: 2000,
        close: true,
      });
    }

    galleryEl.insertAdjacentHTML(
      'beforeend',
      createGalleryItemMarkup(data.hits)
    );
    loaderEl.classList.add('is-hidden');

    const lightbox = new SimpleLightbox('.js-gallery a', {
      captionPosition: 'bottom',
      captionDelay: 250,
      captionsData: 'alt',
    });
    lightbox.refresh();

    smoothScrollOnLoadMore();
    if (0 < data.total - PER_PAGE * imagePage) {
      if (totalPages > 1) {
        btnmEl.classList.remove('d-none');
      }
    } else {
      btnmEl.classList.add('d-none');
    }
    if (imagePage >= totalPages) {
      iziToast.show({
        message: "We're sorry, but you've reached the end of search results",
        position: 'topRight',
        color: 'red',
        timeout: 2000,
        close: true,
      });
    }
  } catch (error) {
    iziToast.error({
      message: 'Search params is not valid!',
      color: 'red',
      position: 'topRight',
      timeout: 2000,
      close: true,
    });
  }
};
searchFormEl.addEventListener('submit', onSearchFormSubmit);
btnmEl.addEventListener('click', onLoadMorePressed);
