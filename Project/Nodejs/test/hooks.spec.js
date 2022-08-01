import {it,expect} from 'vitest'
import { User } from './hooks'

it('update an email',()=>{
    const testEmail = 'test@test.com';
    const newTestEmail = 'test1@test.com';

    const user = new User(testEmail);
    user.updateEmail(newTestEmail);
    expect(user.email).toBe(newTestEmail)
})