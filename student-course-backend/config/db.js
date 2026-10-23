const { MongoClient }=require("mongodb");
const client=new MongoClient(process.env.MONGO_URI);

let database;

async function connectDB(){
    await client.connect();

    database=client.db(process.env.DB_NAME);

    console.log("MongoDB connected Successfully");

}

function getDB(){
    return database;
}

module.exports={
    connectDB,
    getDB
};