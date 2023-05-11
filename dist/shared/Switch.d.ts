export declare class Switch<T, R = any> {
    private value;
    private isMatched;
    result?: R;
    constructor(value: T);
    case(matcher: T, callback: (value: T) => R): Switch<T, R>;
    default(callback: (value: T) => R): Switch<T, R>;
}
