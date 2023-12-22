//Getting user data
function logIn(){
    const username = document.getElementById("logInUsername").value;
    const password = document.getElementById("logInPassword").value;
    //Get feedback
    const feedback = document.getElementById("feedbackLogIn");
    feedback.innerHTML = "";
    //Check for user existence
    if(localStorage[username] !== undefined){
        const userObj = JSON.parse(localStorage[username]);
        console.log(userObj);
        //Check password
        if(userObj.password === password){
            //Checks that user is not logged in
            console.log(JSON.parse(localStorage[username]).username);
            console.log(sessionStorage.userLoggedIn);
            if (JSON.parse(localStorage[username]).username !== sessionStorage.userLoggedIn){
                feedback.innerHTML = "Successful login";
                sessionStorage.userLoggedIn = username;
            } else {
                feedback.innerHTML = "User is logged in already";
                return;
            }
        } else{
            feedback.innerHTML = "Incorrect password, try again.";
            return;
        }
    } else{
        feedback.innerHTML = "Enter a valid user";
        return;
    }
}
function logOut(){
    const username = document.getElementById("logInUsername").value;
    const password = document.getElementById("logInPassword").value;
    //Get feedback
    const feedback = document.getElementById("feedbackLogIn");
    feedback.innerHTML = "";
    if(localStorage[username] !== undefined){
        const userObj = JSON.parse(localStorage[username]);
        console.log(userObj);
        //Check password
        if(userObj.password === password){
            //Checks that user is not logged in
            console.log(JSON.parse(localStorage[username]).username);
            console.log(sessionStorage.userLoggedIn);
            if (JSON.parse(localStorage[username]).username == sessionStorage.userLoggedIn){
                feedback.innerHTML = "You have logged out";
                sessionStorage.removeItem('userLoggedIn');
            } else {
                feedback.innerHTML = "There is no user to log out";
            }
        } else{
            feedback.innerHTML = "Enter the right password to log out";
        }
    } else{
        feedback.innerHTML = "Enter the right user to log out";
    }
}
//Adding user data
function register(){
    const userName = document.getElementById("registerUsername").value;
    const firstName = document.getElementById("registerName").value;
    const surname = document.getElementById("registerSurname").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;
    const userObj = {
        username: userName,
        userFirstName: firstName,
        userSurname: surname,
        email: email,
        password: password,
        highestScore: 0,
        gamesScoresArray: []
    }
    //Get feedback
    const feedback = document.getElementById("feedbackRegister");
    feedback.innerHTML = "";
    //Validation
    //Check input fields if they are empty
    if(userName === ""){
        feedback.innerHTML = "Username not entered";
        return;
    } 
    if(firstName === ""){
        feedback.innerHTML = "First name not entered";
        return;
    } 
    if(surname === ""){
        feedback.innerHTML = "Surname not entered";
        return;
    } 
    if(email === ""){
        feedback.innerHTML = "Email not entered";
        return;
    } 
    if(password === ""){
        feedback.innerHTML = "Password not entered";
        return;
    }
    if(confirmPassword === ""){
        feedback.innerHTML = "Confirm your password";
        return; 
    }
    //Checks for a valid email address
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
        feedback.innerHTML = "Invalid email address"
        return;
    }
    //Checks for a valid password
    if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password))){
        feedback.innerHTML = "Password must include 8 to 15 characters,\none lowercase letter, one uppercase letter\none numeric digit and one special character";
        return;
    }
    // Compares the password and the confirmation
    if(!(confirmPassword === password)){
        feedback.innerHTML = "Passwords do not match";
        return;
    }
    //Checks that there is no user with the same username
    if(localStorage.getItem(userName) !== null){
        feedback.innerHTML = "Username already registered";
        return;
    }
    //Store in local storage
    feedback.innerHTML = "Succesfull registration"
    console.log(userObj);
    localStorage[userName] = JSON.stringify(userObj);
}
