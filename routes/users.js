const express = require('express')

const router = express.Router()

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.json([{
        name: 'Gaplant',
    }, {
        name: 'Bound-dog',
    }])
    res.end()
})

router.post('/', (req, res, next) => {
    res.json({
        bdMessage: 'Baund-dog got your message. '
    })
    res.end()
})

module.exports = router
