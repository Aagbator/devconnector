/**
 * Created by Anthony on 23/06/2018.
 */
const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => res.json({ msg: "Profile works"}));

module.exports = router;/**
 * Created by Anthony on 23/06/2018.
 */
