import * as MyMeal from './request'

function searchRecipe(textToSearch) {
    
    const container = document.getElementById("results-container");
    container.innerHTML = '';
    
    if (!textToSearch.length) {
        alert('Debe ingresar un termino de búsqueda.', 'danger')
    } else if (textToSearch.length === 1) {
        MyMeal.seachMealByName(textToSearch).then(function (data) {
            if (!data.length) {
                alert('No se encontró información.', 'danger')
            } else {
                container.appendChild(getCard(getItemObject(data)));
                container.scrollIntoView();
            }
        });
    } else {
        MyMeal.seachMealByName(textToSearch).then(function (data) {
            if (!data.length) {
                alert('No se encontró información.', 'danger')
            } else {
                container.appendChild(getCard(getItemObject(data)));
                container.scrollIntoView();
            }
        });
    }
}

function alert(message, type) {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    alertPlaceholder.append(wrapper)
}

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

function getCard(data) {
    const results = document.createElement('div');
    results.className = 'row';

    data.forEach(async object => {
        const container = document.createElement("div");
        container.className = 'col-lg-3 col-md-4 col-sm-6 col-xs-12 p-2';
        const card = document.createElement('div');
        card.className = "card w-100"
        const cardBody = document.createElement('div');
        cardBody.className = "card-body";
        const image = document.createElement('img');
        image.className = 'card-img-top';
        const title = document.createElement('h5');
        title.className = 'card-title';
        const subtitle = document.createElement('h6');
        subtitle.className = 'card-subtitle mb-2 text-muted';
        const text = document.createElement('p');
        text.className = 'card-text';

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

        subtitle.appendChild(document.createTextNode(object['area']));
        cardBody.appendChild(subtitle);

        text.appendChild(document.createTextNode(object['category']));
        cardBody.appendChild(text);

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