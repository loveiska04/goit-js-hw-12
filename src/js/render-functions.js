import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more-btn');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export const showLoader = () => {
  loader.classList.remove('is-hidden');
};

export const hideLoader = () => {
  loader.classList.add('is-hidden');
};

export const showLoadMoreButton = () => {
  loadMoreBtn.classList.remove('is-hidden');
};

export const hideLoadMoreButton = () => {
  loadMoreBtn.classList.add('is-hidden');
};

export const clearGallery = () => {
  gallery.innerHTML = '';
};

const renderImages = (largeImageURL, webformatURL, tags) => {
  const link = document.createElement('a');
  const img = document.createElement('img');

  link.className = 'gallery-link';
  link.href = largeImageURL;

  img.className = 'gallery-image';
  img.src = webformatURL;
  img.alt = tags;
  img.loading = 'lazy';

  link.append(img);

  return link;
};

const renderStats = (label, value) => {
  const item = document.createElement('li');
  item.classList.add('stats-item');

  const labelSpan = document.createElement('span');
  labelSpan.classList.add('stats-label');
  labelSpan.textContent = label;

  const valueSpan = document.createElement('span');
  valueSpan.classList.add('stats-value');
  valueSpan.textContent = value;

  item.append(labelSpan, valueSpan);

  return item;
};

export const createGallery = images => {
  const createImages = images.map(
    ({
      largeImageURL,
      webformatURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      const descriptionData = [
        ['Likes', likes],
        ['Views', views],
        ['Comments', comments],
        ['Downloads', downloads],
      ];

      const li = document.createElement('li');
      const descriptionList = document.createElement('ul');

      li.className = 'gallery-item';
      descriptionList.className = 'stats';

      descriptionData.forEach(([label, value]) => {
        descriptionList.append(renderStats(label, value));
      });

      const link = renderImages(largeImageURL, webformatURL, tags);

      li.append(link, descriptionList);

      return li;
    }
  );

  gallery.append(...createImages);
  lightbox.refresh();
};