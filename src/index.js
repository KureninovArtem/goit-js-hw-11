import axios from 'axios';

const form = document.querySelector(".search-form");
const input = document.querySelector(".search-form-input");

const createUrl = () => {
    const KEY = "29185348-64a39df69b18d57fec00c3d74";
    const BASE_URL = "https://pixabay.com/api";
    const REQUEST = input.value;;
    const URL = `${BASE_URL}/?key=${KEY}&q=${REQUEST}&image_type=photo`;
    return URL;
};

const getImages = async (event) => {
    event.preventDefault();
    const url = createUrl();
    try {
        const response = await axios.get(url);
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
};

form.addEventListener("submit", getImages);