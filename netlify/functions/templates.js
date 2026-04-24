const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  try {
    const templatesDir = path.join(__dirname, "templates");

    console.log("Reading from:", templatesDir);

    // ✅ Check if folder exists
    if (!fs.existsSync(templatesDir)) {
      throw new Error("Templates folder not found");
    }

    // ✅ Read files
    const files = fs.readdirSync(templatesDir);

    // ✅ Filter only HTML
    const htmlFiles = files.filter((file) =>
      file.endsWith(".html")
    );

    console.log("Templates found:", htmlFiles);

    return {
      statusCode: 200,
      body: JSON.stringify(htmlFiles),
    };
  } catch (err) {
    console.error("ERROR:", err.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};