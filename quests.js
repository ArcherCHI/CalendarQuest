// Updates the progress by a given amount on the given array of quests
function updateQuestProgress(quests, type, amount) {
    quests.forEach(q => {
        if (q.taskType === type && !q.completed) {
            q.progress += amount; // Add amount of progress to quest
            if (q.progress >= q.goal) {
                q.progress = q.goal; // Prevent visual overflow
                q.completed = true;
                console.log("Quest Completed: " + q.description);
                addXP(q.reward); // Reward the player
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
        reward: 25, // in XP
        progress: 0,
        goal: 1,
        completed: false
    },
    {
        id: 2,
        description: "Add 1 event to the calendar.",
        taskType: "add event", // the type of task needed to be completed
        reward: 25, // in XP
        progress: 0,
        goal: 1,
        completed: false
    },
    {
        id: 3,
        description: "Add a location and time to an event on the calendar.",
        taskType: "add time+location", // the type of task needed to be completed
        reward: 25, // in XP
        progress: 0,
        goal: 1,
        completed: false
    }
];

// Load the daily quests into their html counterparts
function loadQuests() {
    // Get daily quest elements and store as a list
    const dailyElements = document.querySelectorAll('#daily-quests li');

    const dailies = getDailyQuests();
    for (let i = 0; i < dailyElements.length; i++) {
        dailyElements[i].innerHTML = `
            <div class="quest-description">${dailies[i].description}</div>
            <div class="quest-reward">+${dailies[i].reward} XP</div>
            <div class="quest-progress">${dailies[i].progress} / ${dailies[i].goal}</div>`;
    }

    // Get weekly quest elements and store as a list
    const weeklyElements = document.querySelectorAll('#weekly-quests li');

    const weeklies = getWeeklyQuests();
    for (let i = 0; i < weeklyElements.length; i++) {
        weeklyElements[i].innerHTML = `
            <div class="quest-description">${weeklies[i].description}</div>
            <div class="quest-reward">+${weeklies[i].reward} XP</div>
            <div class="quest-progress">${weeklies[i].progress} / ${weeklies[i].goal}</div>`;
    }

    // Get monthly quest elements and store as a list
    const monthlyElements = document.querySelectorAll('#monthly-quests li');

    const monthlies = getMonthlyQuests();
    for (let i = 0; i < monthlyElements.length; i++) {
        monthlyElements[i].innerHTML = `
            <div class="quest-description">${monthlies[i].description}</div>
            <div class="quest-reward">+${monthlies[i].reward} XP</div>
            <div class="quest-progress">${monthlies[i].progress} / ${monthlies[i].goal}</div>`;
    }
}

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
        id: 4,
        description: "Inspect 5 events on the calendar.",
        taskType: "inspect event", // the type of task needed to be completed
        reward: 50, // in XP
        progress: 0,
        goal: 5,
        completed: false
    },
    {
        id: 5,
        description: "Add 5 events to the calendar.",
        taskType: "add event", // the type of task needed to be completed
        reward: 50, // in XP
        progress: 0,
        goal: 5,
        completed: false
    },
    {
        id: 6,
        description: "Add a location and time to 3 events on the calendar.",
        taskType: "add time+location", // the type of task needed to be completed
        reward: 50, // in XP
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
        id: 7,
        description: "Inspect 25 events on the calendar.",
        taskType: "inspect event", // the type of task needed to be completed
        reward: 100, // in XP
        progress: 0,
        goal: 25,
        completed: false
    },
    {
        id: 8,
        description: "Add 10 events to the calendar.",
        taskType: "add event", // the type of task needed to be completed
        reward: 100, // in XP
        progress: 0,
        goal: 10,
        completed: false
    },
    {
        id: 9,
        description: "Add a location and time to 12 events on the calendar.",
        taskType: "add time+location", // the type of task needed to be completed
        reward: 100, // in XP
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

// Daily quest button
const dailyQuestsButtonOpen = document.getElementById("daily-quests-button-open");
const dailyQuestsButtonClose = document.getElementById("daily-quests-button-close");
const dailyQuests_ = document.getElementById("daily-quests");

dailyQuestsButtonOpen.addEventListener("click", function () {
    weeklyQuests_.style.display = "none";
    weeklyQuestsButtonClose.style.display = "none";
    weeklyQuestsButtonOpen.style.display = "inline";

    monthlyQuests_.style.display = "none";
    monthlyQuestsButtonClose.style.display = "none";
    monthlyQuestsButtonOpen.style.display = "inline";

    dailyQuests_.style.display = "flex";
    dailyQuestsButtonClose.style.display = "inline";
    dailyQuestsButtonOpen.style.display = "none";
    console.log("Daily Quests Opened");
});
dailyQuestsButtonClose.addEventListener("click", function () {
    dailyQuests_.style.display = "none";
    dailyQuestsButtonClose.style.display = "none";
    dailyQuestsButtonOpen.style.display = "inline";
    console.log("Daily Quests Closed");
})



// Weekly quest button
const weeklyQuestsButtonOpen = document.getElementById("weekly-quests-button-open");
const weeklyQuestsButtonClose = document.getElementById("weekly-quests-button-close");
const weeklyQuests_ = document.getElementById("weekly-quests");

weeklyQuestsButtonOpen.addEventListener("click", function () {
    dailyQuests_.style.display = "none";
    dailyQuestsButtonClose.style.display = "none";
    dailyQuestsButtonOpen.style.display = "inline";

    monthlyQuests_.style.display = "none";
    monthlyQuestsButtonClose.style.display = "none";
    monthlyQuestsButtonOpen.style.display = "inline";

    weeklyQuests_.style.display = "flex";
    weeklyQuestsButtonClose.style.display = "inline";
    weeklyQuestsButtonOpen.style.display = "none";
    console.log("Weekly Quests Opened");
});
weeklyQuestsButtonClose.addEventListener("click", function () {
    weeklyQuests_.style.display = "none";
    weeklyQuestsButtonClose.style.display = "none";
    weeklyQuestsButtonOpen.style.display = "inline";
    console.log("Weekly Quests Closed");
})



// Monthly quest button
const monthlyQuestsButtonOpen = document.getElementById("monthly-quests-button-open");
const monthlyQuestsButtonClose = document.getElementById("monthly-quests-button-close");
const monthlyQuests_ = document.getElementById("monthly-quests");

monthlyQuestsButtonOpen.addEventListener("click", function () {
    dailyQuests_.style.display = "none";
    dailyQuestsButtonClose.style.display = "none";
    dailyQuestsButtonOpen.style.display = "inline";

    weeklyQuests_.style.display = "none";
    weeklyQuestsButtonClose.style.display = "none";
    weeklyQuestsButtonOpen.style.display = "inline";

    monthlyQuests_.style.display = "flex";
    monthlyQuestsButtonClose.style.display = "inline";
    monthlyQuestsButtonOpen.style.display = "none";
    console.log("Monthly Quests Opened");
});
monthlyQuestsButtonClose.addEventListener("click", function () {
    monthlyQuests_.style.display = "none";
    monthlyQuestsButtonClose.style.display = "none";
    monthlyQuestsButtonOpen.style.display = "inline";
    console.log("Monthly Quests Closed");
})
