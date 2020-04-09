const credentials = require('../../config')
const Twitter = require('twitter');

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

const TwitterSearch = {
  search: async (q, count = 15, max_id) => {
    const tweets = await TwitterSearch.getTweets(q, count, 0, max_id)

    const data = tweets.statuses.reduce((out, value) => {
      const val = {
          id: value.id_str,
          created_at: value.created_at,
          text: value.text,
          user: {
              name: `@${value.user.screen_name}`,
              location: value.user.location,
              imageUrl: value.user.profile_image_url,
          }
      }

      return [...out, val]
    }, [])

    const metadata = await TwitterSearch.getMetadata(q, count, data)

    return {
      metadata,
      data,
    }
  },

  getTweets: (q, count = 15, since_id = 0, max_id = 0) => {
    return new Promise((resolve, reject) => {
      const client = new Twitter(credentials)

      const params = {
        count,
        q,
      }

      if (since_id > 0) {
        params.since_id = since_id
      } else {
        if (max_id > 0) {
          params.max_id = max_id
        }
      }
      client.get(`search/tweets`, params, (error, tweets, response) => {
        if (error) {
          reject(error)
        }

        resolve(tweets)
     })
    })
  },

  getMetadata: async (q, count, data) => {
    const idCurrent = data[0].id
    const idNext = subtract(data[data.length - 1].id)

    // tratamento maroto para depois de 10 paginadas
    const limit = 100

    let tweets = await TwitterSearch.getTweets(q, limit, idCurrent)
    tweets = tweets.statuses.slice(Math.max(tweets.statuses.length - count, 0))

    let idPrev = 0
    if (tweets.length > 0) {
      idPrev = tweets[0].id_str
    }

    return {
      count: data.length,
      prev: idPrev,
      current: idCurrent,
      next: idNext,
    }
  }
}

module.exports = TwitterSearch
