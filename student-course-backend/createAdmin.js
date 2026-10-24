require("dotenv").config();

const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

async function createAdmin() {
    try {
        await client.connect();

        const db = client.db(process.env.DB_NAME);
        const admins = db.collection("admins");

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            throw new Error("Admin credentials are missing from .env");
        }

        const existingAdmin = await admins.findOne({ email });

        if (existingAdmin) {
            console.log("Admin already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await admins.insertOne({
            name: "Admin",
            email: email,
            password: hashedPassword
        });

        console.log("Admin created successfully.");
    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exitCode = 1;
    } finally {
        await client.close();
    }
}

createAdmin();