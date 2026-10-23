require("dotenv").config();

const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");

const client = new MongoClient(
    process.env.MONGO_URI
);

async function createAdmin() {
    try {
        await client.connect();

        const db = client.db(
            process.env.DB_NAME
        );

        const admins = db.collection("admins");

        const email = "admin@gmail.com";
        const password = "Admin@123";

        const existingAdmin = await admins.findOne({
            email: email
        });

        if (existingAdmin) {
            console.log("Admin already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        await admins.insertOne({
            name: "Admin",
            email: email,
            password: hashedPassword
        });

        console.log("Admin created successfully.");
        console.log("Email:", email);
        console.log("Password:", password);

    } catch (error) {
        console.log("Error:", error);
    } finally {
        await client.close();
    }
}

createAdmin();