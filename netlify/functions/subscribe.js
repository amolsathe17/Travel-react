const { MongoClient } = require("mongodb");

let client;

exports.handler = async (event) => {
  try {
    // Only allow POST request
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed",
      };
    }

    // Get data from frontend
    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email is required" }),
      };
    }

    // Connect to MongoDB (from Netlify env variable)
    if (!client) {
      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
    }

    const db = client.db("travel"); // 👉 change DB name if you want

    // Save email in "subscribers" collection
    await db.collection("subscribers").insertOne({
      email,
      createdAt: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Subscribed successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};