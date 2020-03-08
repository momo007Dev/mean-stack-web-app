const express = require('express');
const router = express.Router();

const ctrlQuestions = require('../controllers/questions');

router
    .route('/questions')
    .get(ctrlQuestions.question_get_all)
    .post(ctrlQuestions.questionCreate);

module.exports = router;
