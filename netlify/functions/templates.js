exports.handler = async () => {
  const templates = ["Diwali.html", "offer.html"];

  return {
    statusCode: 200,
    body: JSON.stringify(templates),
  };
};