# abstract-tokenizer

Splits text into a stream of operators and character chunks, based on a set of operator characters and an escape character.

```typescript
    let tokens = Tokens.fromString("abc/def/ghi", '\\', new ImmutableSet('/'));
    for (let token in tokens) {
        // token.type is TokenType.OPERATOR or TokenType.CHAR_SEQUENCE
        // token.data is the opeator ('/') or the character seqence ('abc', 'def', 'ghi')
    }
```