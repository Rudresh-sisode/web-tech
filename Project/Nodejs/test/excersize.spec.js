import{ it, expect} from 'vitest';
import { tranformToNumber } from './number';

it('thow an error',()=>{
    const input = '34';
    const result = tranformToNumber(input);
    expect(result).toBe("Not a number.")
})