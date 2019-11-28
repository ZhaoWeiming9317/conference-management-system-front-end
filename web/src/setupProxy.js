const proxy = require('http-proxy-middleware');
 
module.exports = function (app) {
  app.use(
      proxy(
          '/api',
          {
            target: 'http://39.100.240.141:8080',
            secure: false,
            changeOrigin: true,
            pathRewrite: {
             "^/api": ""
            },     
          }
      )
  );
};
