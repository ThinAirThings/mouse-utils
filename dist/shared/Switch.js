"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
class Switch {
    constructor(value) {
        this.value = value;
        this.isMatched = false;
    }
    case(matcher, callback) {
        if (!this.isMatched) {
            if (matcher === this.value) {
                this.isMatched = true;
                this.result = callback(this.value);
            }
        }
        return this;
    }
    default(callback) {
        if (!this.isMatched) {
            this.result = callback(this.value);
        }
        return this;
    }
}
exports.Switch = Switch;
