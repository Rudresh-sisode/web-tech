import {it,expect, beforeAll, beforeEach, afterAll, afterEach} from 'vitest'
import { User } from './hooks'

beforeAll(()=>{
    console.log("Before all");
})
beforeEach(()=>{
    console.log("Before each");
})
// PQOW@qwerpoil@123@
it('update an email',()=>{
    const testEmail = 'test@test.com';
    const newTestEmail = 'test1@test.com';

    const user = new User(testEmail);
    user.updateEmail(newTestEmail);
    expect(user.email).toBe(newTestEmail)
})