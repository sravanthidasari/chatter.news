const news = require('express').Router()
const News = require('../models/article.js')

// Index route
news.get('/', (req, res) => {
  News.find({}, (err, foundNews) => {
    if (err) {
      res.status(400).json({ error: err.message })
    }
    res.status(200).json(foundNews)
  })
})

// Create route
news.post('/', async(req, res)  => {
  News.create(req.body, (error, createdNews) => {
    if(error) {
      res.status(400).json({error: error.message})

    }
    res.status(200).send(creatednews)
  })
})

// Delete route
news.delete('/:id', (req, res) => {
  News.findByIdAndRemove(req.params.id, (err, deletednews) => {
    if (err) {
      res.status(400).json({ error: err.message })
    }
    res.status(200).json(deletedNews)
  })
})
// Update route
news.put('/:id', (req, res) => {
  News.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedNews) => {
    if (err) {
      res.status(400).json({ error: err.message })
    }
    res.status(200).json(updatedNews)
  })
})

module.exports = news;
