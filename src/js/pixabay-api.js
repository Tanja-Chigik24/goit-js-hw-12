'use strict';
import axios from 'axios';

const API_KEY = '47936251-08966a92c9e59538871cb9ab8';
const BASE_URL = 'https://pixabay.com/api/';
axios.defaults.baseURL = BASE_URL;
export const PER_PAGE = 15;
export const fetchPhotosByQuery = (query, imagePage = 1) => {
  const searchParams = new URLSearchParams({
    q: query,
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: PER_PAGE,
    page: imagePage,
  });

  return axios(BASE_URL, {
    params: searchParams,
  });
};
