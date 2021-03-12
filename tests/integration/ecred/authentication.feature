Feature: API Authorization

Scenario: Request without api key
Given url hostECred +  '/v1/contract'
And header Accept = 'application/json'
When method get
Then status 403
And match response == { message: 'Missing Authentication Token' }

Scenario: Request with api key
Given url hostECred +  '/v1/contract'
And header Accept = 'application/json'
And header Authorization = hostECredAuth
When method get
Then status 404
And match response == { message: 'Missing Authentication Token' }