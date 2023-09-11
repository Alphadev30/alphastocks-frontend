export const environment = {

    production: false,

    // News APIS
    getSentiments: 'http://localhost:8080/api/sentiment/all',
    getCompanyByNewsId: 'http://localhost:8080/api/company/search',
    getNewsSentiment: 'http://localhost:8080/api/sentiment/custom',

    // Technical APIS
    getMaCross : 'http://localhost:5000/analyze/ma',
    getMacdCross : 'http://localhost:5000/analyze/macd' 
  };