const express = require('express');
const router = express.Router();

const ctrlQuestions = require('../controllers/questions');

router
    .route('/questions')
    .post(ctrlQuestions.questionCreate);

module.exports = router;
