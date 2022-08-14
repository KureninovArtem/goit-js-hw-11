import axios from 'axios';
import Notiflix from 'notiflix';
import "simplelightbox/dist/simple-lightbox.min.css";
import SimpleLightbox from "simplelightbox";

const refs = {
    form: document.querySelector(".search-form"),
    input: document.querySelector("input"),
    loadMoreBtn: document.querySelector(".load-more"),
    gallery: document.querySelector(".gallery"),
};

let page = 1;

refs.loadMoreBtn.classList.add("hide");

const updateUi = () => {
    refs.gallery.innerHTML = "";
    page = 1;
};

const createUrl = () => {
    const KEY = "29185348-64a39df69b18d57fec00c3d74";
    const BASE_URL = "https://pixabay.com/api";
    const REQUEST = refs.input.value;
    const URL = `${BASE_URL}/?key=${KEY}&q=${REQUEST}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    return URL;
};

const getImages = async (event) => {
    event.preventDefault();
    const url = createUrl();
    try {
        const response = await axios.get(url);
        if (response.data.hits.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            updateUi();
            refs.loadMoreBtn.classList.add("hide");
            return;
        }

        if (event.type === "submit") {
            updateUi();
            Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
        }
        insertContent(response.data.hits);

        if (page === Math.ceil(response.data?.totalHits / 40)) {
            refs.loadMoreBtn.classList.add("hide");
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }

        if (page < Math.ceil(response.data?.totalHits / 40) || response.data?.totalHits.value > 40) {
            refs.loadMoreBtn.classList.remove("hide");
            page += 1;
        }

        if (event.type === "click") {
            const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

            window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

refs.form.addEventListener("submit", getImages);
refs.loadMoreBtn.addEventListener("click", getImages);

const createListItem = (item) => `<div class="photo-card">
    <a class="photo-card-item" href="${item.largeImageURL}">
    <img class="photo-card-image" src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
    <a/>
        <div class="info">
        ${item.likes ? `<p class="info-item">
            <b>Likes ${item.likes}</b>
        </p>` : ""}
        ${item.views ? `<p class="info-item">
            <b>Views ${item.views}</b>
        </p>` : ""}
        ${item.comments ? `<p class="info-item">
            <b>Comments ${item.comments}</b>
        </p>` : ""}
        ${item.downloads ? `<p class="info-item">
            <b>Downloads ${item.downloads}</b>
        </p>` : ""}
        </div>
</div>`;

const generateContent = (array) => (array ? array.reduce((acc, item) => acc + createListItem(item), "") : "");

const insertContent = (array) => {
    const result = generateContent(array);
    refs.gallery.insertAdjacentHTML("beforeend", result);

    let gallery = new SimpleLightbox(".photo-card-item", {
    captionsData: "alt",
    captionDelay: 250,
    captionPosition: "bottom",
    });
    
    gallery.refresh();
};
