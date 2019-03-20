const expect = require('expect');
const {messageCreator} =require('../utiles/message');


describe("message Create",()=>{
    it("should return message in correct form and data",()=>{
        const from="sam@daived";
        const text="I am a test";
        const message= messageCreator(from,text);

        expect(message.text).toBe(text);
        expect(message.from).toBe(from);
        expect(typeof message.createdAt).toBe('number');

        
    })
})