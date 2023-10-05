import { it, expect,describe } from 'vitest';
import httpMock from 'node-mocks-http';
import roleAuchCheck from '../middlewares/role-auth-check-middleware';
import UserRequest from '../abstractions/classes/interfaces/user-request-data-model';
import jest from 'jest-mock';

  // it('should allow GET request for a resource with READ privilege', async () => {
  //   const roleId = 'dbb03fc0-f9f8-11ed-b1a7-2b4a86e282f4';
  //   // create a mock request object
  //   const req:UserRequest = httpMock.createRequest({
  //     method: 'GET',
  //     url: 'http://localhost:8000',
  //     roleId: roleId,
  //     originalUrl: '/settings',
  //   });

  //   // create a mock response object
  //   const res = httpMock.createResponse();

  //   // create a mock next function
  //   const next = jest.fn();

  //   // call the roleAuchCheck middleware function
  //   await roleAuchCheck(req, res, next);

  //   // check that the next function was called
  //   expect(next).toHaveBeenCalled();
  // });

  // it('should allow POST request for a resource with WRITE privilege', async () => {
  //   // create a mock request object
  //   const req:UserRequest = httpMock.createRequest({
  //     method: 'POST',
  //     url: '/users',
  //     roleId: 1,
  //     originalUrl: '/users',
  //   });

  //   // create a mock response object
  //   const res = httpMock.createResponse();

  //   // create a mock next function
  //   const next = jest.fn();

  //   // call the roleAuchCheck middleware function
  //   await roleAuchCheck(req, res, next);

  //   // check that the next function was called
  //   expect(next).toHaveBeenCalled();
  // });


it('should allow PUT request for a resource with WRITE privilege', async () => {
  // create a mock request object
  const roleId = 'dce98310-f9f8-11ed-b1a7-2b4a86e282f4';
  const req:UserRequest = httpMock.createRequest({
    method: 'PUT',
    url: 'http://localhost:8000',
    roleId: roleId,
    originalUrl: '/systems',
  });

  // create a mock response object
  const res = httpMock.createResponse();

  // create a mock next function
  const next = jest.fn();

  // call the roleAuchCheck middleware function
  await roleAuchCheck(req, res, next);

  // check that the next function was called
  expect(next).toHaveBeenCalled();
});

it('should return 400 if roleId is missing', async () => {
  // create a mock request object
  
  const req:UserRequest = httpMock.createRequest({
    method: 'GET',
    url: '/users',
    originalUrl: '/users',
  });

  // create a mock response object
  const res = httpMock.createResponse();

  // create a mock next function
  const next = jest.fn();

  // call the roleAuchCheck middleware function
  await roleAuchCheck(req, res, next);

  // check the response status code and message
  expect(res.statusCode).toBe(400);
  expect(res._getJSONData().status).toBe('error');
  expect(res._getJSONData().message).toBe('Invalid Operation!');
});

it('should return 404 if role is not found or deleted', async () => {
  const roleId = 'dbb03fc0-f9f8-11ed-b1a7-2b4a86e282f0';
  // create a mock request object
  const req:UserRequest = httpMock.createRequest({
    method: 'GET',
    url: '/users',
    roleId: roleId,
    originalUrl: '/users',
  });

  // create a mock response object
  const res = httpMock.createResponse();

  // create a mock next function
  const next = jest.fn();

  // call the roleAuchCheck middleware function
  await roleAuchCheck(req, res, next);
  console.log(res._getJSONData());

  // check the response status code and message
  expect(res.statusCode).toBe(404);
  expect(res._getJSONData().status).toBe('error');
  expect(res._getJSONData().message).toBe('This role might have been removed');
});

it('should return 404 if resource is not found or deleted', async () => {
  const roleId = 'dbb03fc0-f9f8-11ed-b1a7-2b4a86e282f4';
  // create a mock request object
  const req:UserRequest = httpMock.createRequest({
    method: 'GET',
    url: '/invalid-resource',
    roleId: roleId,
    originalUrl: '/invalid-resource',
  });

  // create a mock response object
  const res = httpMock.createResponse();

  // create a mock next function
  const next = jest.fn();

  // call the roleAuchCheck middleware function
  await roleAuchCheck(req, res, next);

  // check the response status code and message
  expect(res.statusCode).toBe(404);
  expect(res._getJSONData().status).toBe('error');
  expect(res._getJSONData().message).toBe('Invalid Resource!');
});



// add more test cases for other scenarios