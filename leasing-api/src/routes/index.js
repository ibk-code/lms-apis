const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.json({
    message:
      "Welcome to the beginning of nothingess!!! You won't find anything other than something amazing!!!",
  });
});

module.exports = router;
