var {EntitySchema} = require("typeorm");

module.exports =  new EntitySchema({
    name: "Roles", // Will use table name `Roles` as default behaviour.
    tableName: "roles", // Optional: Provide `tableName` property to override the default behaviour for table name.
    columns: {
        role_id: {
            primary: true,
            type: "int",
            generated: true
        },
        role: {
            type: "varchar"
        },
        rfo_use: {
            type: "enum",
            enum: ["1", "0"],
            default: '0'
        },
    },
    relations: {
        user_access: {
            target: "UserAccess",
            type: 'many-to-one', // Assuming one-to-one relation with UserAccess
            joinColumn: {
                name: 'role_id'
            }
        }
    }
});