const schema = require("./schema");
const sql = require("./helpers/sql");

async function insertUser({email, passwordHash}) {
    const table = schema.user.tableName;
    const emailCol = schema.user.columns["email"];
    const passwordCol = schema.user.columns["passwordHash"];

    const query = `INSERT INTO ${table} (${emailCol}, ${passwordCol}) VALUES ('${email}', '${passwordHash}');`;

    try {
        return await sql.query(query);
    } catch (error) {
        throw error;
    }
}

async function insertDevice({deviceId, ownerEmail}) {
    const deviceTable = schema.device.tableName;
    const idCol = schema.device.columns["deviceId"];
    const userCol = schema.device.columns["userId"];
    const userTable = schema.user.tableName;
    const userEmailCol = schema.user.columns["email"];
    const userIdCol = schema.user.columns["userId"];

    const query = `INSERT INTO ${deviceTable} (${idCol}, ${userCol}) VALUES 
        ('${deviceId}', (SELECT ${userIdCol} FROM ${userTable} WHERE ${userEmailCol}='${ownerEmail}'));`;

    try {
        return await sql.query(query);
    } catch (error) {
        throw error;
    }

}

async function getUserDevices(email) {
    //select device_id from device where user_id=(select user_id from registered_user where email='test@test.com');
    const deviceTable = schema.device.tableName;
    const userTable = schema.user.tableName;
    const deviceIdCol = schema.device.columns["deviceId"];
    const userIdCol = schema.user.columns["userId"];
    const emailCol = schema.user.columns["email"];

    const query = `SELECT ${deviceIdCol} FROM ${deviceTable} 
    WHERE ${userIdCol}=(SELECT ${userIdCol} FROM ${userTable} WHERE ${emailCol}='${email}');`;

    try {
        const result = await sql.query(query);
        const devices = result.rows.map(d => d[deviceIdCol]);
        return devices;
    } catch (error) {
        throw error;
    }
}

async function getUserPasswordHash(email) {
    const table = schema.user.tableName;
    const emailCol = schema.user.columns["email"];
    const passwordCol = schema.user.columns["passwordHash"];

    const query = `SELECT ${passwordCol} FROM ${table} WHERE ${emailCol}='${email}';`;

    try {
        const result = await sql.query(query);
        const hash = result.rows[0][passwordCol];
        if(!hash) throw error;
        return hash;
    } catch (error) {
        throw error;
    }
}

module.exports.insertUser = insertUser;
module.exports.getUserPasswordHash = getUserPasswordHash;
module.exports.insertDevice = insertDevice;
module.exports.getUserDevices = getUserDevices;