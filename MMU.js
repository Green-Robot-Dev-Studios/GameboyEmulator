export default class MMU {
    constructor() {
        // 16-bit address bus
        // https://gbdev.io/pandocs/Memory_Map.html
        // (0x0000 - 0x7FFF is cartrige filled)
        this.MEM = new Array(0xffff).fill(0);
    }

    bindROM(rom) {
        this.MEM = rom;
    }

    dump() {
        console.log(this.MEM);
    }
}
