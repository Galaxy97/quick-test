const router = require('express').Router();
const validator = require('../../../../utils/validator');
const queryValitator = require('../../../../utils/queryValidator');
const checkId = require('../../../../utils/exsistInDB');
const validSchemes = require('./validators');
const {subjects} = require('../../../../controllers/documents');
const topics = require('../topics');

// get all subjetcs in course
router.get('/', subjects.getAll);

// create new subjetcs
router.post('/', validator(validSchemes.createSubject), subjects.create);

// update subjetcs by id
router.put(
  '/',
  queryValitator(validSchemes.querySubjectId), // check if request have id
  checkId(validSchemes.schemeCheckId), // check if this id exists in db
  validator(validSchemes.createSubject),
  subjects.editById,
);

// delete subjetcs by id
router.delete(
  '/',
  queryValitator(validSchemes.querySubjectId), // check if request have id
  checkId(validSchemes.schemeCheckId), // check if this id exists in db
  subjects.deleteById,
);

router.use('/topics', queryValitator(validSchemes.querySubjectId), topics); // topics in subject

module.exports = router;
