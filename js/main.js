"use strict";

const rowData = document.getElementById("rowData");
const searchContainer = document.getElementById("searchContainer");
let submitBtn;

$(document).ready(() => {
  searchByName("").then(() => {
    $(".load").fadeOut(500);
    $("body").css("overflow", "visible");
  });
});

const openSideNav = () => {
  $(".sideNav").animate({ left: 0 }, 500);
  $(".xIcon").removeClass("fa-arrow-right").addClass("fa-arrow-left");
  $(".links li").each((i, el) => {
    $(el).animate({ top: 0 }, (i + 5) * 100);
  });
};

const closeSideNav = () => {
  const boxWidth = $(".sideNav .navTab").outerWidth();
  $(".sideNav").animate({ left: -boxWidth }, 500);
  $(".xIcon").removeClass("fa-arrow-left").addClass("fa-arrow-right");
  $(".links li").animate({ top: 300 }, 500);
};

closeSideNav();

$(".sideNav i.xIcon").click(() => {
  $(".sideNav").css("left") == "0px" ? closeSideNav() : openSideNav();
});

$("#logo").click(() => {
  window.location.href = "index.html";
});

const displayMeals = (arr) => {
  rowData.innerHTML = arr
    .map(
      (meal) => `
        <div class="col-md-3">
          <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 pointer">
            <img class="w-100" src="${meal.strMealThumb}" alt="">
            <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
              <h3>${meal.strMeal}</h3>
            </div>
          </div>
        </div>`
    )
    .join("");
};

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const getCategories = async () => {
  rowData.innerHTML = "";
  $(".innerLoad").fadeIn(300);
  searchContainer.innerHTML = "";
  const data = await fetchData(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  displayCategories(data.categories);
  $(".innerLoad").fadeOut(300);
};

const displayCategories = (arr) => {
  rowData.innerHTML = arr
    .map(
      (category) => `
        <div class="col-md-3">
          <div onclick="getCategoryMeals('${
            category.strCategory
          }')" class="meal position-relative overflow-hidden rounded-2 pointer">
            <img class="w-100" src="${category.strCategoryThumb}" alt="">
            <div class="meal-layer position-absolute text-center text-black p-2">
              <h3>${category.strCategory}</h3>
              <p>${category.strCategoryDescription
                .split(" ")
                .slice(0, 20)
                .join(" ")}</p>
            </div>
          </div>
        </div>`
    )
    .join("");
};

const getArea = async () => {
  rowData.innerHTML = "";
  $(".innerLoad").fadeIn(300);
  searchContainer.innerHTML = "";
  const data = await fetchData(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  displayArea(data.meals);
  $(".innerLoad").fadeOut(300);
};

const displayArea = (arr) => {
  rowData.innerHTML = arr
    .map(
      (area) => `
        <div class="col-md-3">
          <div onclick="getAreaMeals('${area.strArea}')" class="rounded-2 text-center pointer">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3>${area.strArea}</h3>
          </div>
        </div>`
    )
    .join("");
};

const getIngredients = async () => {
  rowData.innerHTML = "";
  $(".innerLoad").fadeIn(300);
  searchContainer.innerHTML = "";
  const data = await fetchData(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  displayIngredients(data.meals.slice(0, 20));
  $(".innerLoad").fadeOut(300);
};

const displayIngredients = (arr) => {
  rowData.innerHTML = arr
    .map(
      (ingredient) => `
        <div class="col-md-3">
          <div onclick="getIngredientsMeals('${
            ingredient.strIngredient
          }')" class="rounded-2 text-center pointer">
            <i class="fa-solid fa-seedling fa-4x"></i>
            <h3>${ingredient.strIngredient}</h3>
            <p>${ingredient.strDescription
              .split(" ")
              .slice(0, 20)
              .join(" ")}</p>
          </div>
        </div>`
    )
    .join("");
};

const getCategoryMeals = async (category) => {
  rowData.innerHTML = "";
  $(".innerLoad").fadeIn(300);
  const data = await fetchData(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  displayMeals(data.meals.slice(0, 20));
  $(".innerLoad").fadeOut(300);
};

const getAreaMeals = async (area) => {
  rowData.innerHTML = "";
  $(".innerLoad").fadeIn(300);
  const data = await fetchData(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  displayMeals(data.meals.slice(0, 20));
  $(".innerLoad").fadeOut(300);
};

const getIngredientsMeals = async (ingredients) => {
  rowData.innerHTML = "";
  $(".innerLoad").fadeIn(300);
  const data = await fetchData(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  displayMeals(data.meals.slice(0, 20));
  $(".innerLoad").fadeOut(300);
};

const getMealDetails = async (mealID) => {
  closeSideNav();
  rowData.innerHTML = "";
  $(".innerLoad").fadeIn(300);
  searchContainer.innerHTML = "";
  const data = await fetchData(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  displayMealDetails(data.meals[0]);
  $(".innerLoad").fadeOut(300);
};

const displayMealDetails = (meal) => {
  searchContainer.innerHTML = "";
  const ingredients = Array.from({ length: 20 }, (_, i) => ({
    ingredient: meal[`strIngredient${i + 1}`],
    measure: meal[`strMeasure${i + 1}`],
  }))
    .filter((item) => item.ingredient)
    .map(
      (item) =>
        `<li class="alert alert-info m-2 p-1">${item.measure} ${item.ingredient}</li>`
    )
    .join("");

  const tagsStr = (meal.strTags?.split(",") || [])
    .map((tag) => `<li class="alert alert-danger m-2 p-1">${tag}</li>`)
    .join("");

  rowData.innerHTML = `
    <div class="col-md-4">
      <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
      <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
      <h2>Instructions</h2>
      <p>${meal.strInstructions}</p>
      <h3><span class="fw-bolder">Area: </span>${meal.strArea}</h3>
      <h3><span class="fw-bolder">Category: </span>${meal.strCategory}</h3>
      <h3>Recipes:</h3>
      <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${ingredients}
      </ul>
      <h3>Tags:</h3>
      <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${tagsStr}
      </ul>
      <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
      <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">YouTube</a>
    </div>`;
};

const showSearchInputs = () => {
  searchContainer.innerHTML = `
    <div class="row py-4">
      <div class="col-md-6">
        <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
        <input onkeyup="searchByFirstLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
    </div>`;
  rowData.innerHTML = "";
};

const searchByName = async (term) => {
  rowData.innerHTML = "";
  $(".innerLoad").fadeIn(300);
  const data = await fetchData(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  displayMeals(data.meals || []);
  $(".innerLoad").fadeOut(300);
};

const searchByFirstLetter = async (term) => {
  rowData.innerHTML = "";
  $(".innerLoad").fadeIn(300);
  term = term || "a";
  const data = await fetchData(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  displayMeals(data.meals || []);
  $(".innerLoad").fadeOut(300);
};

const showContacts = () => {
  rowData.innerHTML = `
    <section id="contact" class="container w-75 mx-auto mb-5 text-center">
      <div class="p-2">
        <h2 class="text-light mb-5">Contact Us...</h2>
        <div class="row g-4">
          <div class="col-md-6">
            <div class="form-floating">
              <input onkeyup="inputsValidation()" class="form-control" id="name" type="text" placeholder="Name">
              <label for="name">Name</label>
              <div class="invalid-feedback">Enter a valid Name</div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input onkeyup="inputsValidation()" class="form-control" id="email" type="email" placeholder="Email Address">
              <label for="email">Email Address</label>
              <div class="invalid-feedback">Enter a valid Email</div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input onkeyup="inputsValidation()" class="form-control" id="phone" type="tel" placeholder="Phone">
              <label for="phone">Phone</label>
              <div class="invalid-feedback">Enter a valid Phone</div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input onkeyup="inputsValidation()" class="form-control" id="age" type="number" placeholder="Age">
              <label for="age">Age</label>
              <div class="invalid-feedback">Enter a valid Age</div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input onkeyup="inputsValidation()" class="form-control" id="password" type="password" placeholder="Password">
              <label for="password">Password</label>
              <div class="invalid-feedback">Enter 8 characters that concludes a capital letter and a number </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input onkeyup="inputsValidation()" class="form-control" id="rePassword" type="password" placeholder="Repassword">
              <label for="rePassword">Repassword</label>
              <div class="invalid-feedback">Passwords do not match</div>
            </div>
          </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger mt-3">Submit</button>
      </div>
    </section>`;
  submitBtn = document.getElementById("submitBtn");
};

const inputsValidation = () => {
  const validations = [
    nameValidation(),
    emailValidation(),
    phoneValidation(),
    ageValidation(),
    passwordValidation(),
    rePasswordValidation(),
  ];
  submitBtn.disabled = !validations.every(Boolean);
};

const validateInput = (input, regex) => {
  const isValid = regex.test(input.value);
  input.classList.toggle("is-invalid", !isValid);
  input.classList.toggle("is-valid", isValid);
  return isValid;
};

const nameValidation = () =>
  validateInput(document.getElementById("name"), /^[a-zA-Z ]{2,30}$/);
const emailValidation = () =>
  validateInput(document.getElementById("email"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const phoneValidation = () =>
  validateInput(document.getElementById("phone"), /^(002)?01[0125][0-9]{8}$/);
const ageValidation = () =>
  validateInput(document.getElementById("age"), /^[1-9][0-9]?$|^100$/);
const passwordValidation = () =>
  validateInput(
    document.getElementById("password"),
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  );
const rePasswordValidation = () => {
  const password = document.getElementById("password").value;
  const rePassword = document.getElementById("rePassword").value;
  const isValid = password === rePassword;
  document
    .getElementById("rePassword")
    .classList.toggle("is-invalid", !isValid);
  document.getElementById("rePassword").classList.toggle("is-valid", isValid);
  return isValid;
};
