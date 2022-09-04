import 'bootstrap';
import '../scss/styles.scss';

const close = document.getElementsByClassName('close')[0];

function showDetail(id) {
    getById(id).then(data => {
        showModal(data[0]);
    })
}

close.addEventListener('click', function() {
    modal.style.display = "none";
});

function showModal(recipe) {
    const modalImage = document.getElementById('modal-image');
    const recipeTitle = document.getElementById('recipe-title');
    const ingredientList = document.getElementById('ingredients-list');
    const instructions = document.getElementById('recipe-instructions');

    modalImage.innerHTML = '';
    recipeTitle.innerHTML = '';
    ingredientList.innerHTML = '';
    instructions.innerHTML = '';

    modalImage.className = "img-fluid rounded mx-auto d-block"
    modalImage.width = 300;
    modalImage.src = recipe.strMealThumb;
    recipeTitle.appendChild(document.createTextNode(recipe.strMeal));
    ingredientList.appendChild(getIngredients(recipe));
    instructions.appendChild(document.createTextNode(recipe.strInstructions));
    instructions.className = "text-justify";
        
    modal.style.display = "block";
}

function getIngredients(data) {
    const list = document.createElement('ul');
    for(let field of Object.keys(data)) {
        if(field.indexOf('strIngredient') >= 0 && !!data[field]) {
            const itemList = document.createElement('li');
            let ingredient = data[field];
            ingredient = ingredient.toLowerCase();
            ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1)
            const text = document.createTextNode(ingredient);
            itemList.appendChild(text);
            list.appendChild(itemList);
        }
    }

    return list;
}

function getById(id) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.meals || [];
        })
}