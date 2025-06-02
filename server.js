const client = require('./db');

const app = require('./app.js');
const port = process.env.PORT || 3000;

client.connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
    process.exit(1); // Exit with error
  });
