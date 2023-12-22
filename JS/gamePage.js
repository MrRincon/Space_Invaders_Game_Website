//Confirms that the user is logged in for the game to be available
window.addEventListener("load", ()=>{
    const canvas = document.getElementById("gameCanvas");
    const nameBar = document.getElementById("gameVersion");
    const context = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 300;
    if(!sessionStorage.getItem("userLoggedIn")){
        context.font = "20px ROGfont";
        context.textAlign = "center";
        context.fillStyle = "rgba(0,229,20,1)";
        context.fillText("Please log in to play this game", canvas.width/2, canvas.height/2);
    } else{
        nameBar.innerText = sessionStorage.userLoggedIn;
        startScreen(canvas, context);
    }
})
function startScreen(canvas, context){
    context.font = "20px ROGfont";
    context.textAlign = "center";
    context.fillStyle = "rgba(0,229,20,1)";
    context.fillText("Press 's' to start the game", canvas.width/2, canvas.height/2);
    let isGameActive = false;
    //Confirms the start of the game with the user by using a controller
    window.addEventListener("keydown", e=>{
        e.preventDefault();
        if(e.key.toLowerCase() == "s" && !isGameActive){
            context.clearRect(0, 0, canvas.width, canvas.height);
            console.log("Game has started.")
            isGameActive = true;
            //Call the function to initialise the game taking the canvas and context as parameters
            gameInitialise(canvas, context);
        }
    })
}
function gameInitialise(canvas, context){
    const scoreStatus = document.getElementById("currentScore");
    //Create a class to create the spaceship specifications, draw them and update their position
    class Player{
        constructor(){
            this.velocity = {
                x: 0,
                y: 0
            }
            const spaceshipImage = new Image();
            spaceshipImage.src = "../IMAGES/spaceFighter.png";
            spaceshipImage.onload = () =>{
                const scale = 0.4;
                this.image = spaceshipImage;
                this.width = spaceshipImage.width*scale;
                this.height = spaceshipImage.height*scale;
                this.position = {
                    x: canvas.width/2 - this.width/2,
                    y: canvas.height - this.height - 5
                }
            }
        }
        draw(){
            context.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
        }
        update(){
            if(this.image){
                this.draw();
                this.position.x += this.velocity.x;
            }
        }
    }
    //Create a class to create the rockets specifications, draw them and update their position 
    class Rocket{
        constructor({position, velocity}){
            this.velocity = velocity;
            this.position = position;
            const rocketImage = new Image();
            rocketImage.src = "../IMAGES/rocket.png";
            rocketImage.onload = () =>{
                const scale = 0.2;
                this.image = rocketImage;
                this.width = rocketImage.width*scale;
                this.height = rocketImage.height*scale;
            }
        }
        draw(){
            context.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
        }
        update(){
            if(this.image){
                this.draw();
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
            }
        }
    }
    //Create a class to create the aliens specifications, draw them, update their position and create the lasers
    class Alien{
        constructor({position}){
            this.velocity = {
                x: 0,
                y: 0
            }
            const alienImage = new Image();
            alienImage.src = "../IMAGES/orangeAlien.png";
            alienImage.onload = () =>{
                const scale = 0.15;
                this.image = alienImage;
                this.width = alienImage.width*scale;
                this.height = alienImage.height*scale;
                this.position = {
                    x: position.x,
                    y: position.y
                }
            }
        }
        draw(){
            context.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
        }
        update({velocity}){
            if(this.image){
                this.draw();
                this.position.x += velocity.x;
                this.position.y += velocity.y;
            }
        }
        shoot(lasers){
            lasers.push(new Laser({
                position: {
                    x: this.position.x + this.width/2,
                    y: this.position.y + this.height
                },
                velocity: {
                    x: 0,
                    y: 1.5
                }
            }))
        }
    }
    //Create a class for to create the lasers specifications, draw them and update their position 
    class Laser{
        constructor({position, velocity}){
            this.velocity = velocity;
            this.position = position;
            const laserImage = new Image();
            laserImage.src = "../IMAGES/laser.png";
            laserImage.onload = () =>{
                const scale = 0.2;
                this.image = laserImage;
                this.width = laserImage.width*scale;
                this.height = laserImage.height*scale;
            }
        }
        draw(){
            context.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
        }
        update(){
            if(this.image){
                this.draw();
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
            }
        }
    }
    //Create a class for to create the grids specifications, draw them and update their position
    class Grid{
        constructor() { 
            this.position = {
                x: 0,
                y: 0
            }
            this.velocity = {
                x: 1,
                y: 0
            }
            /*An Array will be created with several aliens, 
            the rows will be between 3 and 5, and the columns
            between 5 and 8. */
            this.aliens = []
            const rows = Math.floor(Math.random() * 5 + 3);
            const columns = Math.floor(Math.random() * 5 + 3);
            this.width = columns*20;
            for (let x = 0; x < columns; x++){
                for (let y = 0; y < rows; y++){
                    this.aliens.push(
                        new Alien({
                            position: {
                                x: x * 20,
                                y: y * 20
                            }
                        })
                    )
                }
            }

        }
        //Updates the grid and changes the direction everytime it gets near the canvas borders
        update() {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.velocity.y = 0;
            if (this.position.x + this.width >= canvas.width 
                || this.position.x <= 0){
                this.velocity.x = -this.velocity.x;
                this.velocity.y = 20;
            }
        }
    }
    //Create new player, array for the rockets and array for the grids 
    const userPlayer = new Player();
    const rockets = [];
    const grids = [];
    const lasers = [];
    const keys = {
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        space: {
            pressed: false
        }
    }
    /*Initialise the frame count to 0 ,and random interger between 300 and 900 to set intervals
    for the grids to spawn*/
    let frames = 0;
    let randomInter = Math.floor((Math.random() * 600) + 300);
    let game = {
        over: false
    }
    let score = 0;
    function animate(){
        if(!game.over){
            requestAnimationFrame(animate);
            context.clearRect(0, 0, canvas.width, canvas.height);
            userPlayer.update();
            //Removes any of the lasers from the array if they are out of the canvas
            lasers.forEach((laser, index) => {
                if (laser.position.y + laser.height >= canvas.height){
                    setTimeout(() => {
                        lasers.splice(index, 1);
                    }, 0)
                } else laser.update();
                if(laser.position.y - (laser.height/2) >= userPlayer.position.y
                && laser.position.x - (laser.width/2) >= userPlayer.position.x
                && laser.position.x + laser.width <= userPlayer.position.x + userPlayer.width){
                    setTimeout(() => {
                        lasers.splice(index, 1);
                        //Saves all the scores in the local storage everytime you end the game
                        const localStorageObj = JSON.parse(localStorage[sessionStorage.userLoggedIn])
                        localStorageObj.gamesScoresArray.push(scoreStatus.innerHTML)
                        localStorage[sessionStorage.userLoggedIn] = JSON.stringify(localStorageObj);
                        game.over = true;
                    }, 0)
                }    
            })
            //Removes any of the rockets from the array if they are out of the canvas
            rockets.forEach((rocket, index) =>{
                if (rocket.position.y + rocket.height <= 0){
                    setTimeout(() => {
                        rockets.splice(index, 1);
                    }, 0)
                } else{
                    rocket.update();
                }
            });
            //Updates the direction for all the aliens in the grid
            grids.forEach((grid, gIndex) =>{
                //Removes any grid if it is out of the canvas height
                if(grid.position.y >= canvas.height){
                    setTimeout(() =>{
                        grids.splice(gIndex, 1);
                    }, 0)
                } else {
                    grid.update();
                    //Aliens lasers spawn
                    if(frames % 100 === 0 && grid.aliens.length > 0) {
                        grid.aliens[Math.floor(Math.random() 
                                    * grid.aliens.length)].shoot(lasers)
                    }
                    grid.aliens.forEach((alien, i) => {
                        alien.update({velocity: grid.velocity});
                        rockets.forEach((rocket, j) =>{
                            //Collision detection checks for the position of the rockets and aliens
                            if(rocket.position.y - (rocket.height/2) <= alien.position.y + alien.height 
                            && rocket.position.x + (rocket.width/2) >= alien.position.x 
                            && rocket.position.x - (rocket.width/2) <= alien.position.x + alien.width
                            && rocket.position.y + (rocket.height/2) >= alien.position.y){
                                setTimeout(()=>{
                                    //Checks if alien and rockets is found
                                    const alienFound = grid.aliens.find((alien2) => alien2 === alien);
                                    const rocketFound = rockets.find((rocket2) => rocket2 === rocket);
                                    //Remove alien and rockets
                                    if(alienFound && rocketFound){
                                        score += 100;
                                        scoreStatus.innerHTML = score;
                                        grid.aliens.splice(i, 1);
                                        rockets.splice(j, 1);
                                        //Readjust the grid width
                                        if(grid.aliens.length > 0){
                                            const firstAlien = grid.aliens[0];
                                            const lastAlien = grid.aliens[grid.aliens.length - 1];
                                            grid.width = lastAlien.position.x 
                                                        - firstAlien.position.x 
                                                        + lastAlien.width;
                                            grid.position.x = firstAlien.position.x;
                                        } else{
                                            grids.splice(gIndex, 1);
                                        }
                                    }
                                }, 0)
                            }
                        })
                    })
                }
            })
            //Limits the movements of the spaceship to maintain the spaceship in the canvas
            if(keys.a.pressed && userPlayer.position.x >= 10){
                userPlayer.velocity.x = -2;
            } else if(keys.d.pressed && userPlayer.position.x <= (590 - userPlayer.width)){
                userPlayer.velocity.x = 2;
            } else{
                userPlayer.velocity.x = 0;
            }
            //Insert new grids into the canvas after random ammount of frames
            if(frames % randomInter === 0){
                grids.push(new Grid());
                randomInter = Math.floor((Math.random() * 600) + 300);
                frames = 0;
            }
            frames++;
        } else if(game.over){
            gameOverScreen(canvas, context)
        }
    }
    //Set ups the controllers for the movement of the spaceship and shooting the rockets
    addEventListener('keydown', ({key})=>{
        if(game.over){
            return
        }
        switch(key){
            case 'a':
                console.log("Left");
                keys.a.pressed = true;
                break;
            case 'd':
                console.log("right");
                keys.d.pressed = true;
                break;
            case ' ':
                break;
        }
    })
    addEventListener('keyup', ({key})=>{
        if(game.over){
            return
        }
        switch(key){
            case 'a':
                keys.a.pressed = false;
                break;
            case 'd':
                keys.d.pressed = false;
                break;
            case ' ':
                console.log("blaster blaster");
                //Spawn the rockets when space key is released
                rockets.push(
                    new Rocket({
                        position: {
                            x: userPlayer.position.x + userPlayer.width / 2 - ((40*0.2)/2),
                            y: userPlayer.position.y
                        },
                        velocity: {
                            x: 0,
                            y: -2
                        }
                    })
                )
                break;
        }
    })
    animate();
}
function gameOverScreen(canvas, context){
    const scoreStatus = document.getElementById("currentScore");
    //GameOverScreen
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "20px ROGfont";
    context.textAlign = "center";
    context.fillStyle = "rgba(0,229,20,1)";
    context.fillText("Your score was: " + scoreStatus.innerHTML, canvas.width/2, canvas.height/3);
    context.fillText("Game Over. Press 's' for a new game", canvas.width/2, canvas.height/2);
    isGameActive = false;
    //Confirms the start of the game with the user by using a controller
    window.addEventListener("keydown", e=>{
        e.preventDefault();
        if(e.key.toLowerCase() == "s" && !isGameActive){
            context.clearRect(0, 0, canvas.width, canvas.height);
            scoreStatus.innerHTML = 0;
            console.log("Game has started.")
            isGameActive = true;
            //Call the function to initialise the game taking the canvas and context as parameters
            gameInitialise(canvas, context);
        }
    })
}