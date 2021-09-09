/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const mysql = require('mysql2')
const CoinAPI = require('../CoinAPI');
require('dotenv').config()

class MySQLBackend {

  constructor() {
    this.coinAPI = new CoinAPI();
    this.connection = null
  }

  async connect() {
    this.connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3406,
      password: process.env.MY_PASSWORD,
      database: "maxcoin"
    })
    return this.connection
  }

  async disconnect() {
    this.connection.end()
  }

  async insert() {
    const data = await this.coinAPI.fetch()
    const sql = "INSERT INTO coinvalues (valuedate, coinvalue) VALUES ?"
    const values = []
    Object.keys(data.bpi).forEach(ele => {

      values.push([ele, data.bpi[ele]])
    })
    return this.connection.promise().query(sql, [values])
  }

  async getMax() {
    return this.connection.promise().query(
      "SELECT * FROM coinvalues ORDER by coinvalue DESC LIMIT 0,1"
    )
  }

  async max() {
    // we show that we try to connect
    console.info('Connecting to mysql db...');
    // we check the performance
    console.time('mysql-db-connect')

    // we try the connection 
    await this.connect()
    // connection success
    console.log("Successfully connected to mysql db");
    console.timeEnd('mysql-db-connect')

    // we show that we send data to mysqlDB
    console.info('Inserting data...');
    // we check the performance
    console.time('mysql-db-insert')
    const res = await this.insert()
    console.timeEnd('mysql-db-insert')

    console.info(res[0].affectedRows, ' inserted');

    // we get the maximum value    
    console.info('Finding the maximum value');
    // we check the performance
    console.time('mysql-db-getmax')
    const max = await this.getMax()
    const row = max[0][0]
    console.timeEnd('mysql-db-getmax')

    console.info(row, ' This is the maximum value');

    // now we disconnect
    // lets close the connection
    // we show that we try to disconnect

    console.info('Disconnecting to mysql db...');
    // we check the performance
    console.time('mysql-db-disconnect')
    await this.disconnect()
    console.log("Successfully Disconnected to mysql db");
    console.timeEnd('mysql-db-disconnect')

  }
}

module.exports = MySQLBackend;