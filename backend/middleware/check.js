const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try{
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, "Da_li_znas_da_te_ne_volim_cujes_li_tebi_govorim");
  next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed/check.js_middleware"});
  }
};
