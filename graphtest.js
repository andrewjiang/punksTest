const axios = require('axios')
let resData = {}

axios.post('https://api.thegraph.com/subgraphs/name/andrewjiang/cryptopunks-data', {
  query: `
  {
    punks(where: {id: 9536}) {
      owner {
        id
      }
    }
  }
  `
})
.then((res) => {
  resData = res.data
  console.log(resData.data.punks[0].owner.id)
  console.log("HERE")
})
.catch((error) => {
  console.error(error)
})
