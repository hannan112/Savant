const mongoose = require('mongoose');

const uri = "mongodb+srv://hannanhaxor088:hannan_mongoDB@savant.fczz6q7.mongodb.net/?appName=Savant";

console.log("Testing connection to:", uri.replace(/:([^:@]+)@/, ":****@"));

mongoose.connect(uri)
    .then(() => {
        console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ FAILED: Could not connect.");
        console.error(err.message);
        process.exit(1);
    });
