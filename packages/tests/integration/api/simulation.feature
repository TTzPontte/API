Feature: Simulation

Background:
* def jwtLib = read('jsrsasign-all-min.js');
* def simulation = read('simulation.json')
* def jwtHeader = authHeader(jwtLib);
* url host + '/v1/simulation'

Scenario: Create a new simulation
Given request simulation
And header Accept = 'application/json'
And header Authorization = jwtHeader
When method post
Then status 201