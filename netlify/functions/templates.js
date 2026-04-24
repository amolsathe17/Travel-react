exports.handler = async () => {
  try {
    const templates = [
      "offer1.html",
      "offer2.html",
      "offer3.html"
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