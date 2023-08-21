// Allow reading of request body
app.use(express.json());

// Allow reading of request urlencode
app.use(express.urlencoded({ extended: true }));