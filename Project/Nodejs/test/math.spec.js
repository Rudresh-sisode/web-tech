import {it,expect} from 'vitest';
import { add } from './sum';

it('should sumerized all number',()=>{
    const result = add([3,3])
    expect(result).to.toBe(6);
})