const controller = require("../controller/cropsController");

route.get('/api/crops/index', controller.index);

module.exports = route;