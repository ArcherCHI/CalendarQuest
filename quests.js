// Updates the progress by a given amount on the given array of quests
function updateQuestProgress(quests, type, amount) {
    quests.forEach(q => {
        if (q.taskType === type && !q.completed) {
            q.progress += amount; // Add amount of progress to quest
            if (q.progress >= q.goal) {
                q.progress = q.goal; // Prevent visual overflow
                q.completed = true;
                console.log("Quest Completed: " + q.description);

                // Progress quests completed
                updateAllQuestProgress("complete quest", 1);
                
                // Reward the player
                addXP(q.reward[0]); 
                addCoins(q.reward[1]);
            }
        }
    });
}

// Updates all quests for progress of a given type by a given amount
function updateAllQuestProgress(type, amount) {
    console.log("Updating all quests of type: " + type);

    const daily = getDailyQuests();
    if (daily) {
        updateQuestProgress(daily, type, amount);
        localStorage.setItem("daily_quests", JSON.stringify(daily)); // Update local storage
    }

    const weekly = getWeeklyQuests();
    if (weekly) {
        updateQuestProgress(weekly, type, amount);
        localStorage.setItem("weekly_quests", JSON.stringify(weekly)); // Update local storage
    }

    const monthly = getMonthlyQuests();
    if (monthly) {
        updateQuestProgress(monthly, type, amount);
        localStorage.setItem("monthly_quests", JSON.stringify(monthly)); // Update local storage
    }

    const achievements = getAchievements();
    if (achievements) {
        updateQuestProgress(achievements, type, amount);
        localStorage.setItem("achievements", JSON.stringify(achievements)); // Update local storage
    }
}

// Load the daily quests into their html counterparts
function loadQuests() {
    // Get daily quest elements and store as a list
    const dailyElements = document.querySelectorAll('#daily-quests li');

    const dailies = getDailyQuests();
    for (let i = 0; i < dailyElements.length; i++) {
        dailyElements[i].innerHTML = `
            <div class="quest-description">${dailies[i].description}</div>
            <div class="quest-reward">+${dailies[i].reward[0]} XP and ${dailies[i].reward[1]} 💰</div>
            <div class="quest-progress">${dailies[i].progress} / ${dailies[i].goal}</div>`;
    }

    // Get weekly quest elements and store as a list
    const weeklyElements = document.querySelectorAll('#weekly-quests li');

    const weeklies = getWeeklyQuests();
    for (let i = 0; i < weeklyElements.length; i++) {
        weeklyElements[i].innerHTML = `
            <div class="quest-description">${weeklies[i].description}</div>
            <div class="quest-reward">+${weeklies[i].reward[0]} XP and ${weeklies[i].reward[1]} 💰</div>
            <div class="quest-progress">${weeklies[i].progress} / ${weeklies[i].goal}</div>`;
    }

    // Get monthly quest elements and store as a list
    const monthlyElements = document.querySelectorAll('#monthly-quests li');

    const monthlies = getMonthlyQuests();
    for (let i = 0; i < monthlyElements.length; i++) {
        monthlyElements[i].innerHTML = `
            <div class="quest-description">${monthlies[i].description}</div>
            <div class="quest-reward">+${monthlies[i].reward[0]} XP and ${monthlies[i].reward[1]} 💰</div>
            <div class="quest-progress">${monthlies[i].progress} / ${monthlies[i].goal}</div>`;
    }
}



/*
    Daily Quests
        Do not use the quest array below, they are to house the struture for the quests
        Use the get function instead to get the local storage versions of the quests
*/

// An array of daily quests, each day three will be choosen at random
const dailyQuests = [
    {
        id: 1,
        description: "Inspect 1 event on the calendar.",
        taskType: "inspect event", // the type of task needed to be completed
        reward: [25, 5], // in XP and Coins
        progress: 0,
        goal: 1,
        completed: false
    },
    {
        id: 2,
        description: "Add 1 event to the calendar.",
        taskType: "add event", // the type of task needed to be completed
        reward: [25, 5], // in XP and Coins
        progress: 0,
        goal: 1,
        completed: false
    },
    {
        id: 3,
        description: "Add a location and time to an event on the calendar.",
        taskType: "add time+location", // the type of task needed to be completed
        reward: [25, 5], // in XP and Coins
        progress: 0,
        goal: 1,
        completed: false
    }
];

function resetDailyQuests() {
    // Make deep copies of the quests
    let quests = [
        structuredClone(dailyQuests[0]),
        structuredClone(dailyQuests[1]),
        structuredClone(dailyQuests[2])
    ];

    // Save the quest objects to local storage
    localStorage.setItem("daily_quests", JSON.stringify(quests));
}

// Retrieves the daily quests from local storage
function getDailyQuests() {
    let quests = JSON.parse(localStorage.getItem("daily_quests"));

    // Check if quests were retrieved properly, reset if not
    if (!quests) {
        console.log("No daily quests found, resetting...");
        resetDailyQuests();
        quests = JSON.parse(localStorage.getItem("daily_quests"));
    }
    
    return quests;
}



/*
    Weekly Quests
        Do not use the quest array below, they are to house the struture for the quests
        Use the get function instead to get the local storage versions of the quests
*/

// An array of weekly quests, each week three will be choosen at random
const weeklyQuests = [
    {
        id: 1,
        description: "Inspect 5 events on the calendar.",
        taskType: "inspect event", // the type of task needed to be completed
        reward: [50, 10], // in XP and Coins
        progress: 0,
        goal: 5,
        completed: false
    },
    {
        id: 2,
        description: "Add 5 events to the calendar.",
        taskType: "add event", // the type of task needed to be completed
        reward: [50, 10], // in XP and Coins
        progress: 0,
        goal: 5,
        completed: false
    },
    {
        id: 3,
        description: "Add a location and time to 3 events on the calendar.",
        taskType: "add time+location", // the type of task needed to be completed
        reward: [50, 10], // in XP and Coins
        progress: 0,
        goal: 3,
        completed: false
    }
];

function resetWeeklyQuests() {
    // Make deep copies of the quests
    let quests = [
        structuredClone(weeklyQuests[0]),
        structuredClone(weeklyQuests[1]),
        structuredClone(weeklyQuests[2])
    ];

    // Save the quest objects to local storage
    localStorage.setItem("weekly_quests", JSON.stringify(quests));
}

// Retrieves the weekly quests from local storage
function getWeeklyQuests() {
    let quests = JSON.parse(localStorage.getItem("weekly_quests"));

    // Check if quests were retrieved properly, reset if not
    if (!quests) {
        console.log("No weekly quests found, resetting...");
        resetWeeklyQuests();
        quests = JSON.parse(localStorage.getItem("weekly_quests"));
    }
    
    return quests;
}



/*
    Monthly Quests
        Do not use the quest array below, they are to house the struture for the quests
        Use the get function instead to get the local storage versions of the quests
*/

// An array of monthly quests, each month three will be choosen at random
const monthlyQuests = [
    {
        id: 1,
        description: "Inspect 25 events on the calendar.",
        taskType: "inspect event", // the type of task needed to be completed
        reward: [100, 15], // in XP and Coins
        progress: 0,
        goal: 25,
        completed: false
    },
    {
        id: 2,
        description: "Add 10 events to the calendar.",
        taskType: "add event", // the type of task needed to be completed
        reward: [100, 15], // in XP and Coins
        progress: 0,
        goal: 10,
        completed: false
    },
    {
        id: 3,
        description: "Add a location and time to 12 events on the calendar.",
        taskType: "add time+location", // the type of task needed to be completed
        reward: [100, 15], // in XP and Coins
        progress: 0,
        goal: 12,
        completed: false
    }
];

function resetMonthlyQuests() {
    // Make deep copies of the quests
    let quests = [
        structuredClone(monthlyQuests[0]),
        structuredClone(monthlyQuests[1]),
        structuredClone(monthlyQuests[2])
    ];

    // Save the quest objects to local storage
    localStorage.setItem("monthly_quests", JSON.stringify(quests));
}

// Retrieves the monthly quests from local storage
function getMonthlyQuests() {
    let quests = JSON.parse(localStorage.getItem("monthly_quests"));

    // Check if quests were retrieved properly, reset if not
    if (!quests) {
        console.log("No monthly quests found, resetting...");
        resetMonthlyQuests();
        quests = JSON.parse(localStorage.getItem("monthly_quests"));
    }

    return quests;
}

dailyReset();

// If the player hasn't logged in today then display login message
function dailyReset() {
  const today = new Date();
  const lastLogin = new Date(localStorage.getItem("lastLoginDate") || 0);

  // Check whether to reset daily quests and display daily login message
  if (today.toDateString() !== lastLogin.toDateString()) {
    // Reset the daily quests
    resetDailyQuests();
    
    // Make daily login message visiable
    const modal = document.getElementById("myModal");
    modal.style.display = "flex";
    console.log("Displaying login message")
  } else {
    console.log("Current day has not changed")
  }

  // Check whether to reset weekly quests
  if (getWeekNumber(today) !== getWeekNumber(lastLogin)) {
    resetWeeklyQuests();  
  } else {
    console.log("Current week has not changed")
  }

  // Check whether to reset monthly quests
  if (today.getMonth() !== lastLogin.getMonth()) {
    resetMonthlyQuests();
  } else {
    console.log("Current month has not changed")
  }

  loadQuests(); // Load the quests onto the quest page

  // Update last login
  localStorage.setItem("lastLoginDate", today.toDateString());
}

// Helper to calculate week number
// Source: https://www.geeksforgeeks.org/javascript/calculate-current-week-number-in-javascript/
// Returns the week number of the given date (1–53)
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const daysSinceYearStart = Math.floor((date - firstDayOfYear) / (1000 * 60 * 60 * 24));
  return Math.ceil((daysSinceYearStart + firstDayOfYear.getDay() + 1) / 7);
}

/* 
    Achievements 
*/
const achievement_list = [
    {
        id: 1,
        description: "Quest Conqueror",
        taskType: "complete quest", // the type of task needed to be completed
        reward: [0, 250], // in Coins only
        progress: 0,
        goal: 10,
        completed: false
    },
    {
        id: 2,
        description: "Busy Bee",
        taskType: "add event", // the type of task needed to be completed
        reward: [0, 250], // in Coins only
        progress: 0,
        goal: 30,
        completed: false
    },
    {
        id: 3,
        description: "For The EXperience",
        taskType: "earn XP", // the type of task needed to be completed
        reward: [0, 250], // in Coins only
        progress: 0,
        goal: 1000,
        completed: false
    },
];

// Reset achievements
function resetAchievments() {
    // Make deep copies of the achievements
    let achievements = [
        structuredClone(achievement_list[0]),
        structuredClone(achievement_list[1]),
        structuredClone(achievement_list[2])
    ];

    // Save the quest objects to local storage
    localStorage.setItem("achievements", JSON.stringify(achievements));
}

// Retrieves the achievements from local storage
function getAchievements() {
    let achievements = JSON.parse(localStorage.getItem("achievements"));

    // Check if achievements were retrieved properly, reset if not
    if (!achievements) {
        console.log("No achievements, resetting...");
        resetAchievments();
        achievements = JSON.parse(localStorage.getItem("achievements"));
    }
    
    return achievements;
}

document.addEventListener("DOMContentLoaded", loadAchievements);

// Loads achievements into its html counterparts
function loadAchievements() {
    // Get achievement elements and store as a list
    const achievementElements = document.querySelectorAll('#achievement-list li');

    const achievement = getAchievements();
    for (let i = 0; i < achievementElements.length; i++) {
        const percent = (achievement[i].progress / achievement[i].goal) * 100;

        let buttonText = "In progress...";
        if (achievement[i].completed) {
            buttonText = "Claim!";
        }

        achievementElements[i].innerHTML = `
            <div class="achievement-description">${achievement[i].description}</div>
            <div class="achievement-reward">+${achievement[i].reward[1]} 💰</div>
            <div class="achievement-progress">${achievement[i].progress} / ${achievement[i].goal}</div>
            <div class = "achievement-bar">
                <div class = "progress-bar" style="width: ${percent}%;"></div>
            </div>
            <button class="achievement-button" ${achievement[i].completed ? "" : "disabled"}>${buttonText}</button>`;
    }
}