const dataBase = require('../../db');

const makeCode = () => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports.create = async ({lecturerId, questionsId, title}) => {
  // create new cours
  // create unique code
  let check;
  let code;
  do {
    code = makeCode();
    // eslint-disable-next-line no-await-in-loop
    [check] = await dataBase('tests')
      .select('code')
      .where({code});
  } while (check);
  // write test data test
  const [testId] = await dataBase('tests')
    .insert({
      lecturer_id: lecturerId,
      title,
      is_open: true,
      code,
    })
    .returning('id');
  const tq = questionsId.map(id => {
    return {test_id: testId, question_id: id};
  });
  await dataBase('test_questions').insert(tq);

  if (testId) return code;
  return false;
};
