module.exports.user = {
    tableName: "registered_user",
    columns: {
        userId: "user_id",
        email: "email",
        passwordHash: "password_hash"
    }
}

module.exports.device = {
    tableName: "device",
    columns: {
        deviceId: "device_id",
        userId: "user_id"
    }
}