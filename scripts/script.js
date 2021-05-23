function toggleSidenav() {
    sidenavDiv = document.getElementsByClassName("sidenav")[0];
    mainContent = document.getElementsByClassName("main-content")[0];

    sidenavDiv.classList.toggle("open")
    mainContent.classList.toggle("open")
}

function logout() {
    sessionStorage.clear();
    window.location.pathname = "/todoist";
}

window.onload = (function () {
    userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    allTaskData = JSON.parse(localStorage.getItem("allTaskData"));

    if (allTaskData === null) {
        allTaskData = [];
        blankData = { username: userDetails.username, taskData: [] }
        allTaskData.push(blankData);
        localStorage.setItem("allTaskData", JSON.stringify(allTaskData))
    }

    container = document.getElementById("profile-container");
    container.innerHTML += `
    <span class="username-span">Welcome ${atob(userDetails.username)}!</span>
    <span class="logout-span" onclick="logout()">Logout</span>
    `
})
var view = "daily";

today = new Date();
selectedDate = today.toDateString();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);

function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function jump(today = false) {
    if (today) {
        currentYear = this.today.getFullYear();
        currentMonth = this.today.getMonth();
        selectedDate = this.today.toDateString();
        showCalendar(currentMonth, currentYear);
    } else {
        currentYear = parseInt(selectYear.value);
        currentMonth = parseInt(selectMonth.value);
        showCalendar(currentMonth, currentYear);
    }
}

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();

    tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");
        row.setAttribute("id", `row-${i}`)

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }
            else {
                cell = document.createElement("td");
                cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("today");
                } // color today's date
                if (selectedDate === new Date(year, month, date).toDateString())
                    cell.classList.add("selected")
                else
                    selectedDate = selectedDate
                cell.classList.add("date");
                cell.setAttribute("id", date)
                cell.onclick = function (event) {
                    var selected = document.getElementsByClassName("selected");
                    for (var index = 0; index < selected.length; index++) {
                        selected[index].classList.remove("selected")
                    }
                    event.target.classList.add("selected");
                    let date = Number(event.target.innerText);
                    selectedDate = new Date(year, month, date).toDateString();
                    renderData();
                }
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row); // appending each row into calendar body.
    }
    renderData();
}


// check how many days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}
function setView(event, value) {
    var rootElem = document.getElementsByClassName("list-div open");
    var elements = document.getElementsByClassName("selector open");
    for (var i = 0; i < rootElem.length; i++) {
        rootElem.item(i).classList.remove("open")
    }
    for (var i = 0; i < elements.length; i++) {
        elements.item(i).classList.remove("open")
    }
    //setting the selector
    event.currentTarget.classList.add("open")
    event.currentTarget.children[0].classList.add("open")
    this.view = value
    renderData();
}
function getWeekNumber(date) {
    var d = new Date(date);
    var date = d.getDate();
    var day = d.getDay();
    var weekOfMonth = Math.abs(Math.ceil((date - 1 - day) / 7));
    return weekOfMonth;
}
function getData(date) {
    userCreds = JSON.parse(sessionStorage.getItem("userDetails"));


    // var todaysDate = new Date().toDateString();

    // asd = [
    //     {
    //         username: userCreds.username,
    //         taskData: [{ date: todaysDate, tasks: ["Clean house", "buy eggs"] }]
    //     }
    // ]
    // localStorage.setItem("allTaskData", JSON.stringify(asd))


    AllTaskData = JSON.parse(localStorage.getItem("allTaskData"));
    var currentUserAllTaskData = {}
    for (let i = 0; i < AllTaskData.length; i++) {
        if (atob(AllTaskData[i].username) === atob(userCreds.username)) {
            currentUserAllTaskData = AllTaskData[i].taskData;
            break;
        }
    }
    taskData = currentUserAllTaskData.filter((item) => item.date === date)?.[0];
    return (taskData?.tasks)
}
function toggleBackdrop() {
    backdrop = document.getElementById("backdrop");
    if (!backdrop.classList.contains("open"))
        backdrop.classList.add("open");
    else
        backdrop.classList.remove("open");

}

function editTask(prevTaskName, newTask, prevDate, newDate) {
    newDate = new Date(newDate).toDateString();
    userCreds = JSON.parse(sessionStorage.getItem("userDetails"));
    allTaskData = JSON.parse(localStorage.getItem("allTaskData"));

    allTaskData.forEach((userData) => {
        if (atob(userData.username) === atob(userCreds.username)) {
            if (prevTaskName !== "") {
                //     deleteTask(prevTaskName, prevDate);
                //     userAllTaskData = userData.taskData
                // currentTaskData = [];
                userData.taskData.forEach(item => {
                    if (item.date === prevDate) {
                        item.tasks.splice(item.tasks.indexOf(prevTaskName), 1)
                        toggleBackdrop();
                        return;
                    }
                });
            }
            flag = false
            userData.taskData.forEach(taskItem => {
                if (taskItem.date === newDate) {
                    taskItem.tasks.push(newTask);
                    flag = true;
                    toggleBackdrop();
                    return;
                }
            })
            if (!flag) {
                nextTaskData = {
                    date: newDate,
                    tasks: [newTask]
                }
                toggleBackdrop();
                userData.taskData.push(nextTaskData)
                return;
            }
        }
    })
    localStorage.setItem("allTaskData", JSON.stringify(allTaskData))

    toggleBackdrop();
    renderData();
}

function deleteTask(task, date) {
    userCreds = JSON.parse(sessionStorage.getItem("userDetails"));
    username = atob(userCreds.username);
    // localStorage.setItem("taskData", JSON.stringify(dat.data))
    AllTaskData = JSON.parse(localStorage.getItem("allTaskData"));
    AllTaskData.forEach((userData) => {
        if (atob(userData.username) === username) {
            // update here 
            userAllTaskData = userData.taskData
            currentTaskData = [];
            userAllTaskData.forEach(item => {
                if (item.date === date) {
                    item.tasks.splice(item.tasks.indexOf(task), 1)
                }
            });
        }
    })
    localStorage.setItem("allTaskData", JSON.stringify(AllTaskData));
    if (backdrop.classList.contains("open"))
        toggleBackdrop();
    renderData();
}

function renderEditTask(task = "", date = new Date().toDateString()) {
    toggleBackdrop()
    backdropContentContainer = document.getElementById("backdrop-content-container");
    backdropContentContainer.innerHTML = `
    <h3>${task === "" ? "Add New" : "Edit"} Task</h3>
    <div class="inputs-div">
        <textarea id="edit-task-textarea" rows="4" cols="50" required>${task}</textarea>
        <div className="date-container">
            <label>Date: </label>
            <input id="edit-task-date" type="date" min="${new Date().toLocaleDateString('en-CA')}" value="${new Date(date).toLocaleDateString('en-CA')}"/>
        </div>
    </div>
    <div class="btns-div">
        <button class="submit" onClick="editTask('${task}', document.getElementById('edit-task-textarea').value, '${date}', document.getElementById('edit-task-date').value)" >Submit</button>
        <button onclick="toggleBackdrop()">Cancel</button>
        <button class="delete" onClick="event.stopPropagation(); deleteTask('${task}', '${date}')" ${task === "" ? "disabled" : ""}>Delete Task</button>
    </div>
    `
    document.getElementById("edit-task-textarea").focus();

}
function renderData() {
    contentContainer = document.getElementById("display-content");
    switch (view) {
        case "daily":
            taskData = getData(selectedDate);
            taskList = []
            taskData?.forEach(task => {
                taskDiv = `
                <div class="task-div daily" onclick="event.stopPropagation(); renderEditTask('${task}', '${selectedDate}')" >
                    <span class="task-span daily">${task}</span>
                    <span onclick="event.stopPropagation(); deleteTask('${task}', '${selectedDate}')" class="task-delete">
                        <img src="assets/icons/trash-solid.svg" />
                    </span>
                </div>`
                taskList.push(taskDiv);
            });
            contentContainer.innerHTML = `
            <h3>${selectedDate}</h3>
            <div class="task-content daily">
                ${taskList.join("")}
            </div>
            `
            break;
        case "weekly":
            week = document.getElementById(`row-${getWeekNumber(selectedDate)}`);
            // getting dates in the week
            datesTaskData = [];
            dates = [];
            currentSelectedDate = new Date(selectedDate);
            // counter for date from another month
            newDateCount = 1;
            for (index = 0; index < 7; index++) {
                if (week.children[index] !== undefined) {
                    weekDate = new Date(currentSelectedDate.getFullYear(), currentSelectedDate.getMonth(), Number(week.children[index]?.innerText));
                    dates.push(weekDate.toDateString());
                    tasks = getData(weekDate.toDateString());
                    datesTaskData.push(tasks);
                } else {
                    weekDate = new Date(currentSelectedDate.getFullYear(), currentSelectedDate.getMonth() + 1, newDateCount);
                    dates.push(weekDate.toDateString());
                    tasks = getData(weekDate.toDateString());
                    datesTaskData.push(tasks);
                    newDateCount++;
                }
            }
            var weekDivList = []
            dates.forEach((date, index) => {
                var week = '';
                var dayList = []

                datesTaskData[index] !== undefined && datesTaskData[index].forEach(task => {
                    var day = `
                    <div class="task-div weekly" onclick="renderEditTask('${task}', '${selectedDate}' )" >
                        <span class="task-span weekly">${task}</span>
                    </div>`
                    dayList.push(day)
                })

                week = `
                <div class="week-div" id=${index}>
                    <h4 class="week-date-span" id=${date}>${date}</h4>
                    ${dayList.join("")}
                </div>
                `
                weekDivList.push(week)
            })
            contentContainer.innerHTML = `
            <div class="task-content weekly">
                ${weekDivList.join("")}
            </div>
            `
            break;
        case "monthly":

            let month = currentMonth;
            let year = currentYear;
            let firstDay = (new Date(year, month)).getDay();

            tbl = []; // body of the calendar

            // creating all cells
            let date = 1;
            for (let i = 0; i < 6; i++) {
                // creates a table row
                let row = document.createElement("tr");
                row.setAttribute("id", `row-${i}`)

                //creating individual cells, filing them up with data.
                for (let j = 0; j < 7; j++) {
                    thisDate = new Date(year, month, date).toDateString()
                    if (i === 0 && j < firstDay) {
                        cell = document.createElement("td");
                        // cellBody = document.createTextNode("");
                        cell.classList.add("monthly-date-cell")
                        // cell.appendChild(cellBody);
                        row.appendChild(cell);
                    }
                    else if (date > daysInMonth(month, year)) {
                        break;
                    }
                    else {
                        cell = document.createElement("td");
                        cellBody = document.createElement("div");
                        cellBody.classList.add("monthly-date-root")

                        cellBodyDate = document.createElement("span")
                        cellBodyDate.classList.add("monthly-date")

                        cellBodyData = document.createElement("div");
                        cellBodyData.classList.add("task-list")

                        if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                            cellBodyDate.classList.add("today");
                        }
                        cellBodyDate.appendChild(document.createTextNode(date))
                        cellBody.appendChild(cellBodyDate);

                        // make task list
                        taskData = getData(thisDate)
                        taskData !== undefined && taskData.forEach((task) => {
                            let day = document.createElement("div");
                            day.classList.add("task-div");
                            day.classList.add("monthly");
                            taskSpan = document.createElement("span")
                            taskSpan.classList.add("task-span");
                            taskSpan.classList.add("monthly");
                            taskSpan.appendChild(document.createTextNode(task))
                            day.appendChild(taskSpan);
                            day.setAttribute("onclick", `renderEditTask('${task}', '${thisDate}')`)
                            cellBodyData.appendChild(day);
                        })
                        cell.classList.add("monthly-date-cell");
                        cell.setAttribute("id", date)


                        cellBody.appendChild(cellBodyData);

                        cell.appendChild(cellBody);
                        row.appendChild(cell);
                        date++;
                    }
                }
                tbl.push(row.outerHTML); // appending each row into calendar body.
            }
            contentContainer.innerHTML = `
            <table class="monthly-task-table">
                <thead class="monthly-task-head">
                    <tr>
                        <th class="days">Sun</th>
                        <th class="days">Mon</th>
                        <th class="days">Tue</th>
                        <th class="days">Wed</th>
                        <th class="days">Thu</th>
                        <th class="days">Fri</th>
                        <th class="days">Sat</th>
                    </tr>
                </thead>
                <tbody>
                ${tbl.join("")}
                </tbody>
            </table>
            `
            break;
        default:
            break;
    }
}