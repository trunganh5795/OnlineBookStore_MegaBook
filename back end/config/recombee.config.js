var recombee = require("recombee-api-client");
var rqs = recombee.requests;
var clientRecombee = new recombee.ApiClient(
  process.env.RECOMBEE_DATABASE,
  process.env.RECOMBEE_SECRET_KEY,
  { region: process.env.RECOMBEE_REGION }
);
module.exports = {
  clientRecombee,
  rqs,
};
