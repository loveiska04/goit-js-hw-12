import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import {
  createGallery,
  showLoader,
  hideLoader,
  clearGallery,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import { getImagesByQuery } from './js/pixabay-api.js';

const searchForm = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');

const searchState = {
  query: '',
  page: 1,
  perPage: 15,
  totalPages: 0,
};

const scrollPage = () => {
  const card = document.querySelector('.gallery-item');

  const cardHeight = card.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const showEndNotification = message => {
  iziToast.info({
    message,
    pauseOnHover: false,
  });
};

const showErrorNotification = message => {
  iziToast.error({
    message,
    backgroundColor: '#EF4040',
    messageColor: '#fff',
    position: 'topRight',
    pauseOnHover: false,
    close: false,
  });
};

const updateLoadMoreButton = () => {
  if (searchState.page >= searchState.totalPages) {
    hideLoadMoreButton();
    showEndNotification(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    showLoadMoreButton();
  }
};

const sendRequest = async () => {
  showLoader();

  try {
    return await getImagesByQuery(searchState.query, searchState.page);
  } finally {
    hideLoader();
  }
};

const handleSubmit = async e => {
  e.preventDefault();
  clearGallery();

  const input = e.currentTarget.elements['search-text'];
  const query = input.value.trim();

  hideLoadMoreButton();

  if (!query) {
    showErrorNotification('Search field cannot be empty!');

    input.value = '';
    return;
  }

  searchState.query = query;
  searchState.page = 1;

  try {
    const response = await sendRequest();

    if (response.hits.length === 0) {
      showErrorNotification(
        'Sorry, there are no images matching your search query. Please try again!'
      );

      return;
    }

    searchState.totalPages = Math.ceil(
      response.totalHits / searchState.perPage
    );

    createGallery(response.hits);

    updateLoadMoreButton();
  } catch {
    showErrorNotification('Something went wrong. Please try again later.');
  }
};

const loadMoreImages = async () => {
  searchState.page++;

  hideLoadMoreButton();

  try {
    const response = await sendRequest();

    createGallery(response.hits);

    scrollPage();

    updateLoadMoreButton();
  } catch {
    showErrorNotification('Something went wrong. Please try again later.');
  }
};

loadMoreBtn.addEventListener('click', loadMoreImages);
searchForm.addEventListener('submit', handleSubmit);