// ============  CORS Config ==========
//Insert trusted BaseUrl on whitelist array
var whitelist = ['http://localhost', 'http://localhost:8081/api/view_mail'];

// Cors check...
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};
app.use(cors(corsOptions));