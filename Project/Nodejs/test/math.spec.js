import {it,expect} from 'vitest';
import { add } from './sum';

it('should sumerized all number',()=>{
    const result = add([3,3])
    expect(result).to.toBe(6);
})

it('yield if NaN',()=>{
    const input = ['in',1];
    const result = add(input)

    expect(result).toBeNaN();
})

//AAA Pattern
it('summer all value',()=>{
    //Arrange
    const number = [2,3,4];

    //Act
    const result = add(number);

    //Assert
    const expResult = number.reduce((pr,cur)=> pr + cur,0);
    expect(result).toBe(expResult);
})