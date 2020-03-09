const fs = require("fs");

fs.writeFileSync(process.env.GCP_CREDENTIALS_PATH, process.env.GCP_CREDENTIALS);
