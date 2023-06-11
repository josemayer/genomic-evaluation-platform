function showRoutes(req, res, next) {
  res.json({
    message: 'Welcome, master database guys! Use the routes below to view examples of the API.',
    routes: [
      {
        method: 'GET',
        path: '/helloWorld',
        description: 'Returns a simple hello-world message.',
      },
      {
        method: 'GET',
        path: '/helloWorld/env',
        description: 'Returns a simple hello-world message with environment config variables.',
      },
      {
        method: 'GET',
        path: '/helloWorld/name/{any name}',
        description: 'Returns a simple hello-world message with the name provided.',
      },
      {
        method: 'GET',
        path: '/helloWorld/postgres',
        description: 'Returns a simple hello-world message with the names retrieved from a Postgres database.',
      },
      {
        method: 'GET',
        path: '/redis/get/{key}',
        description: 'Returns the value of the given key from redis'
      },
      {
        method: 'GET',
        path: '/redis/set/{key}/{value}',
        description: 'Sets the value of the key on redis'
      },
      {
        method: 'GET',
        path: '/redis/addCondition/{condition id}/{condition-prob}/{condition-string}',
        description: 
        `Adds a condition to the redis database. 
        Condition string is defined in the following format dnasequence:prob_in_pop:prob_given_seq. 
        They should be separated by by dashes.
        condition-prob: is the probability of a condition in the population.
        dnasequence: is a sequence of a | t | c | g.
        prob_in_pop: is the probability that the sequence appears in the population.
        prob_given_seq: is the probability that the condition occurs given the sequence.`,
        example: 
        `(/redis/addCondition/3/0.01/atcg:0.3:0.1-aattgcc:0.5:0.2-attgc:0.3:0.5)
        Adds a new condition to the redis database where the id of the condition is (1)
        the probability of the condition in the general population is (0.01) and the 
        condition has the 3 links between dna bases and probabilities. For instance, 
        the base (atcg) has a (0.3) probability of appearing in the general population.
        and if the person has the condition this sequence appears (0.1) percent of the times.`
      },
      {
        method: 'GET',
        path: '/redis/adduser/{user id}/{user-sequences}',
        description: 'Adds a new user to the redis database.'
      },
    ],
  });
}

module.exports = {
  showRoutes,
};
