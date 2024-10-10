// External dependencies
const express = require('express');
const router = express.Router();

// API
const axios = require('axios');

// Add your routes here - above the module.exports line


// CLEAR DATA
router.post('/clear-data', function (req, res) {
    req.session.destroy()
    res.redirect('/')
})

// log stuff - thanks Craig Abbott!

router.use((req, res, next) => {
    const log = {
        method: req.method,
        url: req.originalUrl, //URL of page
        data: req.session.data //all data held
    }
    console.log(JSON.stringify(log, null, 2)) // show all data as a dump in terminal
    next() // continue to next action

})


// GET FOLDER NAME - useful for relative templates
router.use('/', (req, res, next) => {
    req.folder = req.originalUrl.split('/')[1]; //folder, e.g. 'current'
    req.subfolder = req.originalUrl.split('/')[2]; //sub-folder e.g. 'service'
    res.locals.folder = req.folder; // what folder the url is
    res.locals.subfolder = req.subfolder; // what subfolder the URL is in
    console.log('folder : ' + res.locals.folder + ', subfolder : ' + res.locals.subfolder);
    next();
});

// Check current and previous - good for debugging
router.use('/', (req, res, next) => {
    res.locals.currentURL = req.originalUrl; //current screen
    res.locals.prevURL = req.get('Referrer'); // previous screen
    console.log('previous page is: ' + res.locals.prevURL + " and current page is " + res.locals.currentURL);
    next();
});

// ****************************************
// Route File Versions
// ****************************************

router.use('/', require('./views/\_routes'));


module.exports = router;
