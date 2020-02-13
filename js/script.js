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
    recipeApp.getRecipes("Breakfast");
     recipeApp.chooseMealType();
     recipeApp.searchRecipes();
}

//this function handles the user clicking the meal type buttons at the top of page (breakfast/lunch/dinner)
recipeApp.chooseMealType = function () {
    this.$btn.on('click', function () {
        console.log($(this))
        if ($(this).is('.breakfast')) {
            recipeApp.getRecipes(`Breakfast`);
        }
        if ($(this).is('.lunch')) {
            recipeApp.getRecipes(`Lunch`);
        }
        if ($(this).is('.dinner')) {
            recipeApp.getRecipes(`Dinner`);
        }
        if ($(this).is('.snacks')) {
            recipeApp.getRecipes(`Dinner`);
        }
    })
}

//this function will get recipes from EDAMAM using their api and filter results based on query
recipeApp.getRecipes = function (query) {
    let searchItem = query;
    let endPoint = `${recipeApp.url}q=${searchItem}&app_id=${recipeApp.appID}&app_key=${recipeApp.apiKey}`;
    $.ajax(endPoint).then(function (recipes) {//recieves recipes from the query
        recipeApp.showRecipes(recipes);
        recipeApp.updateFeatured(recipes);
        console.log("getRecipes");
        console.log(recipes);
    })
}
recipeApp.searchRecipes = function() {
        $('form').on('submit', function (e) {
        e.preventDefault(); //stop pagerefresh
        const selection = $('input').val();
                console.log(selection);
                recipeApp.getRecipes(selection);
        })
}


//this function will dynamically insert recipes into the html
recipeApp.showRecipes = function (recipes) {
    $('.recipes-container').empty(); //first empty any cards that were inserted
    console.log(recipes);
    // console.log(recipes.hits[0].recipe.image);

    // recipes are actually stored in the array recipe hits
    recipes.hits.forEach(function (recipeObj) { //for each recipe in the response JSON recipes
        const htmlToAppend = `
        <div class="recipe-card">
            <div class="card-image-container">
                <a href="#" class="card-overlay">
                    <img class="card-image" src="${recipeObj.recipe.image}" alt="${recipeObj.recipe.image}">
                    <h3 class="card-overlay-title">${recipeObj.recipe.label}</h3>
                </a>
            </div>
        </div>
        `;
        $(".recipes-container").append(htmlToAppend);
    })
}

//this function updates the featured content on header 
recipeApp.updateFeatured = function (recipes) {
    $('featured-title').empty();
    $('featured-image').empty();
    $('featured-ingredients').empty();
    $('instructions-container').empty();
    
    const selectedRecipe = recipes.hits[0].recipe;
    console.log('updating: ')

    let source = `${selectedRecipe.image}`;
    console.log("selectedRecipe is")
    console.log(selectedRecipe)

    let recipeTitle = `${selectedRecipe.label}`;
    let ingredients = recipeApp.concatArray(selectedRecipe.ingredientLines);

    $('.featured-image img').attr("src", source);
    $('.featured-image img').attr("alt", recipeTitle);

    $('.featured-title').text(`${recipeTitle}`);
    $('.featured-ingredients p').text(ingredients);
    $('.instructions-container p').text(ingredients);
}

//this function takes an array and concatenates the elements inside to return a single string 
recipeApp.concatArray = function (array) {
    let string =  "";
    let arr = array;
    arr.forEach(function (element) {
        string += ` ${element}`;
    })
    return string;
}

$(document).ready(function () {
    recipeApp.init();
});