Feature: API Authorization
Background:
* def jwtLib = read('jsrsasign-all-min.js');
* def jwtHeader = authHeader(jwtLib);

Scenario: Request without api key
Given url host +  '/v1/contract'
And header Accept = 'application/json'
And request { }
When method POST
Then status 401

Scenario: Request with api key but no payload in body
Given url host +  '/v1/contract'
And header Accept = 'application/json'
And header Authorization = jwtHeader
And request { }
When method POST
Then status 401

Scenario: Request with api key but wrong body
Given url host +  '/v1/contract'
And header Accept = 'application/json'
And header Authorization = jwtHeader
And request signedBody(jwtLib, { })
When method POST
Then status 400