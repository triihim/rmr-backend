const db = require("../../data/db-access");

async function registerDevice(deviceRegistrationObject) {
    try {
        await db.insertDevice(deviceRegistrationObject)
    } catch (error) {
        throw error;
    }
}

module.exports.registerDevice = registerDevice;