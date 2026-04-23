exports.handler = async (event) => {
  try {
    const { templateName } = JSON.parse(event.body);

    // 👉 here you can later integrate email sending

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Template ${templateName} sent`,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};