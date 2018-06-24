/**
 * Created by Anthony on 23/06/2018.
 */
var express = require('express');
const router = express.Router();

// @route GET api/posts/test
// @desc Tests post route
//access public

router.get('/', (req, res) => res.json({ msg: "Posts works"}));

module.exports = router;