import {it,expect} from 'vitest';
import httpMock from 'node-mocks-http';
import authMiddleware from '../middlewares/auth-middleware';
import UserRequest from '../abstractions/classes/interfaces/user-request-data-model';

it('throw error if header is empty',()=>{
    const request:UserRequest = httpMock.createRequest({
        headers:{"authorization":""}
    })

    const next={};
    const response = httpMock.createResponse();
    
    authMiddleware(request,response,next)
    const {status,message} = JSON.parse(response._getData());
    console.log('sts ',status,'message',message)
    expect(status).toBe("error");
    expect(message).toBe("Auth Header missing!")
})

it('throw error if jwt (token) incorrect/malform',()=>{
    const request:UserRequest = httpMock.createRequest({
        headers:{"authorization":"Bearer sldksldkfsldkfjsldfjkksjf;lkjsl"}
    })
    const next = {};
    const response = httpMock.createResponse();
    authMiddleware(request,response,next);
    const {status,message} = JSON.parse(response._getData());
    console.log('sts',status,'message',message);
    expect(status).toBe("error");
    expect(message).toBe("jwt malformed")
})

// it('throw error if jwt is not provides',()=>{
//     const request:UserRequest = httpMock.createRequest({
//         headers:{"authorization":"Bearer"}
//     })
//     const next = {};
//     const response = httpMock.createResponse();
//     authMiddleware(request,response,next);
//     const {status,message} = JSON.parse(response._getData());
//     console.log('sts',status,'message',message);
//     expect(status).toBe("error");
//     expect(message).toBe("jwt must be provided")
// })
