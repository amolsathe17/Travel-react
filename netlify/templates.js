exports.handler = async (event) => {
  try {
    // Allow only GET
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        body: "Method Not Allowed",
      };
    }

    // Static templates (you can later move to DB)
    const templates = [
      "Welcome Template",
      "Offer Template",
      "Reminder Template",
    ];

    return {
      statusCode: 200,
      body: JSON.stringify(templates),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};