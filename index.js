const express = require('express')

const app = express()

const cheeiro = require('cheerio')

const axios = require('axios')

const rp = require('request-promise')

const cors = require('cors')

const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200).json({ success: 'Booking Api online' })
})

app.get('/v1', async(req, res) => {
    const url = req.query.url 

    const findId = url.split('/')

    try {

        const searchId = await axios.get(`https://www.decolar.com/cross/summaries/${parseInt(findId[4].replace('h-', ''))}?product=hotel&language=pt&country=br&ab_test=`)
        

        const config = {
            uri: url,
            transform: async function(body) {
                return await cheeiro.load(body)
            }
        } 

        rp(config).then($ => {
            const name = $('.hf-hotel-name').text()
            const address = $('.hf-location-place').text()
            const rating = searchId.data.rating.categories

            
            res.status(200).json({
                name,
                address,
                id: parseInt(findId[4].replace('h-', '')),
                rating: searchId.data.rating.points,
                amenities: rating[1].score.points,
                cleaning: rating[3].score.points,
                confort: rating[0].score.points,
                cost_benefitscore: rating[4].score.points,
                location: rating[2].score.points,
                wifi: rating[5].score.points,
            })
                
        })
     

    } catch (error) {
        res.status(400).json({ error })
    }

})

app.listen(3004)