import * as CPU from "./CPU.js";
import * as MMU from "./MMU.js";
import * as PPU from "./PPU.js";

function initCPU() {
    var mmu = MMU.allocate();
    CPU.start(mmu);
}

initCPU();