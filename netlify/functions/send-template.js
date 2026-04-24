const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { MongoClient } = require("mongodb");

exports.handler = async (event) => {
  try {
    const { templateName } = JSON.parse(event.body);

    if (!templateName) {
      throw new Error("No template selected");
    }

    // ✅ load HTML file
    const filePath = path.join(__dirname, "templates", templateName);

    if (!fs.existsSync(filePath)) {
      throw new Error("Template not found");
    }

    const htmlContent = fs.readFileSync(filePath, "utf-8");

    // ✅ get subscribers
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();

    const users = await client
      .db("yourDB")
      .collection("subscribers")
      .find({})
      .toArray();

    // ✅ mail setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    // ✅ send mail
    for (let user of users) {
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
      body: JSON.stringify({ message: "Emails sent" }),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};