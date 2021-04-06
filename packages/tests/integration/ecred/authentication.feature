Feature: ECred API Authorization

Scenario: Request without api key
Given url hostECred
And path 'contract'
And header Accept = 'application/json'
And request { }
When method POST
Then status 401
And match response == { "message": "Unauthorized" }

Scenario: Request with api key
Given url hostECred
And path 'contract'
And header Accept = 'application/json'
And header Authorization = authHeaderECred
And request { }
When method POST
Then status 400