Feature: API Authorization

Scenario: Request without api key
Given url host
And path 'contract'
And header Accept = 'application/json'
And request { }
When method POST
Then status 401

Scenario: Request with api key but no payload in body
Given url host
And path 'contract'
And header Accept = 'application/json'
And header Authorization = authHeader
And request { }
When method POST
Then status 401

Scenario: Request with api key but wrong body
Given url host
And path 'contract'
And header Accept = 'application/json'
And header Authorization = authHeader
And request signedBody({ })
When method POST
Then status 400