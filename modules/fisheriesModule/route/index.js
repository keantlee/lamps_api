const controller = require("../controller/fisheriesController");

route.get('/api/fisheries/index', controller.index);

module.exports = route;