const {DataSource} = require('typeorm');
const mysql        = require('mysql2');


global.lampsDev41Connection = new DataSource({
    type: "mysql",
    host: "172.16.200.41",
    port: 3306,
    username: "lamps_db",
    password: "0Mx8JE4u*di3af&N",
    database: "lamps_db",
    entities: [
        require('../models/usersEntity'),
        require('../models/otpEntity'),
        require('../models/rolesEntity'),
        require('../models/userAccessEntity')
    ],
})

lampsDev41Connection.initialize()
    .then((res) => {
        console.log("Database connection to Lamps development database is successfully established")
    })
    .catch((err) => {
        console.error("Database connection to Lamps development database has not established!", err)
    })