/** *************************************
 *    Method to run the CoinAPI.js  
 *    and store the results using redi 
 * *********************************** */

const RedisBackend = require('./services/backend/RedisBackend')

const run = async () => {
  const redisBackend = new RedisBackend()
  return redisBackend.max()
}

run()
  .then(() => {
    // console.log(Object.entries(res));
  })
  .catch(err => {
    console.error(err);
  })

/** *************************************
 *    Method to run the CoinAPI.js
 *    and store the results using mongodb
 * *********************************** */
/*
const MongoBackend = require('./services/backend/MongoBackend')

const run = async () => {
  const mongoBackend = new MongoBackend()
  return mongoBackend.maxPromise()
}

run()
  .then(() => {
    // console.log(Object.entries(res));
  })
  .catch(err => {
    console.error(err);
  })
 */


/** *************************************
 *    Method to run the CoinAPI.js
 *    and console log the results
 * *********************************** */

/* const CoinAPI = require("./services/CoinAPI");

async function run() {
  const coinAPI = new CoinAPI();
  return coinAPI.fetch();
}

run()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => console.error(err)); */
