module.exports = [
  // check if this id exists in db
  {
    dbName: 'topics',
    props: [{tabProp: 'id', reqProp: 'topicId'}], // tabProp - table property, reqProp - request query property
  },
];
