export default class CPU { // Z80 CPU - Intel 8080 hybrid -> actual model is Sharp LR35902
    constructor(MMU) {
        // Accumulator & flag
        this._A = 0;
        this._F = 0;

        this._B = 0;
        this._C = 0;
        this._D = 0;
        this._E = 0;
        this._H = 0;
        this._L = 0;

        // Stack-pointer & program counter
        this._SP = 0;
        this._PC = 0x0100;

        this.MMU = MMU;
        this.MEM = MMU.MEM;

        this.STOP = false;
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
        // Router for 16-bit extended instruction set (this instruction set has no immediate values)
        0xCB: (b) => { EXT_OP[b[0]]() },

        // Special Operations
        0x00: (b) => { this.STOP = true; },

        // Load Immediate
        0x01: (b) => { this.BC = (b[1] << 8) | b[0]; },
        0x11: (b) => { this.DE = (b[1] << 8) | b[0]; },
        0x21: (b) => { this.HL = (b[1] << 8) | b[0]; },
        0x31: (b) => { this.SP = (b[1] << 8) | b[0]; },

        // Load register into memory location specified by another register
        0x02: (b) => { this.MEM[this.BC] = this.A; },
        0x12: (b) => { this.MEM[this.DE] = this.A; },
        0x22: (b) => { this.MEM[this.HL] = this.A; this.HL += 1; },
        0x32: (b) => { this.MEM[this.HL] = this.A; this.HL -= 1; },

        // Load
        0x06: (b) => { this.B = b[0]; },
        0x16: (b) => { this.D = b[0]; },
        0x26: (b) => { this.H = b[0]; },
        0x36: (b) => { this.MEM[this.HL] = b[0]; },

        // Increment and Decrement
        0x03: (b) => { this.BC += 1 },
        0x13: (b) => { this.DE += 1 },
        0x23: (b) => { this.HL += 1 },
        0x33: (b) => { this.SP += 1 },

        0x04: (b) => { this.B += 1 },
        0x14: (b) => { this.D += 1 },
        0x24: (b) => { this.H += 1 },
        0x34: (b) => { this.MEM[this.HL] += 1 },

        0x05: (b) => { this.B -= 1 },
        0x15: (b) => { this.D -= 1 },
        0x25: (b) => { this.H -= 1 },
        0x35: (b) => { this.MEM[this.HL] -= 1 },

        // Jump on flag
        0x20: (b) => { b[0] = sign(b[0]); if (!this.ZF) this.SP += b[0]; },
        0x30: (b) => { b[0] = sign(b[0]); if (!this.CF) this.SP += b[0]; },
        0x28: (b) => { b[0] = sign(b[0]); if (this.ZF) this.SP += b[0]; },
        0x38: (b) => { b[0] = sign(b[0]); if (this.CF) this.SP += b[0]; },

        // Jump relative
        0x18: (b) => { b[0] = sign(b[0]); this.SP += b[0]; },
    }

    EXT_OP = {
        0x00: () => {  },
    }

    execute() {
        if (this.STOP) return;

        let currentInstruction = this.PC;
        let instruction = this.MEM[currentInstruction];
        if (!this.TIMINGS[instruction] || !this.OP[instruction]) return;

        let size = this.TIMINGS[instruction].bytes;
        let parameters = [];
        if (size > 1) {
            parameters = this.MEM.slice(currentInstruction + 1, currentInstruction + size);
        }

        this.OP[instruction](parameters);

        this.PC += size;

        this.execute();
    }

    start() {
        this.execute();
    
        this.debug();
    }
}

function hex(n) {
    return "0x" + n.toString(16).toUpperCase();
}

function bin(n) {
    return "0b" + n.toString(2).toUpperCase();
}

function sign(b) {
    return (b >= 128) ? b - 256 : b;
}
