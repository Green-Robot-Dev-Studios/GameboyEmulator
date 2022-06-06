import Gameboy from "./Gameboy.js";

async function start() {
    // Get screen to mount to
    let screen = document.getElementById("screen");

    // Set up the gameboy
    let gameboy = new Gameboy(screen);

    let testRom = [
        0x01,
        0xFF,
        0xFF,
        0x00,
    ];

    let tetris = await fetch("./Tetris.gb");
    tetris = (await tetris.body.getReader().read()).value;
    
    // Load a rom
    gameboy.boot(tetris);
    console.log(gameboy.getCurrentGame())
}

start();
