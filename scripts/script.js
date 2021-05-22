function toggleSidenav() {
    sidenavDiv = document.getElementsByClassName("sidenav")[0];
    mainContent = document.getElementsByClassName("main-content")[0];

    sidenavDiv.classList.toggle("open")
    mainContent.classList.toggle("open")
}

function logout() {
    sessionStorage.clear();
    window.location.pathname = "/";
}

window.onload = (function () {
    userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
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
                    console.log(selectedDate === new Date(year, month, date).toDateString())
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
function setData() {

}
function toggleBackdrop() {
    backdrop = document.getElementById("backdrop");
    if (backdrop.classList.contains("open"))
        backdrop.classList.toggle("open");
}

function editTask(prevTaskName, newTask, prevDate, newDate) {
    newDate = new Date(newDate).toDateString();
    console.log(prevTaskName, newTask, prevDate, newDate);

    if (prevTaskName === "") {
        // create new task in the given date
    } else if (prevTaskName !== newTask && prevDate !== newDate) {
        // delete task and add new Task in new Date
        console.log(prevTaskName === newTask && prevDate === newDate);
    } else if (prevTaskName !== newTask && prevDate === newDate) {
        // just edit task 
    } else if (prevTaskName === newTask && prevDate !== newDate) {
        // edit only date i.e delete from here, add to another Date
    }
    toggleBackdrop()
}

function deleteTask(task, date) {
    console.log(task, date);
    userCreds = JSON.parse(sessionStorage.getItem("userDetails"));
    username = atob(userCreds.username);
    // localStorage.setItem("taskData", JSON.stringify(dat.data))
    AllTaskData = JSON.parse(localStorage.getItem("allTaskData"));
    AllTaskData.forEach((userData, index) => {
        if (atob(userData.username) === username) {
            // update here 
            console.log(userData)
            userAllTaskData = userData.taskData
            currentTaskData = [];
            userAllTaskData.forEach(item => {
                if (item.date === date) {
                    item.tasks.splice(item.tasks.indexOf(task), 1)
                }
            });
        }
    })
    console.log(AllTaskData)
    localStorage.setItem("allTaskData", JSON.stringify(AllTaskData));

    toggleBackdrop();
    // for (let index = 0; index < AllTaskData.length; index++) {
    //     if (atob(AllTaskData[index].username) === username) {
    //         // update here 
    //         userAllTaskData = AllTaskData[index].taskData
    //         currentTaskData = [];
    //         userAllTaskData.forEach(item => {
    //             if (item.date === date) {
    //                 item.tasks.splice(item.tasks.indexOf(task), 1)
    //             }
    //         });
    //         // currentTaskData.tasks.splice(currentTaskData.tasks.indexOf(task), 1)
    //         console.log(userAllTaskData)
    //         break;
    //     }
    // }
    renderData();
}

function renderEditTask(task = "", date = new Date().toDateString()) {
    console.log(task, date)
    toggleBackdrop()
    backdropContentContainer = document.getElementsByClassName("backdrop-content-container")[0];
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
        <button class="delete" onClick="deleteTask('${task}', '${date}')" ${task === "" ? "disabled" : ""}>Delete Task</button>
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
            contentContainer.innerHTML = `Monthly board`
            break;
        default:
            break;
    }
}