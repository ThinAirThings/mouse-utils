"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMouseGuard = exports.mouseGuard = exports.mouseRect = exports.mousePoint = exports.mouseModifierKey = exports.mouseButton = exports.MouseButton = exports.MouseModifierKey = void 0;
const Switch_1 = require("../../shared/Switch");
var MouseModifierKey;
(function (MouseModifierKey) {
    MouseModifierKey[MouseModifierKey["NoMod"] = 0] = "NoMod";
    MouseModifierKey[MouseModifierKey["Ctrl"] = 1] = "Ctrl";
    MouseModifierKey[MouseModifierKey["Shift"] = 2] = "Shift";
    MouseModifierKey[MouseModifierKey["ShiftCtrl"] = 3] = "ShiftCtrl";
    MouseModifierKey[MouseModifierKey["Alt"] = 4] = "Alt";
    MouseModifierKey[MouseModifierKey["AltCtrl"] = 5] = "AltCtrl";
    MouseModifierKey[MouseModifierKey["AltShift"] = 6] = "AltShift";
    MouseModifierKey[MouseModifierKey["AltShiftCtrl"] = 7] = "AltShiftCtrl";
    MouseModifierKey[MouseModifierKey["Any"] = 8] = "Any";
})(MouseModifierKey = exports.MouseModifierKey || (exports.MouseModifierKey = {}));
var MouseButton;
(function (MouseButton) {
    MouseButton["Left"] = "Left";
    MouseButton["Right"] = "Right";
})(MouseButton = exports.MouseButton || (exports.MouseButton = {}));
const mouseButton = (event) => new Switch_1.Switch(event.button)
    .case(0, () => MouseButton.Left)
    .case(2, () => MouseButton.Right)
    .default(() => MouseButton.Left)
    .result;
exports.mouseButton = mouseButton;
const mouseModifierKey = (event) => {
    const selection = (Number(event.altKey) << 2) | (Number(event.shiftKey) << 1) | (Number(event.ctrlKey) || (Number(event.metaKey)));
    const keyMod = MouseModifierKey[selection];
    return new Switch_1.Switch(keyMod)
        .case('NoMod', () => MouseModifierKey.NoMod)
        .case('Ctrl', () => MouseModifierKey.Ctrl)
        .case('Shift', () => MouseModifierKey.Shift)
        .case('ShiftCtrl', () => MouseModifierKey.ShiftCtrl)
        .case('Alt', () => MouseModifierKey.Alt)
        .case('AltCtrl', () => MouseModifierKey.AltCtrl)
        .case('AltShiftCtrl', () => MouseModifierKey.AltShiftCtrl)
        .result;
};
exports.mouseModifierKey = mouseModifierKey;
const mousePoint = (event) => ({
    x: event.clientX,
    y: event.clientY
});
exports.mousePoint = mousePoint;
const mouseRect = (mouseDownPoint, mouseMovePoint) => {
    const x = Math.min(mouseDownPoint.x, mouseMovePoint.x);
    const y = Math.min(mouseDownPoint.y, mouseMovePoint.y);
    const width = Math.abs(mouseDownPoint.x - mouseMovePoint.x);
    const height = Math.abs(mouseDownPoint.y - mouseMovePoint.y);
    return { x, y, width, height };
};
exports.mouseRect = mouseRect;
const mouseGuard = (event, button, modifier, fn) => {
    !(((0, exports.mouseButton)(event) === button)
        && ((MouseModifierKey[(0, exports.mouseModifierKey)(event)] === modifier) || (modifier === 'Any'))) || fn();
};
exports.mouseGuard = mouseGuard;
// WORK IN PROGRESS 
// export const mouseGuard = (
//     event: MouseEvent | ReactMouseEvent,
//     button: 'Left' | 'Right', 
//     modifiers: Array<keyof typeof MouseModifierKey>,
//     fn: ()=>void
// ) => {
//     !(   (mouseButton(event) === button) 
//       && (modifiers.some(modifier => MouseModifierKey[mouseModifierKey(event)] === modifier)||(modifiers.includes('Any')))
//       ) || fn()
// }
const createMouseGuard = (mouseModeTable) => (event, button, modifiers, mouseModes, fn) => {
    const checkButtonCondition = () => new Switch_1.Switch(button)
        .case('left', () => event.button === 0)
        .case('right', () => event.button === 2)
        .default(() => true)
        .result;
    const checkModifierCondition = () => {
        if (modifiers.includes(MouseModifierKey.Any)) {
            return true;
        }
        let pass = false;
        for (let mod of modifiers) {
            pass = new Switch_1.Switch(mod)
                .case(MouseModifierKey.NoMod, () => !event.ctrlKey && !event.shiftKey && !event.altKey)
                .case(MouseModifierKey.Ctrl, () => event.ctrlKey)
                .case(MouseModifierKey.Shift, () => event.shiftKey)
                .case(MouseModifierKey.ShiftCtrl, () => event.shiftKey && event.ctrlKey)
                .case(MouseModifierKey.Alt, () => event.altKey)
                .case(MouseModifierKey.AltCtrl, () => event.altKey && event.ctrlKey)
                .case(MouseModifierKey.AltShift, () => event.altKey && event.shiftKey)
                .case(MouseModifierKey.AltShiftCtrl, () => event.altKey && event.shiftKey && event.ctrlKey)
                .result;
        }
        return pass;
    };
    const checkMouseModeCondition = () => {
        // adjust this based on your requirements
        return mouseModes.every((mode) => mouseModeTable[mode] === true);
    };
    if (checkButtonCondition() && checkModifierCondition() && checkMouseModeCondition()) {
        fn();
    }
};
exports.createMouseGuard = createMouseGuard;
