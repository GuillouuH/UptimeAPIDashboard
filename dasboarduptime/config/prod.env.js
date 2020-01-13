'use strict'
let urlApiServer = process.env.api_uptime_url || "http://127.0.0.1:3000/";
if(urlApiServer.slice(-1) != "/")
  urlApiServer += "/";
module.exports = {
  NODE_ENV: '"production"',
  urlAPI:'"'+urlApiServer+'"',
  Accounts: 
  [{name:'"info@actigraph.com"', key:['"5d39a641a7bc6b309069b467"']}, 
  {name:'"externe@actigraph.com"', key:['"5d39a658a7bc6b309069b468"']}
  ]
}