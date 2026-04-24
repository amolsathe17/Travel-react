const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  try {
    // ✅ Absolute path from project root
    const templatesDir = path.resolve(
      process.cwd(),
      "netlify/functions/templates"
    );

    console.log("Looking for templates in:", templatesDir);

    // ✅ Check existence
    if (!fs.existsSync(templatesDir)) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Templates folder NOT found",
          path: templatesDir,
        }),
      };
    }

    // ✅ Read files
    const files = fs.readdirSync(templatesDir);

    const htmlFiles = files.filter((file) =>
      file.toLowerCase().endsWith(".html")
    );

    return {
      statusCode: 200,
      body: JSON.stringify(htmlFiles), // MUST be array
    };
  } catch (err) {
    console.error("TEMPLATES ERROR:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};