import { MouseEvent as ReactMouseEvent } from 'react'
import { Switch } from '../../shared/Switch'
import { Point } from '../../shared/graphics'

export {Point}

export enum MouseModifierKey {
    NoMod= 0,
    Ctrl= 1,
    Shift= 2,
    ShiftCtrl= 3,
    Alt= 4,
    AltCtrl= 5,
    AltShift= 6,
    AltShiftCtrl= 7,
    Any=8
}
export enum MouseButton {
    Left = 'Left',
    Right = 'Right',
}


export const mouseButton = (event: MouseEvent | ReactMouseEvent): MouseButton => new Switch(event.button)
    .case(0, ()=>MouseButton.Left)
    .case(2, ()=>MouseButton.Right)
    .default(()=>MouseButton.Left)
    .result


export const mouseModifierKey = (event: MouseEvent | ReactMouseEvent): MouseModifierKey => { 
    const selection: number = (Number(event.altKey) << 2) | (Number(event.shiftKey) << 1) | (Number(event.ctrlKey)||(Number(event.metaKey)))
    const keyMod = MouseModifierKey[selection]
    return new Switch(keyMod)
      .case('NoMod', ()=>MouseModifierKey.NoMod)
      .case('Ctrl', ()=>MouseModifierKey.Ctrl)
      .case('Shift', ()=>MouseModifierKey.Shift)
      .case('ShiftCtrl', ()=>MouseModifierKey.ShiftCtrl)
      .case('Alt', ()=>MouseModifierKey.Alt)
      .case('AltCtrl', ()=> MouseModifierKey.AltCtrl)
      .case('AltShiftCtrl', ()=>MouseModifierKey.AltShiftCtrl)
      .result
}

export const mousePoint = (event: MouseEvent | ReactMouseEvent): Point => ({
    x: event.clientX,
    y: event.clientY
})
export const mouseRect = (mouseDownPoint: Point, mouseMovePoint: Point) => {
    const x = Math.min(mouseDownPoint.x, mouseMovePoint.x)
    const y = Math.min(mouseDownPoint.y, mouseMovePoint.y)
    const width = Math.abs(mouseDownPoint.x - mouseMovePoint.x)
    const height = Math.abs(mouseDownPoint.y - mouseMovePoint.y)
    return {x, y, width, height}
}
export const mouseGuard = (
    event: MouseEvent | ReactMouseEvent,
    button: 'Left' | 'Right', 
    modifier: keyof typeof MouseModifierKey,
    fn: ()=>void) => 
{
    !(   (mouseButton(event) === button) 
      && ((MouseModifierKey[mouseModifierKey(event)] === modifier)||(modifier === 'Any'))
      ) || fn()
}

export const mouseGuard2 = (
    event: MouseEvent | ReactMouseEvent,
    button: 'left' | 'right'| 'any',
    modifiers: Array<MouseModifierKey>,
    fn: ()=>void
) => {
    const checkButtonCondition = () => new Switch(button)
        .case('left', ()=>event.button === 0)
        .case('right', ()=>event.button === 2)
        .default(()=>true)
        .result
    
    const checkModifierCondition = () => {
        if (modifiers.includes(MouseModifierKey.Any)) {
            return true;
        }
        let pass:boolean = false;
        for (let mod of modifiers) {
            pass = new Switch(mod)
                .case(MouseModifierKey.NoMod, ()=>!event.ctrlKey && !event.shiftKey && !event.altKey)
                .case(MouseModifierKey.Ctrl, ()=>event.ctrlKey)
                .case(MouseModifierKey.Shift, ()=>event.shiftKey)
                .case(MouseModifierKey.ShiftCtrl, ()=>event.shiftKey && event.ctrlKey)
                .case(MouseModifierKey.Alt, ()=>event.altKey)
                .case(MouseModifierKey.AltCtrl, ()=>event.altKey && event.ctrlKey)
                .case(MouseModifierKey.AltShift, ()=>event.altKey && event.shiftKey)
                .case(MouseModifierKey.AltShiftCtrl, ()=>event.altKey && event.shiftKey && event.ctrlKey)
                .result
        }
        return pass;
    };

    if (checkButtonCondition() && checkModifierCondition()) {
        fn();
    }
}

export const updateClickCounter = (clickCounter: {
    count: number,
    timeout: NodeJS.Timeout | null
}) => {
    clickCounter.count++
    clearTimeout(clickCounter.timeout!)
    clickCounter.timeout = setTimeout(() => {
        clickCounter.count = 0
    }, 500)
}