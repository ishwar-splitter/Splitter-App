require("dotenv").config();

const { fetchAndSetSecrets } = require("./fetchSecrets");

const secretName = "ishwar-splitter-secret";

fetchAndSetSecrets(secretName)
  .then(() => {
    console.log(process.env);

    const express = require("express");
    const app = express();
    const cors = require("cors");
    const routes = require("./routes");

    app.use(express.json());

    const corsOptions = {
      credentials: true,
      origin: ["http://localhost:3000", "https://splitter_frontend:3000"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
      allowedHeaders: ["Content-Type", "Authorization"],
    };

    app.use(cors(corsOptions));

    app.use("/api", routes);

    const port = process.env.PORT || 4000; // Set a default port if PORT is not in environment variables
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error fetching and setting secrets:", error);
  });
