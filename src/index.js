import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SearchPhotos from './js/searchPhotos';
import renderPhoto from './js/renderPhoto';

const searchForm = document.querySelector('.search__form');
const loadMoreButton = document.querySelector('.more__button');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', getPhotos);
loadMoreButton.addEventListener('click', loadMore);

const searchPhotos = new SearchPhotos();

let lightbox = new SimpleLightbox('.gallery .photo-link', {
  captionsData: 'alt',
  captionDelay: 250,
});

async function loadMore() {
  try {
    searchPhotos.incrementPage();
    const responce = await searchPhotos.getGallery();
    checkTotalHits(responce);
    const photoHits = responce.hits;
      photoHits.map(photoHit => {
        renderPhoto(photoHit);
      });
    
    lightbox.refresh();
  } catch (error) {
    console.log(error);
   
  }
}

function checkTotalHits(responce) {

  if (Math.ceil(responce.totalHits / searchPhotos.per_page) <= searchPhotos.page) {     
      loadMoreButton.classList.add('hidden');      
      return Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
    }
    
    if (responce.totalHits >= 40) {
      loadMoreButton.classList.remove('hidden');
    }
}

async function getRequest() {  
try {
    const responce = await searchPhotos.getGallery()
    console.log(responce);
    const totalHits = responce.totalHits;

    if (responce.hits.length !== 0) {
          Notify.success(`Hooray! We found ${totalHits} images.`);
        }

    if (responce.hits.length === 0) {
      loadMoreButton.classList.add('hidden');
      throw new Error();
    }
    checkTotalHits(responce);
    const photoHits = responce.hits;
      photoHits.map(photoHit => {
        renderPhoto(photoHit);
      });

} catch (error) {
  console.log(error);
  loadMoreButton.classList.add('hidden');
  Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
)}
}

function getPhotos(event) {
  event.preventDefault();
  searchPhotos.resetPage();
  searchPhotos.query = event.currentTarget.elements.searchQuery.value;
  if (searchPhotos.query === '') {
    Notify.warning('Please, enter word or words for searching pictures.');
    return;
  }
  clearGallery();
  getRequest();
}

function clearGallery() {
  gallery.innerHTML = '';
}



