const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto');

const API_KEY = '6RhTX6kOf0uSIgAhspHFdGL9OvHX9Pu7g1mdBSds9t5vcUis4T5QVl87H1aAy2DF';
const API_SECRET = 'BzfNjeBbqBnZKTLLsqG7GUzJG9mJmOnFEa9HDOUl7U5pcnngwiWpFGznGxAzSuFc';

const app = require('express')();

app.use(require('cors')());

//localhost:3001/BUY/BTCUSDT/0.01
app.post('/:side/:symbol/:quantity', (req, res) => {
  const { side, symbol, quantity } = req.params;

  const data = { symbol, side, quantity, type: 'MARKET', timestamp: Date.now(), recvWindow: 60000 };

  const signature = crypto.createHmac('sha256', API_SECRET)
                          .update(querystring.stringify(data))
                          .digest('hex');

  const newData = {...data, signature};
  const url = 'https://testnet.binance.vision/api/v3/order?' + querystring.stringify(newData);

  axios.post(url, null, { headers: { 'X-MBX-APIKEY': API_KEY } })
       .then(result => {
         console.log(result.data);
         res.json(result.data);
       })
       .catch(err => {
         console.error(err.response.data)
         res.sendStatus(500);
       })
})

app.listen(3001, () => {
  console.log('Servidor está ligado!')
})