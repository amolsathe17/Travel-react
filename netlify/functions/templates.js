const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  try {
    // ✅ stable root path
    const templatesDir = path.resolve(
      process.cwd(),
      "netlify/functions/templates"
    );

    console.log("Templates path:", templatesDir);

    if (!fs.existsSync(templatesDir)) {
      throw new Error("Templates folder not found");
    }

    const files = fs.readdirSync(templatesDir);

    const htmlFiles = files.filter((f) =>
      f.toLowerCase().endsWith(".html")
    );

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