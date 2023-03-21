const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode.cjs')
const forecast = require('./utils/forecast.cjs')


const app = express()
const port = process.env.PORT || 3000//only set on heroku

//define paths for express config
const publicDirPath = (path.join(__dirname, '../public'))
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', { 
        title: 'Weather App',
        name: 'Doesnt Ayter '
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        image: '/img/mountain_asset.jpeg'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'Please provide address to get the weather.'
        })
    }
    
    geocode(req.query.address, (error, { latitude, longitude } = {}) => {
        if(error) return res.send({error})
 
        forecast(latitude, longitude,  (error, { location, current }) => {
            if(error) return res.send({error})

            res.send({
                 location: location.name,
                 country: location.country, 
                 region: location.region,
                 time: location.localtime,
                 temperature: current.temperature,
                 icon: current.weather_icons[0],
                 current_weather: current.weather_descriptions[0],
                 feels_like: current.feelslike
            })
        })
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term!'
        })
    }
    res.send({
        products: []
    })
} )

app.get('/help', (req, res) => {
    res.render('help', {  
        message: 'Help message',
        title: 'Help Page', 
    })
})

app.get('/help/*', (req, res) => {
     res.render('404', {
        title: '404',
        errorMessage: 'Help article not found',
     }) 
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found!'
    })
})

app.listen(port, () => {
    console.log('server is up on port ' + port)
})
