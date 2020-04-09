const TwitterSearch = require('../libs/twitterSearch')

const pad = (num = 0, width) => {
  num = num + ''
  return num.length >= width ? num : new Array(width - num.length + 1).join(0) + num
}

const subtract = (id) => {
  const strBegin = id.slice(0, -10)
  const strEnd = id.slice(id.length - 10, id.length)

  let end = parseInt(strEnd)
  end = end -1

  const output = strBegin + pad(end, strEnd.length)

  return output
}

let Search = {}

Search.search = async (req, res, nex) => {
  const { query, count = 100, current = 0 } = req.query
  try {
    const data = await TwitterSearch.search(query, count, current)

    res.status(200).json(data)
  } catch(e) {
    nex(e)
  }
}

module.exports = Search
