window.addEventListener("load", ()=>{
    const scoreSpace = document.getElementById("uListRanksColumn");
    //Create a new item in the list to display a message to prompt the user to log in 
    if(localStorage.length == 0){
        const logInErrorMessage = document.createElement('li');
        logInErrorMessage.innerText = "There is no users registered yet";
        scoreSpace.appendChild(logInErrorMessage);
    } else{
        displayRanks(scoreSpace);
    }
})
function displayRanks(scoreSpace){
    const savePlayersHighest = []
    const firstPosition = document.getElementById("firstPositionText")
    const secondPosition = document.getElementById("secondPositionText")
    const thirdPosition = document.getElementById("thirdPositionText")
    for(let i = 0; i < localStorage.length; i++){
        //Saves highest score of each player in local storage
        const localStorageArr = JSON.parse(localStorage[localStorage.key(i)])
        localStorageArr.highestScore = bringHighestScore(localStorageArr)
        localStorage[localStorage.key(i)] = JSON.stringify(localStorageArr);
        //Creates a 2D array, that will include the username of the player and the highest score
        savePlayersHighest[i] = [localStorageArr.username, localStorageArr.highestScore]
    }
    savePlayersHighest.sort(function (a,b){return b[1] - a[1]})
    if(savePlayersHighest.length > 0){
        firstPosition.innerText = savePlayersHighest[0][0];
    }
    if(savePlayersHighest.length > 1){
        secondPosition.innerText = savePlayersHighest[1][0];
    }
    if(savePlayersHighest.length > 2){
        thirdPosition.innerText = savePlayersHighest[2][0]; 
    }
    //Print each user in the rank box with their highest score
    for(let i = 0; i < savePlayersHighest.length; i++){
        const newUserRankToAdd = document.createElement('li');
        newUserRankToAdd.innerText = "Position #" + (i+1) +" >> "+ savePlayersHighest[i][0] + " [" + savePlayersHighest[i][1] + "]";
        scoreSpace.appendChild(newUserRankToAdd);
    }
}
//Sorts all the scores of the user and returns the highest one or 0 if no scores available
function bringHighestScore(localStorageArr){
    const arrayToSort =[];
    if(localStorageArr.gamesScoresArray.length == 0){
        return 0
    }
    for(let i = 0; i < localStorageArr.gamesScoresArray.length; i++){
            arrayToSort[i] = localStorageArr.gamesScoresArray[i];
    }
    console.log(arrayToSort)
    arrayToSort.sort(function(a, b){return b - a});
    return arrayToSort[0]
}