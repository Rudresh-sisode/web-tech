import {it,expect, beforeAll, beforeEach, afterAll, afterEach} from 'vitest'
import { User } from './hooks'

beforeAll(()=>{
    console.log("Before all");
})
beforeEach(()=>{
    console.log("Before each");
})
afterEach(()=>{
    console.log("After each");

})
afterAll(()=>{
    console.log("after all");
})
// 
it('update an email',()=>{
    const testEmail = 'tPQOW@qwerpoil@123@t@test.com';
    const newTestEmail = 'test1@test.com';
    const tkn = "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"

    const user = new User(testEmail);
    user.updateEmail(newTestEmail);
    expect(user.email).toBe(newTestEmail)
})