const { Router } = require("express");
const { checkToken } = require("../validations/token_check");
const { createUser,getUserByNumber, login, reportUser } = require("../controllers/user");
const { checkDetails } = require("../validations/sign_up");
const { checkSpamNumber } = require("../validations/report_number");

const router = Router();
router.post('/signup',checkDetails,createUser);
router.get('/search/:number',checkToken,getUserByNumber);
router.post('/report',checkToken,checkSpamNumber,reportUser);
router.post('/login',login);


module.exports = router;