module.exports = [
  // check if this id exists in db
  {
    dbName: 'subjects',
    props: [{tabProp: 'id', reqProp: 'subjectId'}], // tabProp - table property, reqProp - request query property
  },
];
