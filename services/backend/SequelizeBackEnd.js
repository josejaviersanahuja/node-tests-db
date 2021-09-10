/* eslint-disable camelcase */
/**
 * Lets store all pokemons in relational tables
 * using sequelize
 */

const Sequelize = require('sequelize')

const sql = {}
// A config object that normaly stays in a different folder.
// but this is an example learning excercise
sql.mySqlConfig = {
    options: {
        host: "localhost",
        port: 3406,
        database: "pokemons",
        dialect: "mysql",
        username: "root",
        password: process.env.MY_PASSWORD
    },
    client: null
}

sql.connectToMySql = async () => {
    console.time('connecting-sequelize')
    const sequelize = new Sequelize(sql.mySqlConfig.options)
    try {
        await sequelize.authenticate()
        console.log('Succesfully connected to MySql');
        console.timeEnd('connecting-sequelize')
        return sequelize

    } catch (error) {
        console.log(error);
        console.timeEnd('connecting-sequelize')
        process.exit(1)
        return false
    }
}

sql.PokemonsModel = async (sequelize = sql.mySqlConfig.client) => {
    console.time('building-models')
    const pokemon = sequelize.define("Pokemon", {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true
        },
        name: Sequelize.DataTypes.STRING
    })

    const pokemon_Stats = sequelize.define("Stats", {
        base_attack: Sequelize.DataTypes.INTEGER,
        base_defense: Sequelize.DataTypes.INTEGER,
        base_stamina: Sequelize.DataTypes.INTEGER,
        form: Sequelize.DataTypes.STRING,
        pokemon_id: Sequelize.DataTypes.INTEGER,
        pokemon_name: Sequelize.DataTypes.STRING,
        id: {
            type: Sequelize.DataTypes.STRING,
            primaryKey: true
        }
    })

    const pokemons_Attacks = sequelize.define("Attacks", {
        charged_moves: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            get() {
                return this.getDataValue('charged_moves').split(';')
            },
            set(val) {
                return this.setDataValue('charged_moves', val.join(';'))
            }
        },
        elite_charged_moves: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            get() {
                return this.getDataValue('elite_charged_moves').split(';')
            },
            set(val) {
                return this.setDataValue('elite_charged_moves', val.join(';'))
            }
        },
        elite_fast_moves: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            get() {
                return this.getDataValue('elite_fast_moves').split(';')
            },
            set(val) {
                return this.setDataValue('elite_fast_moves', val.join(';'))
            }
        },
        fast_moves: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            get() {
                return this.getDataValue('fast_moves').split(';')
            },
            set(val) {
                return this.setDataValue('fast_moves', val.join(';'))
            }
        },
        form: Sequelize.DataTypes.STRING,
        pokemon_id: Sequelize.DataTypes.INTEGER,
        pokemon_name: Sequelize.DataTypes.STRING,
        id: {
            type: Sequelize.DataTypes.STRING,
            primaryKey: true
        }
    })

    pokemon.hasMany(pokemon_Stats)
    pokemon.hasMany(pokemons_Attacks)
    pokemon_Stats.belongsTo(pokemon, {
        onDelete: "CASCADE",
        foreignKey: {
            allowNull: false
        }
    })
    pokemons_Attacks.belongsTo(pokemon, {
        onDelete: "CASCADE",
        foreignKey: {
            allowNull: false
        }
    })

    await sequelize.sync()
    console.timeEnd('building-models')
    return { pokemon, pokemon_Stats, pokemons_Attacks }
}

module.exports = sql