exports.handler = async () => {
  try {
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