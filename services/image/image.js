const db = require("../../data/db-access");
const {Storage} = require('@google-cloud/storage');

async function getFileNamesByPrefix(prefix) {
    const storage = new Storage({projectId: process.env.GCP_PROJECT_ID, keyFilename: process.env.GCP_CREDENTIALS_FILENAME});
    const options = {
      prefix: prefix,
    };
    const [files] = await storage.bucket(process.env.BUCKET_NAME).getFiles(options);
    const filenames = files.map(f => f.name.split("/")[1]);
    return filenames;
  }

async function getUserDeviceImages(email) {
    try {
        const deviceImages = [];
        const devices = await db.getUserDevices(email);
        for(let i = 0; i < devices.length; i++) {
            const filenames = await getFileNamesByPrefix(devices[i]);
            const images = { 
                device: devices[i],
                images: filenames
            };
            deviceImages.push(images);
        }
        return deviceImages;
    } catch (error) {
        throw error;
    }
}

async function generateV4ReadSignedUrl(filename) {
    const storage = new Storage({projectId: process.env.GCP_PROJECT_ID, keyFilename: process.env.GCP_CREDENTIALS_FILENAME});
    
    const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    const [url] = await storage
    .bucket(process.env.BUCKET_NAME)
    .file(filename)
    .getSignedUrl(options);

    return url;
}

module.exports.getUserDeviceImages = getUserDeviceImages;
module.exports.getSignedUrl = generateV4ReadSignedUrl;