import { MouseEvent as ReactMouseEvent } from 'react';
import { Point } from '../../shared/graphics';
export { Point };
export declare enum MouseModifierKey {
    NoMod = 0,
    Ctrl = 1,
    Shift = 2,
    ShiftCtrl = 3,
    Alt = 4,
    AltCtrl = 5,
    AltShift = 6,
    AltShiftCtrl = 7,
    Any = 8
}
export declare enum MouseButton {
    Left = "Left",
    Right = "Right"
}
export declare const mouseButton: (event: MouseEvent | ReactMouseEvent) => any;
export declare const mouseModifierKey: (event: MouseEvent | ReactMouseEvent) => MouseModifierKey;
export declare const mousePoint: (event: MouseEvent | ReactMouseEvent) => Point;
export declare const mouseGuard: (event: MouseEvent | ReactMouseEvent, button: 'Left' | 'Right', modifier: keyof typeof MouseModifierKey, fn: () => void) => void;
