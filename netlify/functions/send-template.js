const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Mongo users (example)
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

exports.handler = async (event) => {
  try {
    const { templateName } = JSON.parse(event.body);

    // ✅ 1. Load HTML file
    const filePath = path.join(
      __dirname,
      "templates",
      templateName
    );

    const htmlContent = fs.readFileSync(filePath, "utf-8");

    // ✅ 2. Get users from MongoDB
    const client = new MongoClient(uri);
    await client.connect();

    const users = await client
      .db("yourDB")
      .collection("subscribers")
      .find({})
      .toArray();

    // ✅ 3. Setup mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    // ✅ 4. Send email to all users
    for (let user of users) {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Special Offer 🎉",
        html: htmlContent, // 🔥 THIS sends HTML template
      });
    }

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Emails sent" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};