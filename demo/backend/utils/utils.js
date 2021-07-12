const {knex_config} = require("../config/config");
const knex = require('knex')(knex_config);

module.exports = knex;

