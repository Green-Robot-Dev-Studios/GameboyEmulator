class MMU {
    constructor() {
        this.MEM = new Array(0xffff).fill(0);
    }

    dump() {
        console.log(this.MEM);
    }
}

// 16-bit address bus
// https://gbdev.io/pandocs/Memory_Map.html
// (0x0000 - 0x7FFF is cartrige filled)
export function allocate() {
    return new MMU();
}