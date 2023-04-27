const whitelist = [
  "http://localhost:3000",
  "http://localhost:3002",
  "https://magabook.shop",
  "http://magabook.shop",
  "https://checkout.stripe.com",
];
const corsConfig = {
  // Configures the Access-Control-Allow-Origin
  // origin: process.env.CORS_ORIGIN,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("CORS blocked"); //
      callback(new Error("Not allowed by CORS"));
    }
  },

  // Configures the Access-Control-Allow-Methods
  methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",

  //Configures the Access-Control-Allow-Headers
  allowedHeaders:
    // 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept",

  // Configures the Access-Control-Allow-Credentials
  credentials: true,

  //Configures the Access-Control-Expose-Headers
  exposedHeaders: "Content-Range,X-Content-Range,Authorization",

  // Provides a status code to use for successful OPTIONS requests
  optionsSuccessStatus: 200,
};

module.exports = corsConfig;
