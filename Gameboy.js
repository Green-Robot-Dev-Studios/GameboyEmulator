import CPU from "./CPU.js";
import MMU from "./MMU.js";
// import { PPU } from "./PPU";

export default class Gameboy {
    constructor(canvas) {
        this.canvas = canvas;

        this.cpu = null;
        this.mmu = null;
    }

    boot(rom) {
        // Allocate memory
        this.mmu = new MMU();
        this.mmu.bindROM(rom);

        // Boot CPU bound to memory
        this.cpu = new CPU(this.mmu);
        this.cpu.start();
    }

    getCurrentGame() {
        let memory = this.mmu.MEM;
        let title = memory.slice(0x0134, 0x0143 + 1);
        return String.fromCharCode.apply(null, title);
    }
}