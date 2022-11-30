const port = process.env.port || 3000


const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/section/climate',
        base: 'https://www.nytimes.com/section/'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'npr',
        address: 'https://www.npr.org/sections/climate',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news/science_and_environment',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
    },
    {
        name: 'cnn',
        address: 'https://www.cnn.com/specials/world/cnn-climate',
        base: 'https://www.cnn.com/'
    },

    /* Some news sites wont load properly? Blocked?
     */
]
const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Climate change news API!')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', async (req, res) => {
    const newspaperID = req.params.newspaperId
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperID
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})







app.listen(port, () => console.log(`server running on port ${port}`))