const mongoose = require('mongoose');

async function testConn() {
    const url = "mongodb+srv://lithiaautos4_db_user:Ogc12lZUoknde2uE@cluster0.ppcxxsk.mongodb.net/?appName=Cluster0";
    console.log('Testing connection to:', url.split('@')[1]);
    try {
        await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Successfully connected to MongoDB');
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
}

testConn();
