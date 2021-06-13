const BASE_URL = "https://todoist-be.herokuapp.com/"
// const BASE_URL = "http://localhost:5000/"

function toggleSidenav() {
    sidenavDiv = document.getElementsByClassName("sidenav")[0];
    mainContent = document.getElementsByClassName("main-content")[0];

    sidenavDiv.classList.toggle("open")
    mainContent.classList.toggle("open")
}

function logout() {
    sessionStorage.clear();
    window.location.pathname = "/todoist-FE";
}

window.onload = (function () {
    userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    container = document.getElementById("profile-container");
    container.innerHTML += `
    <span class="username-span">Welcome ${userDetails.username}!</span>
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
async function getData(date) {
    userCreds = JSON.parse(sessionStorage.getItem("userDetails"));

    let AllTaskData = [];
    res = await fetch(BASE_URL + "getData?username=" + userCreds.username, {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (response.status === 204) {
            AllTaskData = [];
            return AllTaskData;
        }
        else {
            return response.json().then(data => {
                if (data.status === 200) {
                    AllTaskData = data.data
                    taskData = AllTaskData.taskData.filter((item) => item.date === date)?.[0];
                    return (taskData?.tasks)
                } else if (data.status === 204) {
                    AllTaskData = []
                    return AllTaskData;
                }
            });
        }
    })
    // .then(data => {
    //     console.log(data)
    //     if (data.status === 200) {
    //         AllTaskData = data.data
    //         taskData = AllTaskData.taskData.filter((item) => item.date === date)?.[0];
    //         return (taskData?.tasks)
    //     } else if (data.status === 204) {
    //         AllTaskData = []
    //         return AllTaskData;
    //     }
    // })
    return res;
}
function toggleBackdrop() {
    backdrop = document.getElementById("backdrop");
    if (!backdrop.classList.contains("open"))
        backdrop.classList.add("open");
    else
        backdrop.classList.remove("open");

}

async function editTask(prevTaskName, newTask, prevDate, newDate) {
    loader = document.getElementById("loader");
    loader.style.display = "flex"
    newDate = new Date(newDate).toDateString();
    userCreds = JSON.parse(sessionStorage.getItem("userDetails"));
    allTaskData = JSON.parse(localStorage.getItem("allTaskData"));
    putData = JSON.stringify({
        username: userCreds.username,
        currentTask: prevTaskName,
        currentDate: prevDate,
        newTask: newTask,
        newDate: newDate
    })

    await fetch(BASE_URL + "editTask", {
        method: "PUT",
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: putData
    }).then(resp => resp.json()).then(response => {
        if (response.status === 200) {
            if (backdrop.classList.contains("open"))
                toggleBackdrop();
            loader.style.display = "none"
            renderData();
        }
    }).catch(err => {
        console.error(err)
    })
}

async function deleteTask(task, date) {
    userCreds = JSON.parse(sessionStorage.getItem("userDetails"));
    putData = JSON.stringify({
        username: userCreds.username,
        date: date,
        task: task
    })

    await fetch(BASE_URL + "deleteTask", {
        method: "PUT",
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: putData
    }).then(resp => resp.json()).then(response => {
        if (response.status === 200) {
            if (backdrop.classList.contains("open"))
                toggleBackdrop();
            renderData();
        }
    }).catch(err => {
        console.error(err)
    })
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
async function renderData() {
    loader = document.getElementById("loader");
    contentContainer = document.getElementById("display-content");
    switch (view) {
        case "daily":
            loader.style.display = "flex"
            taskData = await getData(selectedDate);
            loader.style.display = "none"
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
            loader.style.display = "flex"
            for (index = 0; index < 7; index++) {
                if (week.children[index] !== undefined) {
                    weekDate = new Date(currentSelectedDate.getFullYear(), currentSelectedDate.getMonth(), Number(week.children[index]?.innerText));
                    dates.push(weekDate.toDateString());
                    tasks = await getData(weekDate.toDateString());
                    datesTaskData.push(tasks);
                } else {
                    weekDate = new Date(currentSelectedDate.getFullYear(), currentSelectedDate.getMonth() + 1, newDateCount);
                    dates.push(weekDate.toDateString());
                    tasks = await getData(weekDate.toDateString());
                    datesTaskData.push(tasks);
                    newDateCount++;
                }
            }
            loader.style.display = "none"
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
            loader.style.display = "flex"
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
                        taskData = await getData(thisDate)
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
            loader.style.display = "none"
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