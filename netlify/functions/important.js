const { MongoClient, ObjectId } = require("mongodb");

let client;

exports.handler = async (event) => {
  try {
    const id = event.path.split("/").pop();

    if (!client) {
      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
    }

    const db = client.db("travel");

    await db.collection("contacts").updateOne(
      { _id: new ObjectId(id) },
      { $set: { important: true } }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Marked important" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};