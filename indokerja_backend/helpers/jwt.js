const jwt = require("jsonwebtoken");
const secretCode = "bebas";

const tokenGeneratorUserCompany = (data) => {
  const { id, email, company } = data;
  const token = jwt.sign(
    {
      id,
      email,
      company,
    },
    secretCode,
    { expiresIn: '12h' }
  );

  return token;
};

const tokenGeneratorUserJobSeeker = (data) => {
  const { id, email, username } = data;
  const token = jwt.sign(
    {
      id,
      email,
      username,
    },
    secretCode,
    { expiresIn: '12h' }
  );

  return token;
};

const tokenVerifier = (data) => {
  const verifiedToken = jwt.verify(data, secretCode);

  return verifiedToken;
};

module.exports = {
  tokenGeneratorUserCompany,
  tokenGeneratorUserJobSeeker,
  tokenVerifier,
};
