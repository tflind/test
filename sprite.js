
var link;
var backgroundSprite;
var octorokSprite;
var fireballSprite;


function Sprite(img, x, y, width, height){
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Sprite.prototype.draw = function(renderingContext, x, y){
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
}

function initSprites(img){
    // link = new Sprite(img, 0, 0, 45, 55);
    link = [
        new Sprite(img, 0, 0, 45, 55),
        new Sprite(img, 45, 0, 45, 55),
        new Sprite(img, 90, 0, 45, 55)
    ];
    backgroundSprite = new Sprite(img, 200, 0, 400, 250);
    octorokSprite = new Sprite(img, 0, 60, 45, 35);
}

function initFireball(img){
    fireballSprite = [
        new Sprite(img, 1, 0, 39, 42),
        new Sprite(img, 52, 0, 39, 42),
        new Sprite(img, 103, 0, 39, 42),
        new Sprite(img, 154, 0, 39, 42)
    ];
}
