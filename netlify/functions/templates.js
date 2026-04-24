const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  try {
    // ✅ correct folder path
    const templatesDir = path.join(__dirname, "templates");

    console.log("Checking folder:", templatesDir);

    // ❌ folder not found = clear error
    if (!fs.existsSync(templatesDir)) {
      throw new Error("Templates folder not found at " + templatesDir);
    }

    // 📂 read files
    const files = fs.readdirSync(templatesDir);

    // only html files
    const htmlFiles = files.filter((f) =>
      f.toLowerCase().endsWith(".html")
    );

    return {
      statusCode: 200,
      body: JSON.stringify(htmlFiles),
    };
  } catch (err) {
    console.error("Templates error:", err.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};