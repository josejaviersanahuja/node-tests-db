/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */

// const { promisify } = require('util')
const Redis = require('redis')
const CoinAPI = require('../CoinAPI');

class RedisBackend {

  constructor() {
    this.coinAPI = new CoinAPI();
    this.client = null
  }

  async connect() {
    const promise = new Promise((resolve, reject) => {
      // we show that we try to connect
      console.info('Connecting to Redis db...');
      // we check the performance
      console.time('redis-db-connect')
      this.client = Redis.createClient(7379)
      this.client.set("connected", "true", (err) => {
        if (!err) {
          console.log("Successfully connected to Redis db??? ", this.client.connected);
          console.timeEnd('redis-db-connect')
          resolve(true)
        } else {
          console.log("not connected");
          console.timeEnd('redis-db-connect')
          reject(err)
        }
      })

    })

    return promise
  }

  async disconnect() {
    return new Promise((resolve) => {
      this.client.quit((err, reply) => {
        if (!err) {
          resolve(true)
        } else {
          console.log(reply);
          resolve(false)
        }
      })
    })
  }

  async insert() {
    const data = await this.coinAPI.fetch()
    const values = ["maxcoin:values"]
    Object.keys(data.bpi).forEach(ele => {
      values.push(data.bpi[ele].toString())
      values.push(ele)
    })

    return new Promise((resolve, reject) => {
      this.client.zadd(values, (err, reply) => {
        if (!err) {
          console.log(reply, 'numero que significa');
          resolve(true)
        } else {
          console.log('Error inserting the set');
          reject(err)
        }
      })
    })

  }

  async getMax() {
    return new Promise((resolve, reject) => {
      this.client.zrange("maxcoin:values", -1, -1, "WITHSCORES", (err, reply) => {
        if (!err) {
          console.log(reply, ' Array con la clave del maximo elemento y el valor');
          resolve(true)
        } else {
          reject(err)
        }
      })
    })

  }

  async max() {

    // we try the connection 
    const isConnected = await this.connect()

    if (!isConnected) {
      console.log('bye bye');
      return
    }


    // we show that we send data to MONGODB
    console.info('Inserting data...');
    // we check the performance
    console.time('redis-db-insert')
    const res = await this.insert()
    console.timeEnd('redis-db-insert')

    console.info(' inserted? ', res);

    // we get the maximum value    
    console.info('Finding the maximum value');
    // we check the performance
    console.time('redis-db-getmax')
    await this.getMax()
    console.timeEnd('redis-db-getmax')

    // console.info(max, ' This is the maximum value');

    // now we disconnect
    // lets close the connection
    // we show that we try to disconnect

    console.info('Disconnecting to redis db...');
    // we check the performance
    console.time('redis-db-disconnect')
    const isDisconnected = await this.disconnect()
    if (!isDisconnected) {
      console.log('error disconnecting... bye bye');
      console.timeEnd('redis-db-disconnect')
      return
    }
    console.log("Successfully Disconnected from redis db");
    console.timeEnd('redis-db-disconnect')

  }

  async maxPromise() {

  }
}

module.exports = RedisBackend;