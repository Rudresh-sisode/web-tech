import { expect, it } from "vitest";
import { generateToken, generateTokenPromise } from "./async-example";

it('should generate a token value',(done)=>{
    const testUserEmail = 'test@test.com';

        generateToken(testUserEmail,(err,token)=>{

            try{
                expect(token).toBeDefined();
                done();
            }
            catch(error){
                done(error);
            }     
     })
})

it('should generate promise token',()=>{
    const userEmail = "text@gmail.com"
    expect(generateTokenPromise(userEmail)).resolves.toBeDefined();
})

it('async await key checking', async ()=>{
    const testUserEmail = 'testabc@gmail.com';
    const token = await generateTokenPromise(testUserEmail);
    expect(token).toBeDefined();
})