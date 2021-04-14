const axios = require('axios')
let resData = {}

axios.post('https://api.thegraph.com/subgraphs/name/itsjerryokolo/cryptopunks', {
  query: `
  {
    purchases(where: {punk: "9539"}) {
      id
      punk {
        id
      }
      seller
      buyer {
        id
      }
      amount
      transaction {
        id
      }
    }
  }
  `
})
.then((res) => {
  resData = res.data
  console.log(resData)
  console.log("HERE")
})
.catch((error) => {
  console.error(error)
})
