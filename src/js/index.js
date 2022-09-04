import 'bootstrap';
import '../scss/styles.scss';

const searchButton = document.getElementById('searchButton');
const searchText = document.getElementById('searchField');

searchButton.addEventListener("click", (event) => {
    
    searchText.value = '';
    event.preventDefault();
}, false);