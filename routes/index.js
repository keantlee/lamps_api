const path = require('path');
const { readdir } = require('fs');

// MODULAR 
module.exports = function(app){

    readdir(
        path.resolve(__dirname,'../modules'),
        (err, files) => {
          if (err) throw err;
            
          for (let file of files) {
                
                app.use('',require(`../modules/${file}/route`));            
                    
          }
        }
      );
}