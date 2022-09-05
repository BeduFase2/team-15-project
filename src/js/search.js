import * as MyMeal from './request'
import Swal from 'sweetalert2';

// Check if the text is valid, if so it request to the API otherwise show an error
function searchRecipe(textToSearch) {
    const container = document.getElementById("carousel-body");
    container.innerHTML = '';
    
    if (!textToSearch.length) {
        Swal.fire({
            icon: 'error',
            title: "Valor invalido",
            text: "Ingresa un valor correcto"
        });
        document.getElementById("recipes-container").style.display = 'none';
    } 
    else {
        MyMeal.searchMealByName(textToSearch).then(function (data) {
            if (!data.length) {
                Swal.fire({
                    icon: 'info',
                    title: "No se encontraron resultados",
                });
                document.getElementById("recipes-container").style.display = 'none';
            } else {
                document.getElementById("recipes-container").style.display = 'block';
                splitData(getItemObject(data));
                container.childNodes[0].scrollIntoView();
            }
        })
        .catch(error => console.log(error));
    }
}

function alert(message, type) {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    alertPlaceholder.append(wrapper)
}

// Map the array of results to a new object, choosing the 
// attributes needed
const getItemObject = (data) => {
    return data.map(item => {
        return {
            id: item.idMeal,
            image: item.strMealThumb,
            name: item.strMeal,
            area: item.strArea,
            category: item.strCategory
        }
    });
}

// Split the array of results to create the carousel's slides
// and call getCard() to create the slides
function splitData(data)
{
    let index = 0;
    let first = true;
    const carouselBody = document.getElementById("carousel-body");
    while(index < data.length)
    {
        let itemSlide = document.createElement("div");
        itemSlide.className = "carousel-item";
        if(first)
        {
            itemSlide.className='carousel-item active';
            first = false;
        }
        itemSlide.appendChild(getCard(data.splice(index,4)));
        carouselBody.appendChild(itemSlide);
    }
}

// Receive an array of length <= 4 and create a slide with 4 recipes
// and return the slide
function getCard(data) {
    const results = document.createElement('div');
    results.className = "row";
    data.forEach(async object => {
        const container = document.createElement("div");
        container.className = 'col-lg-3 col-md-6 col-sm-12 mb-4';
        const card = document.createElement('div');
        card.className = "card";
        const image = document.createElement('img');
        image.className = 'card-img-top';
        const cardBody = document.createElement('div');
        cardBody.className = "card-body";
        const title = document.createElement('h5');
        title.className = 'card-title';
        // const subtitle = document.createElement('h6');
        // subtitle.className = 'card-subtitle mb-2 text-muted';
        const text = document.createElement('p');
        text.className = 'card-text';
        const details = document.createElement('a');
        details.className = 'btn btn-primary';
        details.setAttribute("data-bs-toggle", "modal");
        details.setAttribute("data-bs-target", "#modal-recipe");
        details.onclick = function () { showDetail(object['id']); };

        image.setAttribute("data-bs-toggle", "modal");
        image.setAttribute("data-bs-target", "#modal-recipe");
        image.onclick = function () { showDetail(object['id']); };
        image.src = object['image'];
        card.appendChild(image);

        let name = object['name'];
        name = name.toLowerCase();
        name = name.charAt(0).toUpperCase() + name.slice(1);
        title.appendChild(document.createTextNode(name));
        cardBody.appendChild(title);

        // subtitle.appendChild(document.createTextNode(object['area']));
        // cardBody.appendChild(subtitle);

        text.appendChild(document.createTextNode(object['category']));
        cardBody.appendChild(text);

        details.appendChild(document.createTextNode("Ver detalles"));
        cardBody.appendChild(details);
       
        card.appendChild(cardBody);
        container.appendChild(card);

        results.appendChild(container);
    });
    return results;
}

function showDetail(id) {
    MyMeal.getMealById(id).then(data => {
        showModal(data[0]);
    })
}

async function showModal(receipt) {

    const modalContainer = document.getElementById('modal-recipe');

    let modalWrap = null;

    modalWrap = document.createElement('div');
    modalWrap.className = "modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl";
    modalWrap.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${receipt.strMeal}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h6>Ingredients</h6>
                            <p id="ingredients-list" class="ingredients-list"></p>
                        <hr>
                        <h6>Instructions</h6>
                        <p>
                            ${receipt.strInstructions}
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>`;

    while (modalContainer.firstChild) {
        modalContainer.removeChild(modalContainer.firstChild);
    }
    modalContainer.appendChild(modalWrap);

    const ingredientList = document.getElementById('ingredients-list');
    ingredientList.appendChild(await getIngredients(receipt));
}

async function getIngredients(data) {
    const list = document.createElement('ul');    
    for (let field of Object.keys(data)) {
        if (field.indexOf('strIngredient') >= 0 && !!data[field]) {
            const itemList = document.createElement('li');
            const itemImg = document.createElement('img');
            itemImg.style.width= "25px";
            itemImg.style.height = "25px";
            let ingredientUrl = await MyMeal.getIngredientThumbnail(data[field]);
            console.log('URL', ingredientUrl)
            itemImg.src = ingredientUrl;
            const text = document.createTextNode(data[field]);
            itemList.appendChild(itemImg); itemList.appendChild(text);
            list.appendChild(itemList);
        }
    }

    return list;
}

export{ searchRecipe }