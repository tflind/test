var currentState,
    width,
    height,
    frames = 0,
    ogroup,
    thefireball,
    thehero;


var states = {
    splash: 0,
    game: 1,
    score: 2
};

var canvas;
var renderingContext;
var thescore = 0;

function Fireball(){
    this.x = 100;
    this.y = (Math.random() * 100);

    this.frame = 0;
    this.animation = [0, 1, 2, 3, 2, 1];

    this.update = function (){
        var h = 20;
        this.frame += frames % h === 0 ? 1 : 0;
        this.frame %= this.animation.length;
    }

    this.draw = function(renderingContext){
        renderingContext.save();
        renderingContext.translate(this.x, this.y);

        var h = this.animation[this.frame];
        fireballSprite[h].draw(renderingContext, this.x, this.y);

        renderingContext.restore();
    }



}


function OctoGroup(){
    this.collection = [];

    this.reset = function(){
        this.collection = [];
    }

    this.add = function(){
        this.collection.push(new Octorok());
    }

    this.update = function(){
        // console.log(frames);
        if(frames % 100 === 0){ //Add an octorok every 100 frames. you increase or make it random
            this.add();
        }

        for(var i = 0, len = this.collection.length; i < len; i++){
            var octorok = this.collection[i];

            if(i === 0){
                octorok.detectCollision();
                octorok.checkScore();
            } //only want to detect collision on the one coming at him

            octorok.x -= 2;
            if(octorok.x < -octorok.width){
                this.collection.splice(i, 1);
                i --;
                len --;
            }
        }
    }
    this.draw = function(){
        for(var i = 0, len = this.collection.length; i < len; i++){
            var octorok = this.collection[i];
            octorok.draw();
        }
    }
} //this is where the octorok comes in

function Octorok() {
    this.x = 400; //location on the canvas
    this.y = 355; //location on the canvas
    this.width = octorokSprite.width;
    this.height = octorokSprite.height;
    this.scored = false;

    this.detectCollision = function(){
        if(this.x <= (thehero.x + thehero.width) && this.x >= thehero.x && thehero.y >= 150){
            // console.log("you're dead")
            currentState = states.score;
            document.getElementById("resetbtn").style.display = "block";
            localStorage.setItem("Highscore", thescore); //get item or set item

        }

    }

    this.checkScore = function(){
        if((this.x + this.width) < thehero.x && !this.scored){
            thescore++;
            this.scored = true;
            document.getElementById("scorebox").innerHTML = thescore;
        }
    }

    this.draw = function(){
        octorokSprite.draw(renderingContext, this.x, this.y);
        // console.log("octorok drawing")
    }
}

function Hero(){
    this.x = 50;
    this.y = 170;
    this.width = 45;
    this.height = 55;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 1];

    this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.25;
    this._jump = 5.2;
    this.jumpcount = 3;
    this._direction = "";
    this.friction = 0.94;
    this.maxspeed = 6;
    this.velx = 0;

    this.jump = function(){
        if(this.jumpcount > 0){
            this.velocity = -this._jump;
            this.jumpcount --;
        }   // the if statement creates a jump count
    }

    this.update = function() {
        var h = currentState === states.splash ? 10 : 5; // every 10 frames is 1 hero frame - adjust speed of display
        this.frame += frames % h === 0 ? 1 : 0;
        this.frame %= this.animation.length;
        // console.log(this.frame)

        if (currentState == states.splash) {
            this.updateIdleHero();
            // do something while idle
        }
        else {
            this.updatePlayingHero();
        }
    }

    this.updateIdleHero = function (){
        // this.y = 200;
    }

    this.updatePlayingHero = function(){
        this.velocity += this.gravity;
        this.y += this.velocity;

        // check to see if hit the ground and stay there
        if(this.y >= 170){
            this.y = 170;
            this.jumpcount = 3;
            this.velocity = this._jump;
        }
        if(this._direction === "left"){
            if(this.velx > -this.maxspeed){
                this.velx --;
            }
        }
        if(this._direction === "right"){
            if(this.velx < this.maxspeed){
                this.velx ++;
            }
        }
        this.velx *= this.friction;
        this.x += this.velx;
    }


    this.draw = function(renderingContext) {
        renderingContext.save();

        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        var f = this.animation[this.frame];
        link[f].draw(renderingContext, 20, this.y);

        renderingContext.restore();
    }
}



function main(){
    windowSetup();
    canvasSetup();
    currentState = states.splash;
    document.getElementById("canvasbox").appendChild(canvas);

    loadGraphics();
    thehero = new Hero();
    ogroup = new OctoGroup();
    thefireball = new Fireball();
}

function resetgame(){
    ogroup.reset();
    currentState = states.splash;
    if(thescore > Number(localStorage.getItem("Highscore"))){
        localStorage.setItem("Highscore", thescore);
    }
    document.getElementById("myhighscore").innerHTML = localStorage.getItem("Highscore");
    thescore = 0;
    document.getElementById("scorebox").innerHTML = thescore;
    document.getElementById("resetbtn").style.display="none";
}

function windowSetup(){
    var inputEvent = "touchstart";
    var windowWidth = $(window).width();
    console.log(windowWidth);
    if(windowWidth <500){
        width = 320;
        height = 430;
    }
    else {
        width = 400;
        height = 430;
        inputEvent = "mousedown";  //keydown?
    }

    document.addEventListener(inputEvent, onpress);
    document.addEventListener("keydown", onpress);
    document.addEventListener("keyup", removeMotion);
}

function removeMotion(evt){
    thehero._direction = "";
}

function onpress(evt){
    // console.log("click happened");
    switch (currentState) {
        case states.splash:
            thehero.jump();
            currentState = states.game;
            break;
        case states.game:
            thehero.jump();
            break;
        case 37:
            thehero._direction = "left";
            break;
        case 39:
            thehero._direction = "right";
            break;
    }
}

function canvasSetup(){
    canvas = document.createElement("canvas");
    canvas.style.border = "2px solid black";
    canvas.width = width;
    canvas.height = height;
    renderingContext = canvas.getContext("2d");
}

function loadGraphics(){
    var img = new Image();
    img.src = "linksheet.png";
    var imgfireball = new Image();
    imgfireball.src = "fireBall.png";
    img.onload = function(){
        initSprites(this);
        initFireball(imgfireball);
        renderingContext.fillStyle = "#3DB0DD";
        localStorage.setItem("Highscore", 0);


        //  link[0].draw(renderingContext, 50, 50)
        gameLoop();
    };

}
// constantly calling update and render
function gameLoop(){
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}

function update(){
    frames ++;
    if(currentState === states.game){
        ogroup.update();
    }
    thehero.update();
    thefireball.update();
}

// render draws in layers
function render(){
    renderingContext.fillRect(0, 0, width, height);
    backgroundSprite.draw(renderingContext, 0, 190);
    // octorokSprite.draw(renderContext, 220, 340)  //hard code to see where the sprite is drawn
    ogroup.draw(renderingContext);
    thehero.draw(renderingContext);
    thefireball.draw(renderingContext);

}
