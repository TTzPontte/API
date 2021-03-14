Feature: Simulation

Background:
    * url hostECred + '/v1/offers'
    * def simulation = read('simulation.json')
    * def simulation_response = read('simulation_response.json')

Scenario: Create a new simulation
Given request simulation
And header Accept = 'application/json'
And header Authorization = hostECredAuth
When method post
Then status 201
And match response[0] == simulation_response