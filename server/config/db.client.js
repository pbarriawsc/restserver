const { Client } = require('pg');
const dbConfig= require('./db.config');
//var connectionString = "postgres://postgres:wsc2020@localhost:5432/wscargo";
/*const client = new Client({
    connectionString: connectionString
});*/

const client=new Client({
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database:dbConfig.DB
});

client.connect();
module.exports=client;