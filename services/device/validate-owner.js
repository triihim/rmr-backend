const db = require("../../data/db-access");

async function validateDeviceOwnership(deviceId, email) {
    try {
        const userDevices = await db.getUserDevices(email);
        if(userDevices.includes(deviceId)) {
            return true;
        } else {
            return false;
        }
    } catch(error) {
        throw error;
    }
}

module.exports.validateDeviceOwnership = validateDeviceOwnership;