//init screen
const WIDTH = 160;
const HEIGHT = 144;

var screen = document.getElementById("screen");
var ctx = screen.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0, 0, screen.width, screen.height);

// puts pixel x, y to screen with color
function p(x, y, colour) {
    switch (colour) {
        case 0:
            ctx.fillStyle = "#000";
            break;
        case 1:
            ctx.fillStyle = "#555";
            break;
        case 2:
            ctx.fillStyle = "#AAA";
            break;
        case 3:
            ctx.fillStyle = "#FFF";
            break;
        default:
            ctx.fillStyle = "#000";
    }
    ctx.fillRect(x, y, 1, 1);
}

// adds lines or noise to the screen
function testPrint() { 
    for (var i = 0; i < WIDTH; i++) {
        for (var j = 0; j < HEIGHT; j++) {
            p(i, j, Math.round(Math.random()*4)); //print noise
        }
        
    }
}
testPrint();