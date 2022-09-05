import 'bootstrap';
import '../scss/styles.scss';

import { searchRecipe, randomReceipe } from './search';

const searchButton = document.getElementById('searchButton');
const searchText = document.getElementById('searchField');
const randomButton = document.getElementById('randomButton');

searchButton.addEventListener("click", (event) => {
    searchRecipe(searchText.value);
    searchText.value = '';
    event.preventDefault();
}, false);

randomButton.addEventListener("click", (event) => {
    randomReceipe();
    searchText.value = '';
    event.preventDefault();
}, false);