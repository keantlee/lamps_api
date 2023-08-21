const controller = require("../controller/livestockController");

route.get('/api/livestock/index', controller.index);

module.exports = route;