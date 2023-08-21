var {EntitySchema} = require("typeorm");

module.exports =  new EntitySchema({
    name: "UsersOtp", // Will use table name `UsersOtp` as default behaviour.
    tableName: "user_otp", // Optional: Provide `tableName` property to override the default behaviour for table name.
    columns: {
        otp_id: {
            primary: true,
            type: "int",
            generated: true
        },
        user_id: {
            primary: true,
            type: "varchar"
        },
        otp: {
            type: "varchar"
        },
        date_created: {
            type: "timestamp"
        },
        status: {
            type: "enum",
            enum: ["1", "0"],
            default: '1'
        },
    },
});