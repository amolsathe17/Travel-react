const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { MongoClient } = require("mongodb");

exports.handler = async (event) => {
  let client;

  try {
    const { templateName } = JSON.parse(event.body);

    if (!templateName) {
      throw new Error("Template not selected");
    }

    // ✅ SAFE PATH (works even if moved)
    const filePath = path.resolve(
      process.cwd(),
      "netlify/functions/templates",
      templateName
    );

    console.log("Template file:", filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error("Template file not found");
    }

    const htmlContent = fs.readFileSync(filePath, "utf-8");

    // ✅ DB
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();

    const users = await client
      .db("yourDB")
      .collection("subscribers")
      .find({})
      .toArray();

    // ✅ Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    for (let user of users) {
      if (!user.email) continue;

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Special Offer 🎉",
        html: htmlContent,
      });
    }

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Sent successfully 🚀" }),
    };
  } catch (err) {
    if (client) await client.close();

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};