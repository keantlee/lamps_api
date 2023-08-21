var {EntitySchema} = require("typeorm");

module.exports =  new EntitySchema({
    name: "UserAccess", // Will use table name `UsersOtp` as default behaviour.
    tableName: "user_access", // Optional: Provide `tableName` property to override the default behaviour for table name.
    columns: {
        user_access_id: {
            primary: true,
            type: "int",
            generated: true
        },
        user_id: {
            primary: true,
            type: "varchar"
        },
        role_id: {
            type: "int",
        },
        date_created: {
            type: "timestamp"
        },
        status: {
            type: "tinyint",
        },
    },
    relations: {
        users: {
            target: "Users", //  Users table
            type: 'many-to-one',
            joinColumn: {
                name: 'user_id' // Foreign Key
            }
        },
        role_type: {
            target: "Roles", // Roles table
            type: 'one-to-one',
            joinColumn: {
                name: 'role_id' // Foreign Key
            }
        }
    }
});