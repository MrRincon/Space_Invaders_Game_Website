/*Add an event listener to check if the user is logged in 
to display the scores of previous games*/
window.addEventListener("load", ()=>{
    const scoreSpace = document.getElementById("uListGamesAndPointsColumn");
    console.log(scoreSpace);
    //Create a new item in the list to display a message to prompt the user to log in 
    if(!sessionStorage.getItem("userLoggedIn")){
        const logInErrorMessage = document.createElement('li');
        logInErrorMessage.innerText = "Please log in to see your scores";
        scoreSpace.appendChild(logInErrorMessage);
    } else{
        displayScores();
    }
})
/*Once user has logged in, the list displayed will contain the games scores*/
function displayScores(){
    const arr=JSON.parse(localStorage[sessionStorage.userLoggedIn]);
    const scoreSpace = document.getElementById("uListGamesAndPointsColumn");
    for(let i = 0; i < arr.gamesScoresArray.length; i++){
        const newScoreToAdd = document.createElement('li');
        newScoreToAdd.innerText = "Game #" + (i+1) +" || "+ arr.gamesScoresArray[i] + " Points";
        scoreSpace.appendChild(newScoreToAdd);
    }
}