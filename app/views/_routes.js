// ***************************************
// Node Session Timeout & Cookie Component
// ***************************************

// External dependencies
const express = require('express');
const router = express.Router();

// API
const axios = require('axios');


router.post('/start', function (req, res) {

    res.redirect('enter-your-name');

})

// Continue following entering First and Last Name

router.post('/enter-your-name', function (req, res) {

    res.redirect('enter-date-of-birth');

})

router.post('/enter-date-of-birth', function (req, res) {

    res.redirect('find-your-address');

})

router.post('/find-your-address', function (req, res) {

    var postcodeLookup = req.session.data['postcode']

    const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');

    if (postcodeLookup) {

        if (regex.test(postcodeLookup) === true) {

            axios.get("https://api.os.uk/search/places/v1/postcode?postcode=" + postcodeLookup + "&key=" + process.env.POSTCODEAPIKEY)
                .then(response => {
                    var addresses = response.data.results.map(result => result.DPA.ADDRESS);

                    const titleCaseAddresses = addresses.map(address => {
                        const parts = address.split(', ');
                        const formattedParts = parts.map((part, index) => {
                            if (index === parts.length - 1) {
                                // Preserve postcode (DL14 0DX) in uppercase
                                return part.toUpperCase();
                            }
                            return part
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ');
                        });
                        return formattedParts.join(', ');
                    });

                    req.session.data['addresses'] = titleCaseAddresses;

                    return res.redirect('select-your-address')
                })
                .catch(error => {
                    console.log(error);
                    return res.redirect('no-address-found')
                });

        }

    } else {
        return res.redirect('find-your-address')
    }

})

router.post('/no-address-found', function (req, res) {

    res.redirect('find-your-address');

})


router.post('/enter-your-address', function (req, res) {

    var addressLine1 = req.session.data['address-line-1'];
    var townOrCity = req.session.data['address-town'];
    var postcodeManual = req.session.data['address-postcode'];


    if (addressLine1 && townOrCity && postcodeManual) {
        res.redirect('check-your-answers');
    } else {
        res.redirect('enter-your-address');
    }

})

router.post('/select-your-address', function (req, res) {

    var address = req.session.data['address'];

    if (address) {
        res.redirect('check-your-answers');
    } else {
        res.redirect('select-your-address');
    }

})

router.post('/check-your-answers', function (req, res) {

    res.redirect('confirmation-of-change');

})

module.exports = router;