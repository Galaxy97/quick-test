const validate = (validator, data) => {
  if (!validator(data)) {
    return validator.errors;
  }
  return false;
};

module.exports = validate;
