const { MongoClient, ObjectId } = require("mongodb");

let client;

exports.handler = async (event) => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing");
    }

    if (!client) {
      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
    }

    const db = client.db("travel");

    // ✅ GET all contacts
    if (event.httpMethod === "GET") {
      const contacts = await db
        .collection("contacts")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return {
        statusCode: 200,
        body: JSON.stringify(contacts),
      };
    }

    // ✅ DELETE contact
    if (event.httpMethod === "DELETE") {
      const id = event.queryStringParameters.id; 

      await db.collection("contacts").deleteOne({
        _id: new ObjectId(id),
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Deleted" }),
      };
    }

    return { statusCode: 405, body: "Method not allowed" };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};