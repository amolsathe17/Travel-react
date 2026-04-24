const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  try {
    const templatesDir = path.join(__dirname, "templates");

    console.log("Looking here:", templatesDir);

    if (!fs.existsSync(templatesDir)) {
      throw new Error("Templates folder not found at " + templatesDir);
    }

    const files = fs.readdirSync(templatesDir);
    const htmlFiles = files.filter(f => f.endsWith(".html"));

    return {
      statusCode: 200,
      body: JSON.stringify(htmlFiles),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};