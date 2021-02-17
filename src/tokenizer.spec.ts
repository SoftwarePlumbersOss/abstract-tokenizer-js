import { Tokenizer, TokenType, Token, Tokens } from "./tokenizer";

describe("test simple tokenizer", () =>{

    it("tokenizes an empty string", ()=>{
        let tokens = Tokens.fromString("", "\\", new Set([ "/", "@"]));
        for (let token of tokens) {
            fail("shouldn't find any tokens in an empty string");
        }
    });

    it("tokenizes a simple string", ()=>{
        let tokenizer = new Tokenizer("abc123"[Symbol.iterator](), '\\', new Set(["[", "]", "*", "?"]));
        let current = tokenizer.next();
        expect(current.done).toBe(false);
        expect(current.value.data).toBe("abc123");
        expect(current.value.type).toBe(TokenType.CHAR_SEQUENCE);
        expect(tokenizer.next()).toHaveProperty("done", true);
    });

    it("tokenizes a string with operators", ()=>{
        let tokenizer = new Tokenizer("ab*c1?23"[Symbol.iterator](), '\\', new Set(["[", "]", "*", "?"]));
        let { value : token, done } = tokenizer.next();
        expect(done).toBe(false);
        expect(token.data).toBe("ab");
        expect(token.type).toBe(TokenType.CHAR_SEQUENCE);
        ({ value : token, done } = tokenizer.next());
        expect(done).toBe(false);
        expect(token.data).toBe("*");
        expect(token.type).toBe(TokenType.OPERATOR);
        ({ value : token, done } = tokenizer.next());
        expect(done).toBe(false);
        expect(token.data).toBe("c1");
        expect(token.type).toBe(TokenType.CHAR_SEQUENCE);
        ({ value : token, done } = tokenizer.next());
        expect(done).toBe(false);
        expect(token.data).toBe("?");
        expect(token.type).toBe(TokenType.OPERATOR);
        ({ value : token, done } = tokenizer.next());
        expect(done).toBe(false);
        expect(token.data).toBe("23");
        expect(token.type).toBe(TokenType.CHAR_SEQUENCE);
        ({ value : token, done } = tokenizer.next());
        expect(done).toBe(true);
    });

    it("tokenizes string with escape", ()=>{
        let tokenizer = new Tokenizer("abc\\*123"[Symbol.iterator](), '\\', new Set(["[", "]", "*", "?"]));
        let { value : token, done } = tokenizer.next();
        expect(done).toBe(false);
        expect(token.data).toBe("abc*123");
        expect(token.type).toBe(TokenType.CHAR_SEQUENCE);
        ({ value : token, done } = tokenizer.next());
        expect(done).toBe(true);
    });    

})