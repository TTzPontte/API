Feature: Contract

Scenario: Failed to create an empty contract
Given url host
And path 'contract'
And header Accept = 'application/json'
And header Authorization = authHeader
And request signedBody({ })
When method POST
Then status 400

Scenario: Register new contract
Given url host
And path 'contract'
And header Accept = 'application/json'
And header Authorization = authHeader
And request signedFile('contract.json')
When method POST
Then status 201