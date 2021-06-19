//init screen
const WIDTH = 160;
const HEIGHT = 144;

screen = document.getElementById("screen");
ctx = screen.getContext("2d");
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

class Z80 { // Z80 CPU - Intel 8080 hybrid -> actual model is Sharp LR35902
    constructor() {
        // accumulator & flag
        this._A = 0;
        this._F = 0;

        this._B = 0;
        this._C = 0;
        this._D = 0;
        this._E = 0;
        this._H = 0;
        this._L = 0;

        //stack-pointer & program counter
        this._SP = 0;
        this._PC = 0; 
    }
    

    get A() { return this._A; }
    get F() { return this._F; }

    get B() { return this._B; }
    get C() { return this._C; }
    get D() { return this._D; }
    get E() { return this._E; }
    get H() { return this._H; }
    get L() { return this._L; }

    get SP() { return this._SP }
    get PC() { return this._PC }

    get AF() { return this.A  }
    get BC() {}
    get DE() {}
    get HL() {}

    get Z() { return this.F & 1 << 0 != 0 }
    get N() { return this.F & 1 << 1 != 0 }
    get H() { return this.F & 1 << 2 != 0 }
    get C() { return this.F & 1 << 3 != 0 }

    set A(val) { this._A = val; }
    set F(val) { this._F = val; }

    set B(val) { this._B = val; }
    set C(val) { this._C = val; }
    set D(val) { this._D = val; }
    set E(val) { this._E = val; }
    set H(val) { this._H = val; }
    set L(val) { this._L = val; }

    set Z(val) { val ? this.F |= 1 << 0 : this.F &= ~1 << 0; }
    set N(val) { val ? this.F |= 1 << 1 : this.F &= ~1 << 1; }
    set H(val) { val ? this.F |= 1 << 2 : this.F &= ~1 << 2; }
    set C(val) { val ? this.F |= 1 << 3 : this.F &= ~1 << 3; }

    debug() {
        console.log(`A: ${hex(this.A)} F: ${bin(this.F)}`);
        console.log(`B: ${hex(this.B)} C: ${hex(this.C)}`);
        console.log(`D: ${hex(this.D)} E: ${hex(this.E)}`);
        console.log(`H: ${hex(this.H)} L: ${hex(this.L)}`);

        console.log(`PC: ${hex(this.PC)} SP: ${hex(this.SP)}`);
    }
}

function hex(n) {
    return "0x" + n.toString(16).toUpperCase();
}

function bin(n) {
    return "0b" + n.toString(2).toUpperCase();
}

// 16-bit address bus
// https://gbdev.io/pandocs/Memory_Map.html
// (0x0000 - 0x7FFF is cartrige filled)
MMU = new Array(0xffff).fill(0);

TIMINGS = {
    0x00: { bytes: 1, cycles: 1 }
}

OP = {
    // 0x00
    0x00: () => { Z80.PC++ },
    0x01: () => { Z80.PC++ },
}

cpu = new Z80();

cpu.debug();