const axios = require('axios')
require('dotenv').config();
const Redis = require("ioredis");
const redis = new Redis({
  host: 'localhost',
  port: '6379'
});

const { saveListInRedis } = require('./redisDatabase');


const appid = process.env.AppID
const senha = process.env.Senha
const crypto = require('crypto');
 
let timestamp = Math.floor(Date.now() / 1000);
console.log(timestamp);


const dateNow = timestamp;

const listItens = ['jogos', 'celular', 'fone']
const ProductArray = []

listItens.forEach(el => {
  let parse = `{  productOfferV2(keyword : "${el}" ) {    nodes {  itemId  commissionRate  imageUrl productName price  productLink }  }}`


  const response = {
    "query": parse,
  }

  let requestBody;

  requestBody = JSON.stringify(response)

  const endpoint = 'https://open-api.affiliate.shopee.com.br/graphql'
  const signature = appid + dateNow + requestBody + senha
  const hash = crypto.createHash('sha256').update(signature).digest('hex');
  const headers = {
    "content-type": "application/json",
    "Authorization": `SHA256 Credential=${appid}, Timestamp=${dateNow}, Signature=${hash}`
  }

  axios({
    url: endpoint,
    method: 'post',
    headers: headers,
    data: JSON.parse(requestBody)
  }).then( async el => {
    Object.values(el.data)[0]['productOfferV2']['nodes'].forEach(el => {
      ProductArray.push(el)
    })

  await saveListInRedis('ShopeeProduct', ProductArray);
  })
})