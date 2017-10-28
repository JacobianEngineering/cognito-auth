// Modules, e.g. Webpack:
var AWSCognitoIdentity = require('amazon-cognito-identity-js');
var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');
var request = require('request-promise-native')
var pems;

// configuration
var iss = 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_rIvGvOH4J';
var userPoolId = 'us-east-1_rIvGvOH4J';
var clientId = '32gbbksbddes1o40hb31rjtgqk';

function downloadJwks() {
  return new Promise(function(resolve,reject) {
    if (!pems) {
      //Download the JWKs and save it as PEM
      request({
         url: iss + '/.well-known/jwks.json',
         json: true
       }, function (error, response, body) {
          if (!error && response.statusCode === 200) {
              pems = {};
              var keys = body['keys'];
              for(var i = 0; i < keys.length; i++) {
                  //Convert each key to PEM
                  var key_id = keys[i].kid;
                  var modulus = keys[i].n;
                  var exponent = keys[i].e;
                  var key_type = keys[i].kty;
                  var jwk = { kty: key_type, n: modulus, e: exponent};
                  var pem = jwkToPem(jwk);
                  pems[key_id] = pem;
              }
              //Now continue with validating the token
              console.log('JWKS Processed.')
              resolve(true)
          } else {
              //Unable to download JWKs, fail the call
              console.error(error)
              reject(error);
          }
      });
      }
  })
}

function validateTokens(tokens) {
  promises = []
  promises.push(validateToken(tokens.accessToken.jwtToken))
  promises.push(validateToken(tokens.idToken.jwtToken))

  return Promise.all(promises)
  .then(function() { return Promise.resolve(tokens) });
}

function validateToken(token) {
  return new Promise(function(resolve,reject) {
    var decodedJwt = jwt.decode(token, {complete: true});
        if (!decodedJwt) {
            console.error("Invalid token: " + token);
            reject("Unauthorized");
            return;
        }

        //Fail if token is not from your User Pool
        if (decodedJwt.payload.iss != iss) {
            console.error("Invalid issuer: " + decodedJwt.payload.iss);
            reject("Unauthorized");
            return;
        }

        //Get the kid from the token and retrieve corresponding PEM
        var kid = decodedJwt.header.kid;
        var pem = pems[kid];
        if (!pem) {
            console.error('Invalid Kid: ' + kid);
            reject("Unauthorized");
            return;
        }

        //Verify the signature of the JWT token to ensure it's really coming from your User Pool
        jwt.verify(token, pem, { issuer: iss }, function(err, payload) {
          if(err) {
            console.error(err)
            reject("Unauthorized");
            return
          } else {
            console.log('JWT Valid.')
            resolve(token)
            return
          }
      });
  });
};

function authenticateUserPool(user,password){
  return new Promise(function(resolve,reject) {
      let authenticationData = {
      Username : user,
      Password : password,
      };
    let authenticationDetails = new AWSCognitoIdentity.AuthenticationDetails(authenticationData);
    let userPool = new AWSCognitoIdentity.CognitoUserPool({
      UserPoolId : userPoolId,
      ClientId : clientId
    });

    let userData = {
        Username : user,
        Pool : userPool
    };
    let cognitoUser = new AWSCognitoIdentity.CognitoUser(userData);
    
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        let cognitoGetUser = userPool.getCurrentUser();
        if (cognitoGetUser != null) {
          cognitoGetUser.getSession(function(err, result) {
            if (result) {
              console.log ("User Authenticated!");
              resolve(result)
              return
            }
            console.log(err)
            reject(err)
            return
          });
        }
        reject('Invalid user.')
        return
      },
      onFailure: function(err) {
          reject(err);
          return;
      }
    });
  })
}


// download key verification set
downloadJwks()
.then(function(res) { 
  // login
  return authenticateUserPool(process.env.COGNITO_USERNAME, process.env.COGNITO_PASSWORD) 
})
.then(function(res) {
  // validate login tokens (not necessary if just calling out to API Gateway)
  return validateTokens(res)
})
.then(function(res) {
  // call API Gateway endpoint
  return request.get({url: 'https://m1ngc9r4l8.execute-api.us-east-1.amazonaws.com/Stage/cup?hello=8765', headers: { authorization: res.idToken.jwtToken} })
})
.then(function(res) {
  // api return value
  var parsed = JSON.parse(res)
  console.log(parsed)
})
.catch(function(err) {
  // any errors that occur along the way
  console.error(err);
});
