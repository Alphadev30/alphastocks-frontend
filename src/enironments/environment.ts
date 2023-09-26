export const environment = {

    production: false,

    // News APIS
    getSentiments: 'https://alpha-stocks-java-e37be892d10d.herokuapp.com/api/sentiment/all',
    getCompanyByNewsId: 'https://alpha-stocks-java-e37be892d10d.herokuapp.com/api/company/search',
    getNewsSentiment: 'https://alpha-stocks-java-e37be892d10d.herokuapp.com/api/sentiment/custom',

    // Technical APIS
    getMaCross : 'https://alpha-stocks-2-e991251132bd.herokuapp.com/analyze/ma',
    getMacdCross : 'https://alpha-stocks-2-e991251132bd.herokuapp.com/analyze/macd' ,
    getResCross: 'http://localhost:5000/bot/resistance'
  };