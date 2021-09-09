/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const { MongoClient } = require('mongodb')
const CoinAPI = require('../CoinAPI');

// class will define the CoinAPI class , a client that need an url connection to a database, and a collection of values
// initialy, client and collection are null
class MongoBackend {

  constructor() {
    this.coinAPI = new CoinAPI();
    this.mongoUrl = "mongodb://localhost:37017/maxcoin"
    this.client = null
    this.collection = null
  }

  // connect: method that connects our new class to the database and defines the database and collection
  // return the conecction
  async connect() {
    // we create the client
    const mongoClient = new MongoClient(this.mongoUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    // we connect
    this.client = await mongoClient.connect()
    // define the DB and collection
    this.collection = this.client.db("maxcoin").collection("values")
    // return the connection
    return this.client
  }

  async disconnect() {
    if (this.client) {
      return this.client.close()
    }
    return false
  }

  async insert() {
    const res = await this.coinAPI.fetch()
    const { bpi } = res

    const documents = Object.keys(bpi).map(ele => {

      return {
        date: ele,
        value: bpi[ele]
      }
    })

    return this.collection.insertMany(documents)
  }


  async getMax() {
    return this.collection.findOne({}, { sort: { value: -1 } })
  }

  async max() {
    // we show that we try to connect
    console.info('Connecting to mongo db...');
    // we check the performance
    console.time('mongo-db-connect')

    // we try the connection 
    await this.connect()
    // connection success
    console.log("Successfully connected to mongo db");
    console.timeEnd('mongo-db-connect')

    // we show that we send data to MONGODB
    console.info('Inserting data...');
    // we check the performance
    console.time('mongo-db-insert')
    const res = await this.insert()
    console.timeEnd('mongo-db-insert')

    console.info(res.insertedCount, ' inserted');

    // we get the maximum value    
    console.info('Finding the maximum value');
    // we check the performance
    console.time('mongo-db-getmax')
    const max = await this.getMax()
    console.timeEnd('mongo-db-getmax')

    console.info(max, ' This is the maximum value');

    // now we disconnect
    // lets close the connection
    // we show that we try to disconnect

    console.info('Disconnecting to mongo db...');
    // we check the performance
    console.time('mongo-db-disconnect')
    await this.disconnect()
    console.log("Successfully Disconnected to mongo db");
    console.timeEnd('mongo-db-disconnect')

  }

  maxPromise() {
    return new Promise((resolve, reject) => {
      // we show that we try to connect
      console.info('Connecting to mongo db...');
      // we check the performance
      console.time('mongo-db-connect')

      // we try the connection 
      this.connect()
        .then(() => {
          // connection success
          console.log("Successfully connected to mongo db");
          console.timeEnd('mongo-db-connect')

          // we show that we send data to MONGODB
          console.info('Inserting data...');
          // we check the performance
          console.time('mongo-db-insert')
          this.insert()
            .then(res => {
              console.timeEnd('mongo-db-insert')
              console.log('--------------------', res.insertedCount, ' documents inserted');

              // now lets find the max value
              console.log('Now lets get the maximum value');
              console.time('mongo-db-getmax')
              this.getMax()
                .then(max => {
                  console.log('-------------');
                  console.log(max, ' this is the maximum value');
                  console.log('-------------');
                  console.timeEnd('mongo-db-getmax')
                  // lets close the connection
                  // we show that we try to disconnect
                  console.info('Disconnecting to mongo db...');
                  // we check the performance
                  console.time('mongo-db-disconnect')
                  this.disconnect()
                    .then(() => {
                      // disconnection success
                      console.log("Successfully Disconnected to mongo db");
                      console.timeEnd('mongo-db-disconnect')
                      resolve()
                    })
                    .catch(err => {
                      // show that we couldnt disconnect and why
                      console.log("Disconnection to mongo db failed.");
                      console.timeEnd('mongo-db-disconnect')
                      // maybe we want to throw for later, maybe not?
                      reject(err)
                    })
                })
                .catch(err => {
                  console.log('error getting the maximum value');
                  reject(err)
                })

            })
            .catch(err => {
              console.log('Error saving documents in mongoDB ');
              reject(err)
            })
        })
        .catch(err => {
          // show that we couldnt connect and why
          console.log('Connection to mongo db failed');
          console.timeEnd('mongo-db-connect')
          // maybe we want to throw for later, maybe not?
          reject(err)
        })

    })
  }
}


module.exports = MongoBackend;