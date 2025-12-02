class Item {
  constructor(title, description, example, colors, source, cost, type){
    this.title = title;
    this.description = description;
    this.example = example;
    this.source = source;
    this.cost = cost;
    this.type = type;
    this.colors = colors;
    this.created = false;
  }
}

coins = 9999;

const defaultColors = new Item("Default Colors", "The default colors for the calendar.", null, ["#865DFF", "#E384FF", "#00CAFF", "#FFFFFF"], "Calendar Quest", 0, "colors");

let ownedButtons = [];
let ownedColors = [];
let ownedFonts = [];
let allItems = [];


// Fills allItems[] with all the shop items
// Each shop item is an object declared in the Item class
const shopItems = document.querySelectorAll(".item");
shopItems.forEach(item => {
  const parent = item.parentNode;
  const title = item.querySelector(".item-title").textContent;
  const description = item.querySelector(".item-description").textContent;
  const source = item.querySelector(".item-source").textContent;
  const cost = parent.querySelector(".buy-button").textContent.split(" ")[2];
  const type = parent.parentNode.parentNode.parentNode.id.split("-")[1];

  let newItem = null;
  if ( type === "buttons" ) {
    const example = parent.querySelector(".item-example button").className;
    newItem = new Item(title, description, example, null, source, cost, type);
  } else if ( type === "colors" ){
    let colors = [];
    let ptr = parent.querySelector(".color-palette button");
    for ( let i = 0; i < 4; i++ ){
      colors.push(ptr.style.backgroundColor);
      ptr = ptr.nextSibling.nextSibling;
    }
    newItem = new Item(title, description, null, colors, source, cost, type);
  } else if ( type === "fonts" ) {
    const example = parent.querySelector(".item-example p").style.fontFamily;
    newItem = new Item(title, description, example, null, source, cost, type);
    console.log("Font Item: " + newItem.example);
  } else {
    console.log("Error: Invalid item type");
  }

  allItems.push(newItem);
});



// Returns true if the item is owned, false otherwise
function isOwned(item){
  return ownedButtons.find(ownedItem => ownedItem.title === item.title) ||
    ownedColors.find(ownedItem => ownedItem.title === item.title) ||
    ownedFonts.find(ownedItem => ownedItem.title === item.title);
}

// Updates the shop items to reflect the owned items
function updateShopItems() {
  console.log("Updating Shop Items");

  let buyButtons = document.querySelectorAll(".buy-button");
  buyButtons.forEach(button => {
    let item = allItems.find(it => it.title ===   
      button.parentElement.querySelector(".item-title").textContent);

    // If owned, disable the button, change the text to "Owned", and 
    // change the background color to gray
    if ( isOwned(item) ) {
        button.textContent = "Owned";
        button.disabled = true;
        button.style.backgroundColor = "gray";
    }
  });
}

window.onload = function(){
  loadOwnedItems();
  loadSavedColors();
  updateCoinBalance();
  updateShopItems();
  deleteDuplicates();
  displayOwnedFonts();
  displayOwnedButtons();
  displayOwnedColors();
  applyFont();
  loadSavedFonts();
  // printAllItems();
  // printOwnedItems();
  console.log("=======================================");
  let switches = document.querySelectorAll(".switch");
  switches.forEach(s => {
    s.checked = false;
  });
  // updateShopItems();
  console.log("Shop Loaded");
}

function loadSavedFonts() {
  console.log("Loading saved fonts...");
  const headerFont = localStorage.getItem("headerFont");
  const buttonFont = localStorage.getItem("buttonFont");
  const bodyFont = localStorage.getItem("bodyFont");
  console.log("Header font: " + headerFont);
  console.log("Button font: " + buttonFont);
  console.log("Body font: " + bodyFont);

  if (headerFont) {
    document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(header => {
      header.style.fontFamily = headerFont;
    });
  }
  if (buttonFont) {
    document.querySelectorAll("button").forEach(button => {
      button.style.fontFamily = buttonFont;
    });
  }
  if (bodyFont) {
    document.body.style.fontFamily = bodyFont;
  }
}

function buyItem(button){
  const item = allItems.find(item => item.title === 
    button.parentElement.querySelector(".item-title").textContent);

  if( isOwned(item) ){
    button.textContent = "Owned";
    alert("You already own this item!");

  } else if (coins >= item.cost) {
    coins -= item.cost;
    localStorage.setItem("coins", coins);
    addOwnedItem(item);
    updateCoinBalance();
    updateShopItems();
    loadOwnedItems();
    // printOwnedItems();
    console.log("Bought " + item.title + " for " + item.cost + " coins");
    console.log("Coins: " + coins );

  } else {
    alert("Not enough coins!");
  }
}

function deleteDuplicates() {
  // console.log("Deleting Duplicates");
  ownedButtons = ownedButtons.filter((item, index) => ownedButtons.indexOf(item) === index);
  ownedColors = ownedColors.filter((item, index) => ownedColors.indexOf(item) === index);
  ownedFonts = ownedFonts.filter((item, index) => ownedFonts.indexOf(item) === index);
  localStorage.setItem("ownedButtons", JSON.stringify(ownedButtons));
  localStorage.setItem("ownedColors", JSON.stringify(ownedColors));
  localStorage.setItem("ownedFonts", JSON.stringify(ownedFonts));
}

// Load owned items from local storage
function loadOwnedItems(){
  ownedButtons = JSON.parse(localStorage.getItem("ownedButtons")) || [];
  ownedColors = JSON.parse(localStorage.getItem("ownedColors")) || [];
  ownedFonts = JSON.parse(localStorage.getItem("ownedFonts")) || [];

  // Add default colors if not already owned
  const hasDefaultColors = ownedColors.some(item => item.title === "Default Colors");
  if (!hasDefaultColors) {
    ownedColors.push(defaultColors);
    localStorage.setItem("ownedColors", JSON.stringify(ownedColors));
  }
  displayOwnedFonts();
  displayOwnedButtons();
  displayOwnedColors();
}

// Add an item to the owned items array
function addOwnedItem( Item ){
  console.log("Adding Owned Item: " + Item.title );
  if (Item.type === "buttons"){
    ownedButtons.push(Item);
    localStorage.setItem("ownedButtons", JSON.stringify(ownedButtons));

  } else if (Item.type === "colors"){
    ownedColors.push(Item);
    localStorage.setItem("ownedColors", JSON.stringify(ownedColors));

  } else if (Item.type === "fonts"){
    ownedFonts.push(Item);
    // createOwnedItem(Item);
    localStorage.setItem("ownedFonts", JSON.stringify(ownedFonts));
  }
}

// Adds event listeners to all the buy buttons
// When a buy button is clicked, it checks if the user has enough coins
// If they do, it subtracts the cost of the item from the user's coins
// and adds the item to the user's owned items
const shopButtons = document.getElementById("shop-buttons");
const buttonsToBuy = shopButtons.querySelectorAll(".buy-button");
buttonsToBuy.forEach(button => {
  button.addEventListener("click", function () {
    buyItem(button);
  });
});

const shopColors = document.getElementById("shop-colors");
const colorsToBuy = shopColors.querySelectorAll(".buy-button");
colorsToBuy.forEach(button => {
  button.addEventListener("click", function () {
    buyItem(button);
  });
});

const shopFonts = document.getElementById("shop-fonts");
const fontsToBuy = shopFonts.querySelectorAll(".buy-button");
fontsToBuy.forEach(button => {
  button.addEventListener("click", function () {
    buyItem(button);
  });
});


function applyButtonStyle(buttonClass){
  console.log("Applying Button Style: " + buttonClass);
  document.querySelectorAll("button").forEach(button => {
    if ( button.parentNode.id === buttonClass ){}
    else if ( button.parentNode.classList.contains("item-example") ){}
    else if ( button.parentNode.classList.contains("color-palette") ){}
    else button.classList.add(buttonClass);
  });
}
function removeButtonStyle(buttonClass){
  console.log("Removing Button Style: " + buttonClass);
  document.querySelectorAll("button").forEach(button => {
    if ( button.parentNode.id === buttonClass ) {} 
    else button.classList.remove(buttonClass); 
  });
}
function switchStyle(s) {
  const thisSwitch = s.target;
  let style = thisSwitch.parentElement.querySelector(".item-example button").classList[0];

  console.log("Switch Style: " + style);
  if ( thisSwitch.checked ) {
    console.log("Switch Checked");
    applyButtonStyle(style);
  } else {
    console.log("Switch Unchecked");
    removeButtonStyle(style);
  }

}

function attachSwitchListeners() {
  const applyOwnedButtonSwitch = document.querySelectorAll(".switch");
  applyOwnedButtonSwitch.forEach(s => {
    s.addEventListener("change", switchStyle);
    s.checked = false;
  });
}

const endStmt = 
  "<input class = 'switch' type = 'checkbox' checked = 'false'>" +
  "</li>";

function changePrimaryColor(color){
  console.log("Changing Primary Color to: " + color);
  document.documentElement.style.setProperty("--main-color", color);
  localStorage.setItem("mainColor", color);
}
function changeSecondaryColor(color){
  console.log("Changing Secondary Color to: " + color);
  document.documentElement.style.setProperty("--main-bg-color", color);
  localStorage.setItem("mainBgColor", color);
}
function changePatternColor(color) {
  console.log("Changing Pattern Color to: " + color);
  document.documentElement.style.setProperty("--pattern-color", color);
  localStorage.setItem("patternColor", color);
}

function changeTextColor(color) {
  console.log("Changing Text Color to: " + color);
  document.body.style.color = color;
  document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, div, li, a").forEach(el => {
    el.style.color = color;
  });
  localStorage.setItem("textColor", color);
}

function loadSavedColors() {
  const mainColor = localStorage.getItem("mainColor");
  const mainBgColor = localStorage.getItem("mainBgColor");
  const patternColor = localStorage.getItem("patternColor");
  const textColor = localStorage.getItem("textColor");
  
  if (mainColor) {
    document.documentElement.style.setProperty("--main-color", mainColor);
  }
  if (mainBgColor) {
    document.documentElement.style.setProperty("--main-bg-color", mainBgColor);
  }
  if (patternColor) {
    document.documentElement.style.setProperty("--pattern-color", patternColor);
  }
  if (textColor) {
    document.body.style.color = textColor;
    document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, div, li, a").forEach(el => {
      el.style.color = textColor;
    });
  }
}

// Adds HTML for each owned button to the div with id "owned-buttons"
function displayOwnedButtons(){
  let endstmt = 
    "</div>" +
    "<input class = 'switch' type = 'checkbox' checked = 'false'>" +
    "</li>";

  document.getElementById("owned-buttons").innerHTML = "";
  for (let i = 0; i < ownedButtons.length; i++) {
    document.getElementById("owned-buttons").innerHTML +=
      "<li>" 
        + "<div class = 'item'>" 
          + "<div class = 'item-title'>" 
            + ownedButtons[i].title 
          + "</div>" 
          + "<div class = 'item-description'>" 
            + ownedButtons[i].description 
          + "</div>" 
          + "<div class = 'item-source'>" 
            + ownedButtons[i].source 
          + "</div>" 
        +  "</div>"
        + "<div class = 'item-example' id = '" + ownedButtons[i].example + "'>"
          + "<button class = '" + ownedButtons[i].example + "'>Press me!</button>" 
        + endstmt;
    
    document.getElementById("owned-buttons").style = "margin-bottom: 3%;";
  }
  attachSwitchListeners();
} 

function displayOwnedColors() {
  document.getElementById("owned-colors").innerHTML = "";

  for (let i = 0; i < ownedColors.length; i++) {
    let stringOfColors = "";
    for ( let j = 0; j < 4; j++ ){
      stringOfColors += 
        "<button style = 'background-color: " + ownedColors[i].colors[j] + ";'></button>"
    }
    // console.log(stringOfColors);
    document.getElementById("owned-colors").innerHTML +=
      "<li>" 
        + "<div class = 'item'>" 
          + "<div class = 'item-title'>" 
            + ownedColors[i].title 
          + "</div>" 
          + "<div class = 'item-description'>" 
            + ownedColors[i].description 
          + "</div>" 
          + "<div class = 'item-source'>" 
            + ownedColors[i].source 
          + "</div>" 
        + "</div>"
        + "<div class = 'color-palette'>"
          + stringOfColors 
        + "</div>"
        + "<div class = 'apply-font-buttons' style = 'padding-bottom: 5%;'>"
          + "<button class = 'color-switch'>Set as Primary</button>"
          + "<button class = 'color-switch'>Set as Secondary</button>"
          + "<button class = 'color-switch'>Set as Pattern</button>"
          + "<button class = 'color-switch'>Set as Text</button>"
        + "</div>"
        + "</div>"
      + "</li>";


  }
  
  attachColorPaletteListeners();
  attachColorSwitchListeners();
}

function displayOwnedFonts() {
  const fontsDiv = document.getElementById("owned-fonts");
  fontsDiv.innerHTML = "";
  for (let i = 0; i < ownedFonts.length; i++) {
    const fontFamily = ownedFonts[i].example;
    fontsDiv.innerHTML +=
      "<li>" 
        + "<div class = 'item'>" 
          + "<div class = 'item-title'>" 
            + ownedFonts[i].title 
          + "</div>" 
          + "<div class = 'item-description'>" 
            + ownedFonts[i].description 
          + "</div>" 
          + "<div class = 'item-source'>" 
            + ownedFonts[i].source 
          + "</div>" 
        +  "</div>"
        + "<div class = 'item-example apply-font-buttons' data-font='" + fontFamily + "'>"
          + "<p style = 'font-family: " + fontFamily + ";'>Lorem ipsum dolor sit amet.</p>"
          + "<button class = 'apply-to-headers'>Apply to Headers</button>"
          + "<button class = 'apply-to-body'>Apply to Body</button>"
          + "<button class = 'apply-to-buttons'>Apply to Buttons</button>"
          + "<button class = 'apply-to-all'>Apply to All</button>"
        + "</div>"
      + "</li>";
  }
}

function applyFont(){
  console.log("Applying font event listeners...");
  const applyFont_Headers = document.querySelectorAll(".apply-to-headers");
  console.log("Found " + applyFont_Headers.length + " header buttons");
  applyFont_Headers.forEach(button => {
    button.addEventListener("click", function () {
      const fontFamily = button.parentElement.dataset.font;
      console.log("Apply to Headers: " + fontFamily);
      document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(header =>{
        header.style.fontFamily = fontFamily;
      });
      localStorage.setItem("headerFont", fontFamily);
      console.log("Saved headerFont to localStorage: " + fontFamily);
    });
  });
  const applyFont_Body = document.querySelectorAll(".apply-to-body");
  applyFont_Body.forEach(button => {
    button.addEventListener("click", function () {
      const fontFamily = button.parentElement.dataset.font;
      console.log("Apply to Body: " + fontFamily);
      document.body.style.fontFamily = fontFamily;
      localStorage.setItem("bodyFont", fontFamily);
    });
  });
  const applyFont_Buttons = document.querySelectorAll(".apply-to-buttons");
  applyFont_Buttons.forEach(b => {
    b.addEventListener("click", function () {
      const fontFamily = b.parentElement.dataset.font;
      console.log("Apply to Buttons: " + fontFamily);
      document.querySelectorAll("button").forEach(btn =>{
        btn.style.fontFamily = fontFamily;
      });
      localStorage.setItem("buttonFont", fontFamily);
    });
  });
  const applyFont_All = document.querySelectorAll(".apply-to-all");
  applyFont_All.forEach(button => {
    button.addEventListener("click", function () {
      const fontFamily = button.parentElement.dataset.font;
      console.log("Apply to All: " + fontFamily);
      document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(header =>{
        header.style.fontFamily = fontFamily;
      });
      document.body.style.fontFamily = fontFamily;
      document.querySelectorAll("button").forEach(btn =>{
        btn.style.fontFamily = fontFamily;
      });
      localStorage.setItem("headerFont", fontFamily);
      localStorage.setItem("bodyFont", fontFamily);
      localStorage.setItem("buttonFont", fontFamily);
    });
  });
}

function attachColorSwitchListeners() {
  const colorSwitchingButtons = document.querySelectorAll(".color-switch");
  colorSwitchingButtons.forEach( button => {
    button.addEventListener("click", function () {
      console.log("Color: " + chosenColor);
      if ( button.textContent === "Set as Secondary"){
        changeSecondaryColor(chosenColor);
      } else if ( button.textContent === "Set as Primary" ){
        changePrimaryColor(chosenColor);
      } else if ( button.textContent === "Set as Pattern" ) {
        changePatternColor(chosenColor);
      } else if ( button.textContent === "Set as Text" ) {
        changeTextColor(chosenColor);
      }
    });
  });
}

let chosenColor = null;

function attachColorPaletteListeners() {
  const colorPalettes = document.getElementById("owned-colors").querySelectorAll(".color-palette");
  colorPalettes.forEach(palette => {
    let colors = palette.querySelectorAll("button");
    colors.forEach(color => {
      color.addEventListener("click", function (){
        chosenColor = color.style.backgroundColor;
      });
    });
  });
}
function printAllItems(){
  console.log("=======================================");
  console.log("All Items: ");
  console.log("* Buttons:");
  for ( let i = 0; i < allItems.length; i++ ) {
    if ( allItems[i].type === "buttons" ) 
      console.log("  * " + allItems[i].title);
  }
  console.log("* Colors:");
  for ( let i = 0; i < allItems.length; i++ ) {
    if ( allItems[i].type === "colors" ) 
      console.log("  * " + allItems[i].title);
  }
  console.log("* Fonts:");
  for ( let i = 0; i < allItems.length; i++ ){
    if ( allItems[i].type === "fonts" )
      console.log("  * " + allItems[i].title);
  }
}
function printOwnedItems() {
  console.log("=======================================");
  console.log("Owned Items: ");
  console.log("* Buttons:");
  for ( let i = 0; i < ownedButtons.length; i++ ){
    console.log("  * " + ownedButtons[i].title);
  }
  console.log("* Colors:");
  for ( let i = 0; i < ownedColors.length; i++ ){
    console.log("  * " + ownedColors[i].title);
  }
  console.log("* Fonts:");
  for ( let i = 0; i < ownedFonts.length; i++ ) {
    console.log("  * " + ownedFonts[i].title);
  }
}
// printOwnedItems();

