import { Tokenizer, TokenType, Token } from "./tokenizer";

describe("test simple tokenizer", () =>{
    it("tokenizes an empty string", ()=>{
        let tokens = Tokenizer.fromString("", "\\", new Set([ "/", "@"]));
        for (let token of tokens) {
            fail("shouldn't find any tokens in an empty string");
        }
    })
})