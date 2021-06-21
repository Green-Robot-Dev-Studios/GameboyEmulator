class Z80 { // Z80 CPU - Intel 8080 hybrid -> actual model is Sharp LR35902
    constructor(MMU) {
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

        this.MMU = MMU;
        this.MEM = MMU.MEM;
    }
    
    get A() { return this._A; }
    get F() { return this._F; }

    get B() { return this._B; }
    get C() { return this._C; }
    get D() { return this._D; }
    get E() { return this._E; }
    get H() { return this._H; }
    get L() { return this._L; }

    get SP() { return this._SP; }
    get PC() { return this._PC; }

    get AF() { return (this.A << 8) + this.F; }
    get BC() { return (this.B << 8) + this.C; }
    get DE() { return (this.D << 8) + this.E; }
    get HL() { return (this.H << 8) + this.L; }

    get ZF() { return this.F & 1 << 0 != 0 }
    get NF() { return this.F & 1 << 1 != 0 }
    get HF() { return this.F & 1 << 2 != 0 }
    get CF() { return this.F & 1 << 3 != 0 }

    set A(val) { this._A = val; }
    set F(val) { this._F = val; }

    set B(val) { this._B = val; }
    set C(val) { this._C = val; }
    set D(val) { this._D = val; }
    set E(val) { this._E = val; }
    set H(val) { this._H = val; }
    set L(val) { this._L = val; }
    
    set SP(val) { this._SP = val; }
    set PC(val) { this._PC = val; }

    set AF(val) { this.A = val >> 8; this.F = val & 0x00FF }
    set BC(val) { this.B = val >> 8; this.C = val & 0x00FF }
    set DE(val) { this.D = val >> 8; this.E = val & 0x00FF }
    set HL(val) { this.H = val >> 8; this.L = val & 0x00FF }

    set ZF(val) { val ? this.F |= 1 << 0 : this.F &= ~1 << 0; }
    set NF(val) { val ? this.F |= 1 << 1 : this.F &= ~1 << 1; }
    set HF(val) { val ? this.F |= 1 << 2 : this.F &= ~1 << 2; }
    set CF(val) { val ? this.F |= 1 << 3 : this.F &= ~1 << 3; }

    debug() {
        console.log(`A: ${hex(this.A)} F: ${hex(this.F)}`);
        console.log(`B: ${hex(this.B)} C: ${hex(this.C)}`);
        console.log(`D: ${hex(this.D)} E: ${hex(this.E)}`);
        console.log(`H: ${hex(this.H)} L: ${hex(this.L)}`);

        console.log(`PC: ${hex(this.PC)} SP: ${hex(this.SP)}`);
    }

    TIMINGS = {
        0x00: { bytes: 1, cycles: 1 },
        0x01: { bytes: 3, cycles: 3 },
        0x02: { bytes: 1, cycles: 2 },
        0x03: { bytes: 1, cycles: 2 },
        0x03: { bytes: 1, cycles: 1 },
    }

    OP = {
        // 0x00
        0x00: (b) => {  },
        0x01: (b) => { this.B = b[1]; this.C = b[0]; },
        0x02: (b) => { this.MEM[this.BC] = this.A; },
        0x03: (b) => { this.BC += 1 },
        0x04: (b) => {  },
    }
}

function hex(n) {
    return "0x" + n.toString(16).toUpperCase();
}

function bin(n) {
    return "0b" + n.toString(2).toUpperCase();
}

export function start(mmu) {
    var cpu = new Z80(mmu);

    cpu.debug();
}