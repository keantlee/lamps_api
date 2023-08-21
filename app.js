/**
 * Express server config
 */
// Get global components
require('./global/components');

require('dotenv').config();

// get global middleware / files
require('./middleware/jwt_auth_middleware');

// get database config
require('./config/database');

// get mail config
require('./config/mail');

// Get View Engine Setup
require('./view_engine/index');

// Get body-parser form request
require('./config/express_form_request_config')

// Get CORS config
// require('./config/cors');

// routes
require('./routes')(app); 

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is currently running on port: ${port}`);
});
