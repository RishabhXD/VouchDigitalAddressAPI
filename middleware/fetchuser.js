const jwt = require("jsonwebtoken");
const JWT_SECRET = "addressxdjwtkey";

const fetchuser = (req, res, next) => {
  // get user from jwt token
  const token = req.header("auth-token");
  if (!token) {
    res.status(403).send({ error: "Invalid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};

module.exports = fetchuser;
