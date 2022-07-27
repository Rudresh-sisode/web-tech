import{ it, expect} from 'vitest';
import httpMocks from 'node-mocks-http'
import { tranformToNumber } from './number';

it('testing http',()=>{
    const request = httpMocks.createRequest({

    })
    const next = {}
    const response = httpMocks.createResponse();
    tranformToNumber(request,response,next);
    const {content,message} = JSON.parse(response._getData());
    console.log('content ',content,' message', message)
    expect(message).toBe("success.")
})

// it('thow an error',()=>{
//     const input = '34';
//     const result = tranformToNumber(input);
//     expect(result).toBe("Not a number.")
// })