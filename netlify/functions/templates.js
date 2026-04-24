const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  try {
    const templatesDir = path.join(__dirname, "templates");

    // read all files
    const files = fs.readdirSync(templatesDir);

    // filter only .html
    const htmlFiles = files.filter((file) =>
      file.endsWith(".html")
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