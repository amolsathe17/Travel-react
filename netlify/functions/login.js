const { MongoClient } = require("mongodb");

let client;

exports.handler = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found");
    }

    if (!client) {
      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
    }

    const db = client.db("travel");

    const user = await db.collection("users").findOne({ username });

    if (!user || user.password !== password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid login" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ token: "admin123" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};