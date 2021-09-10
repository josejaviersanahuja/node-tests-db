/* eslint-disable prefer-template */
/* eslint-disable camelcase */


/** *************************************
 *    Method to run sequelize.js  
 *    and store the pokemons jsons using mysql 
 *    into a relational DB
 * *********************************** */
require('dotenv').config()
const { connectToMySql, PokemonsModel } = require('./services/backend/SequelizeBackEnd')
const stats = require('./pokemons/pokemonsYstats.json')
const ataques = require('./pokemons/pokemonsYataques.json')

async function anonimo(pokToSave, i, tag) {
  try {
    await pokToSave.save()
    console.log(i, ' Pokemon stored in ', tag);
  } catch (error) {
    console.log(i, 'ERROR, IT COULD NOT BE STORED IN ', tag);
  }
}

async function storePokemons() {
  const mysql = await connectToMySql()
  // console.log(mysql);
  const { pokemon_Stats, pokemons_Attacks } = await PokemonsModel(mysql)
  await Promise.all(stats.map((pok, i) => {
    const pokToSave = pokemon_Stats.build({
      ...pok,
      PokemonId: pok.pokemon_id,
      id: pok.pokemon_id.toString() + ' ' + pok.pokemon_name + ' ' + pok.form
    })
    return anonimo(pokToSave, i, "STATS")
  }))

  await Promise.all(ataques.map((pok, i) => {
    const pokToSave = pokemons_Attacks.build({
      ...pok,
      PokemonId: pok.pokemon_id,
      id: pok.pokemon_id.toString() + ' ' + pok.pokemon_name + ' ' + pok.form
    })
    return anonimo(pokToSave, i, "POKEMONS_ATTTACKS")
  }))
}


try {
  storePokemons()
} catch (error) {
  console.log(error);
}


/** *************************************
 *    Method to run the CoinAPI.js
 *    and store the results using mysql
 * *********************************** */

/* const MySQLBackend = require('./services/backend/MySQLBackend')

const run = async () => {
  const mysqlBackend = new MySQLBackend()
  return mysqlBackend.max()
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
 *    and store the results using redi
 * *********************************** */

/* const RedisBackend = require('./services/backend/RedisBackend')

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
  }) */

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
