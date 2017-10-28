exports.handler = (event, context, callback) => {
  var soap = require('soap');

  method = event["context"]["resource-path"]
  querystring = event["params"]["querystring"]
  body = event["body-json"]


  soap.createClientAsync(process.env.SOAP_URL).then((client) => {
    return client[method](args);
  }).then((result) => {
    console.log(result);
    callback(null,result);
  })
  .catch(function(err) {
    callback(err);
  });
};