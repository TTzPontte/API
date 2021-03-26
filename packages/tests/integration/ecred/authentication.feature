Feature: ECred API Authorization

Scenario: Request without api key
Given url hostECred +  '/v1/contract'
And header Accept = 'application/json'
And request { }
When method POST
Then status 401
And match response == { "message": "Unauthorized" }

Scenario: Request with api key
Given url hostECred +  '/v1/contract'
And header Accept = 'application/json'
And header Authorization = hostECredAuth
And request { }
When method POST
Then status 400