
/*fetch searchbox in nav bar */
let SearchBox = document.querySelector(".search-box");
/*fetch searchbutton in nav bar */
const SearchButton = document.querySelector(".search-btn");
/* fetch favourite button  in nav bar*/
const FavListButton=document.querySelector('#fav-button');
/* fetch favourite list recipe */
const favList=document.querySelector('.fav-list');
/*fetch recipe container in main */
const recipeContainer = document.querySelector(".recipe-container");

/* fetch recipe-details */
const recipieDetails = document.querySelector('.recipe-details');

/* fetch Image container class */
const ImageContainer = document.querySelector('.image-text-container');;
/*fetch close button*/
const CloseBtn =  document.querySelector('.close-btn') ;

/*fetch recipe details content*/
const recipieContent = document.querySelector('.recipe-details-content');

/* fetch main */
const mainTag=document.getElementsByTagName('main');

/* fetch section */
const section = document.getElementsByTagName('section');
// favourite list array;
const favoritesList=[];

/* create function to fetch Api for recipies */
const fetchRecipies = async (input) => {
  recipeContainer.innerHTML = "<h1>Fetching Recipies...</h1>";
  recipeContainer.style.color = "white";
  try{
  const data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`
    );
  const response = await data.json();
 

  recipeContainer.innerHTML = "";

  // apply forech method for all the recipe
  response.meals.forEach((meal) => {
    /* create a div */
    const recipeDiv = document.createElement("div");
    /* add class inside this div */
    recipeDiv.classList.add("recipe");

    /* write hmtl code inside the div*/
    recipeDiv.innerHTML = `
     <img src="${meal.strMealThumb}" alt="Recipe Image">
     <h3>${meal.strMeal}</h3>
     <p><span>${meal.strArea}</span> Dish</p>
     <p>Belongs to <span>${meal.strCategory}</span> Category</p>
     `;
    /* create button to view recipe */
    const buttonDiv=document.createElement("div");
    const button = document.createElement("button");
    button.classList.add("view-recipe");
    button.textContent = "view Recipe";

    // create button favourite recipe
    const span=document.createElement('span');
    const favButton = document.createElement('button');
    favButton.classList.add('favrecipe');
    favButton.innerHTML=`<i class="fa-regular fa-heart"></i>`

    // append child recipeDiv
    recipeDiv.appendChild(buttonDiv);
    buttonDiv.appendChild(button);
    buttonDiv.appendChild(span);
    span.appendChild(favButton);
    recipeContainer.appendChild(recipeDiv);

    /*add eventListener to view reipe button*/
    button.addEventListener("click", () => {
      openRecipePopup(meal);
    });

    /* favouite button addeventlistener */
    favButton.addEventListener('click', ()=>{
      favButton.style.color="white";
      addToFavorites(meal); 
    });
  });
} catch(error){
  recipeContainer.innerHTML = "<h1>Sorry!!! your enter recipe is not found... plz enter correct meal</h1>";
}
};
/* close button when clicks the view button is close*/
CloseBtn.addEventListener('click',()=>{
  recipieContent.parentElement.style.display="none";
});

/*add eventlistner on searchbutton*/
SearchButton.addEventListener("click", (e) => {
  e.preventDefault();
  const SearchInput = SearchBox.value.trim();
  if(!SearchInput){
    alert("Please enter meal name! inside the search box");
    return;
  }
  fetchRecipies(SearchInput);
});

/* function to fetch ingredients*/
const fetchIngredients =(meal)=>{
  let ingredeintsList="";
  for(let i=1; i<=20; i++){
    const ingredient=meal[`strIngredient${i}`];
    if(ingredient){
      const measure=meal[`strMeasure${i}`];
      ingredeintsList+=`<li>${ingredient} : ${measure}</li>`;
    }
    else{
      break;
    }
  }
  return ingredeintsList;
}

/* openRecipePopup function*/
const openRecipePopup = (meal) => {
  recipieContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredient-list">${fetchIngredients(meal)}</ul>
   <div class="instruction">
    <h3>Instruction:</h3>
    <p>${meal.strInstructions}</p>
   </div>
  `
  recipieContent.parentElement.style.display="block";
}

function addToFavorites(meal) {
  if (!favoritesList.includes(meal)) {
    favoritesList.push(meal);
    alert(`${meal.strMeal} has been added to your favorites.`);
  } else {
    alert(`${meal.strMeal} is already in your favorites.`);
  }
}


FavListButton.addEventListener('click', FavRecipie);

/* display fav recipie and create favrecipie function*/
function FavRecipie(){
  ImageContainer.innerHTML=" ";
  recipeContainer.innerHTML =" ";
  
  if (favoritesList.length === 0) {
    alert("you not added favourite meal");
  } 

  else {
    favoritesList.forEach(meal => {
      const recipeDiv = document.createElement("div");
      
      recipeDiv.classList.add('recipe');

      recipeDiv.innerHTML = `
      <img src="${meal.strMealThumb}" alt="Recipe Image">
      <h3>${meal.strMeal}</h3>
      <p><span>${meal.strArea}</span> Dish</p>
      <p>Belongs to <span>${meal.strCategory}</span> Category</p>
      `;
     
      const buttonDiv=document.createElement("div");
      const button = document.createElement("button");
      button.classList.add("view-recipe");
      button.textContent = "view Recipe";  
      
      recipeDiv.appendChild(buttonDiv);
      buttonDiv.appendChild(button);
      recipeContainer.appendChild(recipeDiv);
      
      button.addEventListener("click", () => {
        openRecipePopup(meal);
      });

      const mealIngredients = document.createElement('ul');
      for (let i = 1; i <= 20; i++) {
          if (meal[`strIngredient${i}`]) {
              const ingredient = document.createElement('li');
              ingredient.innerText = `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`;
              mealIngredients.appendChild(ingredient);
          } else {
              break;
          }
      }
     

      const span=document.createElement('span');
      const removeButton = document.createElement('button');
      removeButton.classList.add('favrecipe');
      removeButton.innerHTML = '<i class="fas fa-trash"></i> ';

      /* append child for span div */
      buttonDiv.appendChild(span);
      span.appendChild(removeButton);
      
      removeButton.addEventListener('click', () => {
          removeFromFavorites(meal);
      });
    });
  }
}


// Define a function to remove meal from fav
function removeFromFavorites(meal) {
  const mealIndex = favoritesList.findIndex(fav => fav.idMeal === meal.idMeal);
  if (mealIndex !== -1) {
    favoritesList.splice(mealIndex, 1);
    FavRecipie();
    alert(`${meal.strMeal} has been removed from your favorites.`);
  }
}
  
