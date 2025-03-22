const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/shikpoosh';
const client = new MongoClient(uri);
let database;

module.exports = {
    async connect() {
        await client.connect();
        database = client.db();
        console.log('✅ MongoDB Connected');
    },
    collection(name) {
        return database.collection(name);
    }
};