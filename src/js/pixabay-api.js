import axios from 'axios';

const API_KEY = '56778535-647a0d2fab6513f9c5838607a';

const pixabayApi = axios.create({ baseURL: 'https://pixabay.com/api/' });

export const getImagesByQuery = async (query, page) => {
  const response = await pixabayApi.get('', {
    params: {
      key: API_KEY,
      q: query,
      page,
      per_page: 15,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
  return response.data;
};