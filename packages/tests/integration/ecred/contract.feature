Feature: ECred Contract
Background:
* def contract = read('contract.json')
* def contract_response = read('contract_response.json')

Scenario: Unknown proposal
Given url hostECred
And path 'contract'
And header Accept = 'application/json'
And header Authorization = authHeaderECred
And request contract
When method POST
Then status 404