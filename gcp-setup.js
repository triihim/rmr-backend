const fs = require("fs");

fs.writeFileSync(process.env.GCP_CREDENTIALS_PATH, JSON.stringify(JSON.parse(process.env.GCP_CREDENTIALS)));
