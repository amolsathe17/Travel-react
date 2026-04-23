const { MongoClient } = require("mongodb");

let client;

exports.handler = async (event) => {
  try {
    // Allow only POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed",
      };
    }

    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing fields" }),
      };
    }

    // Check env variable
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not set");
    }

    // Connect DB
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
      body: JSON.stringify({
        token: "admin123",
      }),
    };
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};