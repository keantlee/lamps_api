// ============  Set the views directory to include your module structure ==========

// View Engine Setup
app.set('view engine', 'ejs');

/**
 * get login module views
 * Path: ../modules/loginModule/views
 */
app.set('views', path.join(__dirname, '..', 'modules', 'loginModule', 'views'));

/**
 * get crops module views
 * Path: ../modules/cropModule/views
 */
// app.set('views', path.join(__dirname, '..', 'modules', 'cropsModule', 'views'));

/**
 * Serve static files from the 'public' folder
 * Path: ../public
 */
app.use(express.static(path.join(__dirname, '..', 'public')));