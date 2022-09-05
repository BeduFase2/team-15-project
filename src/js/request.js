// Make a request to the api searching by name
export async function searchMealByName(value) {
    return await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
    .then(function (response) {
        return response.json();
    }).then(function (data) {
        return data.meals || [];
    })
}

// Make a request to the api seaching by id
export async function getMealById(id) {
    return await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.meals || [];
        })
}

export async function getRandomMeal() {
    return await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.meals || [];
        })
}

export async function getIngredientThumbnail(ingredient) {
    return `https://www.themealdb.com/images/ingredients/${ingredient}-Small.png`;
    // return await fetch(`https://www.themealdb.com/images/ingredients/${ingredient}-Small.png`)
    //     .then((response) =>{
    //         response.blob().then((data) => {
    //             const imageObjectURL = URL.createObjectURL(data);
    //             return imageObjectURL;
    //         })
    //     })
    //     .catch(err => console.log(err))
}