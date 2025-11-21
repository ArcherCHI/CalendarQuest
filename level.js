/* 
    Leveling System
*/
let amountToLevelUp = 50;
let amountToAddToEachLevelUp = 25;

let level = 0;
const levelElement = document.getElementById("level"); // the level number element itself

let xp = 0;
const xpBar = document.getElementById("xpBar"); // the XP bar element itself

let coins = 0;
const coinsBalance = document.getElementById("coinsBalance");

let dailyStreak = 0;
// const streakNumber = document.getElementById("");

// Load in level and XP from local storage
if (typeof(Storage) !== "undefined") {
  // Set level to 0 if there is none in local storage
  if (localStorage.getItem("level") === null) {
    localStorage.setItem("level", "0");
    console.log("No level found, intialized level to 0")
  } else {
    console.log("Current level found")
  }

  // Set XP to 0 if there is none in local storage
  if (localStorage.getItem("xp") === null) {
    localStorage.setItem("xp", "0");
    console.log("No XP found, intialized XP to 0")
  } else {
    console.log("Current XP found")
  }

  // Set coins to 0 if there is none in local storage
  if (localStorage.getItem("coins") === null) {
    localStorage.setItem("coins", "0");
    console.log("No coins found, intialized coins to 0")
  } else {
    console.log("Current coins found")
  }

  // Retrieve and set level
  level = parseInt(localStorage.getItem("level")) || 0;
  amountToLevelUp = (level + 1) * amountToAddToEachLevelUp; // Set next amount of XP to level up
  levelElement.innerHTML = "Level: " + level;
  console.log("Set level to " + level)

  // Retrieve and set XP
  xp = parseInt(localStorage.getItem("xp")) || 0;
  updateXPBar();
  console.log("Set XP to " + xp + " out of " + amountToLevelUp +" needed")

  // Retrieve and set coin balance
  coins = parseInt(localStorage.getItem("coins")) || 0;
  updateCoinBalance();
  console.log("Set coin balance to " + coins);
} else {
  levelElement.innerHTML = "Web storage not supported";
}

// Add XP to the player's level
function addXP(xpAmount) {
    xp += xpAmount; // Add xp 

    // Check for level up
    if (xp >= amountToLevelUp) {
        // Level up
        level++;
        localStorage.setItem("level", level); // Update the level in the local storage
        document.getElementById("level").innerHTML = "Level: " + level;

        amountToLevelUp = (level + 1) * amountToAddToEachLevelUp;  // Update the amount needed for next level up

        let overflowXP = xp - amountToLevelUp; // Check for overflow

        xp = 0; // Reset XP
        localStorage.setItem("xp", 0); // Update the XP in the local storage

        // Update XP bar (should reset to 0%)
        updateXPBar();
        displayLevelUpWindow();

        // If there’s leftover XP, apply it after level-up
        if (overflowXP > 0) {
          addXP(overflowXP);
        }
    } else {
      // Update the XP bar
      localStorage.setItem("xp", xp);
      updateXPBar();
    }

    console.log("+" + xpAmount + " XP");
}

// Add coins to the user's balance
function addCoins(amount) {
  coins += amount;
  localStorage.setItem("coins", coins);
  console.log("+" + amount + " Coin(s)");
}

// Remove coins from the user's balance
function removeCoins(amount) {
  if (coins - amount < 0) {
    console.log("Insufficient balance");
    return false;
  } else {
    coins -= amount;
    localStorage.setItem("coins", coins);
    console.log("-" + amount + " Coin(s)");
    return true;
  }
}

function updateCoinBalance() {
  if (!coinsBalance) return; // Check if element exists on the page

  coinsBalance.textContent = "Coins 💰: " + coins;
}

// Updates the XP bar's visuals
function updateXPBar() {
  const percent = (xp / amountToLevelUp) * 100; // Get the percent to update the XP bar
  const xpBar = document.getElementById("xpBar");

  // Update the width
  xpBar.style.width = percent + "%";
  xpBar.textContent = Math.floor(percent) + "%";
}

// Sets the level to the number that is passed as a parameter
function setLevel(newLevel) {
  // Check for valid number (is a number and not negative)
  newLevel = parseInt(newLevel);
  if (isNaN(newLevel) || newLevel < 0) {
    console.log("Invalid level value, level was not reset");
    return;
  }

  // Update global variables
  level = newLevel;
  xp = 0;
  coins = 0;
  amountToLevelUp = (level + 1) * amountToAddToEachLevelUp;

  // Save to localStorage
  localStorage.setItem("level", level);
  localStorage.setItem("xp", xp);
  localStorage.setItem("coins", coins);

  // Update UI
  levelElement.textContent = level;
  updateXPBar();

  console.log("Level manually set to " + level + " and was XP reset to 0");
}

// Displays the level up window when the user levels up
function displayLevelUpWindow() {
  document.getElementById("levelUpWindow").style.visibility = "visible";
  console.log("Level Up Window Opened");
  document.getElementById("reachedLevel").textContent = "Reached Level " + level;
}

// Confirm Button for Level Up Window
// Closes Level Up Window when clicked
const confirmLevelUpButton = document.getElementById("level-up-button");
confirmLevelUpButton.addEventListener("click", function () {
    document.getElementById("levelUpWindow").style.visibility = "hidden";
    console.log("Level Up Window Closed");
});

// Quest Completed Pop-Up
// Appears when a quest is completed

// Claim Button for Quest Completed Window
const claimQuestRewardButton = document.getElementById("quest-completed-button");
claimQuestRewardButton.addEventListener("click", function () {
  document.getElementById("questCompletedWindow").style.visibility = "hidden";
  console.log("Quest Completed Window Closed");
});