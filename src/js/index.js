import 'bootstrap';
import '../scss/styles.scss';

import { searchRecipe } from './search';

const searchButton = document.getElementById('searchButton');
const searchText = document.getElementById('searchField');

searchButton.addEventListener("click", (event) => {
    searchRecipe(searchText.value);
    searchText.value = '';
    event.preventDefault();
}, false);