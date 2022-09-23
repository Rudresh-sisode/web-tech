import {it, expect, vi} from 'vitest';
import writeData from './io';
import {promises as fs } from 'fs';
import {path} from 'path'

vi.mock('fs');
vi.mock('path',()=>{
    return {
        default:{
            join: (...args) =>{
                return args[args.length -1]
            }
        }
        
    }
})
//it will create spy empty function in fs library

it.concurrent('should ececute the writeFile method',()=>{
    const testData = "Test";
    const testFileName = "test.txt";
    writeData(testData,testFileName)
    // return expect(writeData(testData,testFileName)).resolves.toBeUndefined();
    expect(fs.writeFile).toBeCalledWith(testFileName,testData);
})

it("should execute mock test",()=>{
    const testData = "Test";
    const testFilename = 'text.txt';

    writeData(testData,testFilename);
    // expect(fs.writeFile).toHaveBeenCalled();
})