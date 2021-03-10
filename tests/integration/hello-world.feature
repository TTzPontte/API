Feature: API Authorization
Scenario: Request without api key

Given url host +  '/v1/contract'
And header Accept = 'application/json'
When method get
Then status 403
And match response == { message: 'Missing Authentication Token' }