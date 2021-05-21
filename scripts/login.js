function login(username, password) {
    var form = document.getElementById("login-form");

    var login = credentials.find(element => element.username === username && element.password === password);
    if (login === undefined) {
        if (!document.getElementById("alert")) {
            form.innerHTML += `
                    <div id="alert" class='alert'>
                    <div>
                    <span>
                                <i class="fa fa-exclamation-circle" ></i>
                            </span>
                            <span>
                            Username or password is incorrect. Please try again!
                            </span>
                            </div>
                            <button class="close-alert" onclick="closeAlert()">
                            <span>
                                <i class="fa fa-times"></i>
                                </span>
                                </button>
                                </div>
                                `
        }
    } else {
        var userDetails = {
            username: btoa(username),
            password: btoa(password)
        };
        sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
        form.action = "home.html";
    }
}

function closeAlert() {
    var alert = document.getElementById("alert");
    alert.remove();
}