const express = require('express');
const router = express.Router();

const ctrlQuestions = require('../controllers/questions');

router
    .route('/questions')
    .get(ctrlQuestions.question_get_all)
    .post(ctrlQuestions.questionCreate);

router
    .route('/questions/:questionId')
    .get(ctrlQuestions.question_get_one)
    .patch(ctrlQuestions.question_update_one)
    .delete(ctrlQuestions.question_delete_one);


module.exports = router;
