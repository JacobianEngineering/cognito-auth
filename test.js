var AmazonUserPoolSrpClient = require("amazon-user-pool-srp-client")
var axios = require('axios')

//var axios = Axios.axios;
var SRPClient = AmazonUserPoolSrpClient.SRPClient;
var calculateSignature = AmazonUserPoolSrpClient.calculateSignature;
var getNowString = AmazonUserPoolSrpClient.getNowString;
 
function call (action, body) {
  const request = {
    url: 'https://cognito-idp.us-east-1.amazonaws.com',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': action
    },
    data: JSON.stringify(body),
    transformResponse: (data) => data
  }
 
  return axios(request)
  .then((result) => JSON.parse(result.data))
  .catch((error) => {
    const _err = JSON.parse(error.response.data)
    const err = new Error()
    err.code = _err.__type
    err.message = _err.message
    return Promise.reject(err)
  })
}
 
function login (email, password) {
  const userPoolId = process.env.USER_POOL_ID
  //const srp = new SRPClient(userPoolId)
  

srp = new SRPClient(process.env.USER_POOL_ID)
const SRP_A = srp.calculateA()
hkdf = srp.getPasswordAuthenticationKey("eric1", "P@ssword1", "eb146790c514c6fdccf1df403daa9411ff72b8e7c58724a368fffac4093e0554d535f1baec81e45f9e3bca0ee10697f8f07f6807887630863a1cdd3651f18f9573f901b9b3028af4c584e99357b05694a5461c1d2fcb666751fac4719e9059e7ce0e4305544f091431131ff63a778df75b75d592e1e304b7a6aa17e94d3efefe6cb4750d11ecaa9a32569aeaeb03b43e64ca6b953123f81d1aa7e6b3106ebe60c9b697d169e239794b638a92a717e693627cbb53ec423c5563eb99674ae3cd306a33614597be7e848832289d2e00af3acd4c035d1878b9d0d81d05f9f925de33f50665c3bc282b8d06b48bfbbca96352827af1b091b937158b07c22eacdb06ee8e726e3f3dadc912fe1833b937e69a1965bb7da30e901b63e24b9bdcd6f61b8f0e09757b87194f8eaeb59cb2a2c4a780916cbeb5d28fe3dc17bffebe36d41b85d8f319fde665b1b219cf95454d54240f7a578baae0f65187a305e2674e8528bc4d11db9d258fa46076a5cac0f65f86bdbc2d6ac87f3312a3336f50cec821c6a1", "21c6e608118c950c662e645418b2f1")
signatureString = calculateSignature(hkdf, "32gbbksbddes1o40hb31rjtgqk", "eric1", "5k/9j7lIejCZ37NYJgOdXriq3iI8he6sC55DC8VWKJL6Xn9wFO7DML4SoMXRsiegPlSRU/6J2jU5JTs1Qft6d3yF63jv9rP2/rAucO35rwVUszGOIVYC9Bo+mc5AuEaJIzNopAtx2i4O8RcLoZCVLzjn8Bnh3oQ1DxV6C4+7aIIG8rEQB/c6Dt0tinVOB0I/u0BhqkwMsc1AOvZdi3NpN9lDZaUXKwfJxHp4vI42vnrhkNMUgClCmWWSExS71LwTNbcJNorORh/NuhIhG3M7EtKDKDu3MWGyxL6h3yNBG7pd9QwQHzx8MUbMwvmtTEM/VCzN/qSwUZFNg3hMgoVEHA3Cw3/+YjJ0FRS5dhvbm5HwIOK9k8M4uaT9HkvLRXg6GXCXAJJvpVkmBBL8oJsL6ijmf+0wR4vJHIj21V8P6PRWbJ0ruOTZC+EAZsUpcDUegpYs+n2CWJ5PcBSCXvI/hO2KJ/sKQNwKSMhHT+ksKb0fDx+djRRfptzBgHpa4auB3eG062SdgGKUXxCJQlGl/YHqV/zoyjMQl1xyhGVPr/3w4Pdi3pdv4XxNHd08WZ/T1eAQ0l+0HQzYHZhIGQDOciIgizaRHi3xZgENQNRRYpftZhki3joNtjwUjtX8diipa6VehdVhiGYKeFpW8n0s4a/JIeIYtjU/khiNZlQDHMwns5Z3m0dCiqt/9ubgqsGppivmxr7KHAuKsrwubqIbC01bug5JhJzV7MdsUdNmNQGUozYB74IKu8OBW2InRS44CgpmpkrDPjoxF89BD3sFUJ8L8Do0keVi/kUZhwa3ns88pSn4HzzE0pTl+pf0SqWALs21yOzZCPkq6RrVle6fRHUvLK8BViFLZgTbwf2O8OsyyxGZw6/s+D0oX9ZA5tQTkXjfSaiCkjQsUkqCda1RLC7jhX/hSXW26Szq7rhy4mwQhO0sa+KpoXF3JpovQpUnYGMS97kd2ZLu6F4bIGH7fsYDanPclqGcoJmBaAVWyHjgpJYoSv8eIXB1DE5gBV3X4RyChc+rQLiexIbAiQycE/QLq72dy56xdPPl5sbRRLbYFsVpaXn91mDV5FpXklV4Od9PyR+F8zsONFTgRLhV19JATUjxmv6EFy+D1Xx1liLvqfU8UyLq7ePUBwM059EDo766ZmTTmne6PJuCpHdx7HDh2a6vR4PhCewE2o2cgdfRo8n7TlDtPn8WxqtIGs6MefRFZJjNOukN8K87ihL9zSOCKYKPnIgmSQ2ZFzGzbrC1SXJaR7oRLUzr/V3omfwX3PLTs7668g7Sw/ZHlDDxowL+8grzFlQMvWbbbu2CTA3nbaDRxuAN3UPuYMY1mfb/VCTYRUBG11PEYiL1Y3qauMySgXn6vzSWisQCpLNCrmckdyVRl5yy1rnrXNuSOglPIwqbK/K4W0hGPNqEsuewZQ6OJ/0YazdfdUtOlunhXRONyxWpOod2Zl8D6Z9iR469UIGiXnXYRLTd9E0ugC0yoGw/9kQa60qgUYaA7p16l8FUx3FJ3cEcozXDWxMUUQiJiwSo8SKIjocC5S66XI7r9EOz2pQSgORNcR9eSKvpu4D1rE1jLcDxqd2Ujsl8vlMIeBd3CSHngAt4a1+2bk3gO62vknnAQ3rJH9IkGQ03Adz0Jq+nFEu+R37rLmau8ahgKMLgqwYibvGk3cF2K+DEqaKYOxUVzivQUW6O2lQ1cDdwCA==", "Wed Oct 25 23:41:08 UTC 2017")
console.log("HKDF")
console.log(hkdf)
console.log("SIGNATURE")
console.log(signatureString)
console.log("DONE!!!")
die
  console.log({
    ClientId: process.env.CLIENT_ID,
    AuthFlow: 'USER_SRP_AUTH',
    AuthParameters: {
      USERNAME: email,
      SRP_A
    }
  })
  return call('AWSCognitoIdentityProviderService.InitiateAuth', {
    ClientId: process.env.CLIENT_ID,
    AuthFlow: 'USER_SRP_AUTH',
    AuthParameters: {
      USERNAME: email,
      SRP_A
    }
  })
  .then(({ ChallengeName, ChallengeParameters, Session }) => {
    const hkdf = srp.getPasswordAuthenticationKey(ChallengeParameters.USER_ID_FOR_SRP, password, ChallengeParameters.SRP_B, ChallengeParameters.SALT)
    const dateNow = getNowString()
    const signatureString = calculateSignature(hkdf, userPoolId, ChallengeParameters.USER_ID_FOR_SRP, ChallengeParameters.SECRET_BLOCK, dateNow)
    console.log(ChallengeName)
    console.log({
      ClientId: process.env.CLIENT_ID,
      ChallengeName,
      ChallengeResponses: {
        PASSWORD_CLAIM_SIGNATURE: signatureString,
        PASSWORD_CLAIM_SECRET_BLOCK: ChallengeParameters.SECRET_BLOCK,
        TIMESTAMP: dateNow,
        USERNAME: ChallengeParameters.USER_ID_FOR_SRP
      }
    })

    //return call('AWSCognitoIdentityProviderService.RespondToAuthChallenge', {
    //  ClientId: process.env.CLIENT_ID,
    //  ChallengeName,
    //  ChallengeResponses: {
    //    PASSWORD_CLAIM_SIGNATURE: signatureString,
    //    PASSWORD_CLAIM_SECRET_BLOCK: ChallengeParameters.SECRET_BLOCK,
    //    TIMESTAMP: dateNow,
    //    USERNAME: ChallengeParameters.USER_ID_FOR_SRP
    //  },
    //  Session
    //})
    return call('AWSCognitoIdentityProviderService.RespondToAuthChallenge',{
      "ChallengeName":"PASSWORD_VERIFIER",
      "ClientId":"32gbbksbddes1o40hb31rjtgqk",
      "ChallengeResponses":{
        "USERNAME":"eric1",
        "PASSWORD_CLAIM_SECRET_BLOCK": ChallengeParameters.SECRET_BLOCK,
        "TIMESTAMP":dateNow, // Wed Oct 25 19:56:23 UTC 2017
        "PASSWORD_CLAIM_SIGNATURE":signatureString
      }
    })
    .then(({ AuthenticationResult }) => ({ username: ChallengeParameters.USERNAME, credentials: AuthenticationResult }))
  })
}

//{"ChallengeName":"PASSWORD_VERIFIER","ChallengeParameters":{"SALT":"21c6e608118c950c662e645418b2f1","SECRET_BLOCK":"5k/9j7lIejCZ37NYJgOdXriq3iI8he6sC55DC8VWKJL6Xn9wFO7DML4SoMXRsiegPlSRU/6J2jU5JTs1Qft6d3yF63jv9rP2/rAucO35rwVUszGOIVYC9Bo+mc5AuEaJIzNopAtx2i4O8RcLoZCVLzjn8Bnh3oQ1DxV6C4+7aIIG8rEQB/c6Dt0tinVOB0I/u0BhqkwMsc1AOvZdi3NpN9lDZaUXKwfJxHp4vI42vnrhkNMUgClCmWWSExS71LwTNbcJNorORh/NuhIhG3M7EtKDKDu3MWGyxL6h3yNBG7pd9QwQHzx8MUbMwvmtTEM/VCzN/qSwUZFNg3hMgoVEHA3Cw3/+YjJ0FRS5dhvbm5HwIOK9k8M4uaT9HkvLRXg6GXCXAJJvpVkmBBL8oJsL6ijmf+0wR4vJHIj21V8P6PRWbJ0ruOTZC+EAZsUpcDUegpYs+n2CWJ5PcBSCXvI/hO2KJ/sKQNwKSMhHT+ksKb0fDx+djRRfptzBgHpa4auB3eG062SdgGKUXxCJQlGl/YHqV/zoyjMQl1xyhGVPr/3w4Pdi3pdv4XxNHd08WZ/T1eAQ0l+0HQzYHZhIGQDOciIgizaRHi3xZgENQNRRYpftZhki3joNtjwUjtX8diipa6VehdVhiGYKeFpW8n0s4a/JIeIYtjU/khiNZlQDHMwns5Z3m0dCiqt/9ubgqsGppivmxr7KHAuKsrwubqIbC01bug5JhJzV7MdsUdNmNQGUozYB74IKu8OBW2InRS44CgpmpkrDPjoxF89BD3sFUJ8L8Do0keVi/kUZhwa3ns88pSn4HzzE0pTl+pf0SqWALs21yOzZCPkq6RrVle6fRHUvLK8BViFLZgTbwf2O8OsyyxGZw6/s+D0oX9ZA5tQTkXjfSaiCkjQsUkqCda1RLC7jhX/hSXW26Szq7rhy4mwQhO0sa+KpoXF3JpovQpUnYGMS97kd2ZLu6F4bIGH7fsYDanPclqGcoJmBaAVWyHjgpJYoSv8eIXB1DE5gBV3X4RyChc+rQLiexIbAiQycE/QLq72dy56xdPPl5sbRRLbYFsVpaXn91mDV5FpXklV4Od9PyR+F8zsONFTgRLhV19JATUjxmv6EFy+D1Xx1liLvqfU8UyLq7ePUBwM059EDo766ZmTTmne6PJuCpHdx7HDh2a6vR4PhCewE2o2cgdfRo8n7TlDtPn8WxqtIGs6MefRFZJjNOukN8K87ihL9zSOCKYKPnIgmSQ2ZFzGzbrC1SXJaR7oRLUzr/V3omfwX3PLTs7668g7Sw/ZHlDDxowL+8grzFlQMvWbbbu2CTA3nbaDRxuAN3UPuYMY1mfb/VCTYRUBG11PEYiL1Y3qauMySgXn6vzSWisQCpLNCrmckdyVRl5yy1rnrXNuSOglPIwqbK/K4W0hGPNqEsuewZQ6OJ/0YazdfdUtOlunhXRONyxWpOod2Zl8D6Z9iR469UIGiXnXYRLTd9E0ugC0yoGw/9kQa60qgUYaA7p16l8FUx3FJ3cEcozXDWxMUUQiJiwSo8SKIjocC5S66XI7r9EOz2pQSgORNcR9eSKvpu4D1rE1jLcDxqd2Ujsl8vlMIeBd3CSHngAt4a1+2bk3gO62vknnAQ3rJH9IkGQ03Adz0Jq+nFEu+R37rLmau8ahgKMLgqwYibvGk3cF2K+DEqaKYOxUVzivQUW6O2lQ1cDdwCA==","SRP_B":"eb146790c514c6fdccf1df403daa9411ff72b8e7c58724a368fffac4093e0554d535f1baec81e45f9e3bca0ee10697f8f07f6807887630863a1cdd3651f18f9573f901b9b3028af4c584e99357b05694a5461c1d2fcb666751fac4719e9059e7ce0e4305544f091431131ff63a778df75b75d592e1e304b7a6aa17e94d3efefe6cb4750d11ecaa9a32569aeaeb03b43e64ca6b953123f81d1aa7e6b3106ebe60c9b697d169e239794b638a92a717e693627cbb53ec423c5563eb99674ae3cd306a33614597be7e848832289d2e00af3acd4c035d1878b9d0d81d05f9f925de33f50665c3bc282b8d06b48bfbbca96352827af1b091b937158b07c22eacdb06ee8e726e3f3dadc912fe1833b937e69a1965bb7da30e901b63e24b9bdcd6f61b8f0e09757b87194f8eaeb59cb2a2c4a780916cbeb5d28fe3dc17bffebe36d41b85d8f319fde665b1b219cf95454d54240f7a578baae0f65187a305e2674e8528bc4d11db9d258fa46076a5cac0f65f86bdbc2d6ac87f3312a3336f50cec821c6a1",
//"USERNAME":"eric1","USER_ID_FOR_SRP":"eric1"}}



login('eric1','P@ssword1').then(function(err,res) {
console.log(err);
console.log(res);
console.log('DONE');
})

