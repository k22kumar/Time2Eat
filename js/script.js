const recipeApp = {

    // DELETE ME!! EDAMAM INFO: 5 CALLS/MIN DISHTYPE/CUISINE FILTER == NO 
    // UP TO 100 RESULTS PER CALL
    // EDAMAM API variables
    appID: "e7cbe948",
    apiKey: "374fb0045e4134f0c63ea76e82994ac8",
    url: "https://api.edamam.com/search?",

    $btn: $('button') //Jquery shorthand for  button
};

//recipeApp methods
recipeApp.init = function () {
    recipeApp.getMealTime(); //on start up, check the time and show appropiate meals
    recipeApp.chooseMealType(); //listens to quick select mealtype buttons (breakfast, lunch etc)
    recipeApp.searchRecipes(); //listens to user recipe search requests
}

//this function handles the user clicking the meal type buttons at the top of page (breakfast/lunch/dinner)
recipeApp.chooseMealType = function () {
    this.$btn.on('click', function () {
        if ($(this).is('.breakfast')) {
            recipeApp.getRecipes('breakfast');
            recipeApp.updateBackground('#FFE57E');
        }
        if ($(this).is('.lunch')) {
            recipeApp.getRecipes('lunch');
            recipeApp.updateBackground('#b5e7a0');
        }
        if ($(this).is('.dinner')) {
            recipeApp.getRecipes('dinner');
            recipeApp.updateBackground('#858A9F');
        }
        if ($(this).is('.snacks')) {
            recipeApp.getRecipes('snacks');
            recipeApp.updateBackground('#e06377');
        }
    })
}

//this function will get recipes from EDAMAM using their api and filter results based on query
recipeApp.getRecipes = function (query) {
    let searchItem = query;
    let endPoint = `${recipeApp.url}q=${searchItem}&app_id=${recipeApp.appID}&app_key=${recipeApp.apiKey}&from=0&to=100`;
    $.ajax(endPoint).then(function (recipes) {//recieves recipes from the query
        recipeApp.showRecipes(recipes);
        recipeApp.updateFeatured(recipes);
    })
}
recipeApp.searchRecipes = function () {
    $('form').on('submit', function (e) {
        e.preventDefault(); //stop pagerefresh
        recipeApp.updateBackground('#EBDEF0');
        const selection = $('input').val();
        recipeApp.getRecipes(selection);
    })
}


//this function will dynamically insert recipes into the html
recipeApp.showRecipes = function (recipes) {
    $('.recipes-container').empty(); //first empty any cards that were inserted

    // recipes are actually stored in the array recipe hits
    recipes.hits.forEach(function (recipeObj) { //for each recipe in the response JSON recipes
        const htmlToAppend = `
        <div class="recipe-card">
            <div class="card-image-container">
                <a href="${recipeObj.recipe.url}" class="card-overlay">
                    <img class="card-image" src="${recipeObj.recipe.image}" alt="${recipeObj.recipe.image}">
                    <h3 class="card-overlay-title">${recipeObj.recipe.label}</h3>
                </a>
            </div>
        </div>
        `;
        $(".recipes-container").append(htmlToAppend);
    })
}

//this function updates the featured content on header with a random recipe from the search results
recipeApp.updateFeatured = function (recipes) {
    //empty any existing info in the featured container such as image and ingredients
    $('featured-title').empty();
    $('featured-image').empty();
    $('featured-ingredients').empty();
    $('instructions-container').empty();

    const rng = Math.floor(Math.random() * (recipes.hits.length - 1)); // generate random number
    const selectedRecipe = recipes.hits[rng].recipe; //choose a random recipe

    const source = `${selectedRecipe.image}`;
    const recipeTitle = `${selectedRecipe.label}`;
    const ingredients = recipeApp.concatArray(selectedRecipe.ingredientLines);
    //update the details
    $('.featured-image img').attr("src", source);
    $('.featured-image img').attr("alt", recipeTitle);
    $('.featured-title').text(`${recipeTitle}`);
    $('.featured-ingredients p').text(ingredients);
    $('.instructions-container p').text(ingredients);
}


//this function takes an array and concatenates the elements inside to return a single string 
recipeApp.concatArray = function (array) {
    let string = "";
    let arr = array;
    arr.forEach(function (element) {
        string += ` ${element}`;
    })
    return string;
}

//this function changes the color of the background color depending on what is searched
recipeApp.updateBackground = function (bgc) {
    let color = bgc;
    $('.featured-background').css('background-color', color);
    $('.recipes-container').css('background-color', color);
}

//this function gets the current time of day and updates the site on startup to appropiate meal time (breakfast, lunch or dinner)
recipeApp.getMealTime = function () {
    const currentTime = new Date().getHours(); //gets the current time in hours (24 hour clock)
    if(currentTime >= 1 && currentTime < 11) { //between hours of 1am and 11am show breakfast options
        recipeApp.getRecipes('breakfast');
        recipeApp.updateBackground('#FFE57E');
    } else if (currentTime >= 11 && currentTime < 17) { //between hours of 11am and 5pm show lunch options
        recipeApp.getRecipes('lunch');
            recipeApp.updateBackground('#b5e7a0'); 
    } else { //anytime after 5pm show dinner options
        recipeApp.getRecipes('dinner');
        recipeApp.updateBackground('#858A9F');
    }
}

$(document).ready(function () {
    recipeApp.init();
});