Feature: ECred Simulation
Background:
* def simulation = read('simulation.json')
* def simulation_response = read('simulation_response.json')

Scenario: Create a new simulation
Given url hostECred
And path 'offers'
And header Accept = 'application/json'
And header Authorization = authHeaderECred
And request simulation
When method POST
Then status 201
And match response[0] == simulation_response