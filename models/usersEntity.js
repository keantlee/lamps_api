var {EntitySchema} = require("typeorm");

module.exports =  new EntitySchema({
    name: "Users", // Will use table name `Users` as default behaviour. // Call "Users" name entity to used this table
    tableName: "users", // Optional: Provide `tableName` property to override the default behaviour for table name.
    columns: {
        user_id: {
            primary: true,
            type: "varchar"
        },
        username: {
            type: "varchar"
        },
        password: {
            type: "varchar"
        },
        password_reset_status: {
            type: "tinyint"
        },
        password_expired_status: {
            type: "timestamp"
        },
        email: {
            type: "varchar"
        },
        reg: {
            type: "tinyint"
        }, 
        prov: {
            type: "tinyint"
        },
        mun: {
            type: "tinyint"
        }, 
        bgy: {
            type: "smallint"
        },
        first_name: {
            type: "varchar"
        },
        middle_name: {
            type: "varchar"
        },
        last_name: {
            type: "varchar"
        },
        ext_name: {
            type: "varchar"
        },
        contact_no: {
            type: "varchar"
        },
        first_login: {
            type: "enum",
            enum: ["1", "0"],
            default: null
        },
        date_created: {
            type: "timestamp"
        },
        isusepin: {
            type: "tinyint"
        },
        status: {
            type: "enum",
            enum: ["0", "1", "2"],
            default: null
        },
        is_created: {
            type: "tinyint"
        }
    },
    relations: {
        user_access: {
            target: "UserAccess",
            type: 'one-to-many',
            inverseSide: 'users' // relation to users table on userAccessEntity
        },
    }
});