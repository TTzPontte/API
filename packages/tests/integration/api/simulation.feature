Feature: Simulation

Scenario: Create a new simulation
* karate.set('simulation', "call read 'simulation.json'")
Given url host 
And path 'simulation'
And header Accept = 'application/json'
And header Authorization = authHeader
And request signedFile('simulation.json')
When method POST
Then status 201