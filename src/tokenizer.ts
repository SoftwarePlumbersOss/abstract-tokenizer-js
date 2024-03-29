import { IImmutableSet } from '@softwareplumber/immutable-set';

enum TokenType { OPERATOR, CHAR_SEQUENCE }

/** Tokens into which a stream of characters is broken.
 * 
 */
class Token {
        
    readonly type: TokenType;
    readonly data: string;

    constructor(type: TokenType, data: string) {
        this.type = type;
        this.data = data;
    }    
}

/** Single character string.
 * 
 */
type CodePoint = string; 
 
/** Breaks a string into tokens.
 * 
 * Converts an interator over codepoints or an iterable over codepoints (for example a string) into an iterable over
 * tokens.
 * 
 */
class Tokenizer implements Iterator<Token> {

    private chunk : Iterator<CodePoint>;
    private codepoint: IteratorResult<CodePoint>;
    private _current: Token | undefined;
    private _escaped: boolean;

    readonly escape: string;
    readonly operators: IImmutableSet<CodePoint>;

    constructor(chunk: Iterator<CodePoint>, escape: string, operators : IImmutableSet<CodePoint> | Set<CodePoint>) {
        this.chunk = chunk;
        this.escape = escape;
        this.operators = operators;
        this._escaped = false;
        this.codepoint = chunk.next();
        this.moveNext();
    }

    get current(): Token | undefined { return this._current; }
    get escaped(): boolean { return this._escaped; }

    private moveNext() {
        let { done, value } = this.codepoint;
        if (!done) {
            if (this.operators.has(value)) {
                this._current = new Token(TokenType.OPERATOR, value);
                this.codepoint = this.chunk.next();
            } else {
                let buffer : string[] = [];
                while (!done) {
                    if (this._escaped) {
                        buffer.push(value);
                        this._escaped = false;
                    } else if (value === this.escape) {
                        this._escaped = true;
                    } else if (this.operators.has(value)) {
                        this._current = new Token(TokenType.CHAR_SEQUENCE, buffer.join(''));
                        break;
                    } else {
                        buffer.push(value);
                    }
                    ({ done, value }  = this.chunk.next());
                }   
                this.codepoint = { done, value };                                                
                if (done) {
                    this._current = new Token(TokenType.CHAR_SEQUENCE, buffer.join(''));
                } 
            }            
        } else {
            this._current = undefined;
        }
    }

    next(value? : any) : IteratorResult<Token> { 
        const result = { done: this._current === undefined, value: this._current };
        this.moveNext();
        return result as IteratorResult<Token>;
    }


}

abstract class Tokens implements Iterable<Token> {

    abstract [Symbol.iterator]() : Iterator<Token>; 

    static fromString(codepoints : string, escape: string, operators : IImmutableSet<CodePoint> | Set<CodePoint> ) : Tokens {
        return {
            [Symbol.iterator] : () => new Tokenizer(codepoints[Symbol.iterator](), escape, operators)
        };
    }
}


export { TokenType, Token, Tokenizer, Tokens };