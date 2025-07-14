const jwt = require("jsonwebtoken");

function checkToken(req, res, next) {
  const token = req.cookies.Token; 
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token not found." });
  }

  try {
    const decoded = jwt.verify(token, "shhhhh11111");
    req.user = decoded; 
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Forbidden. Invalid or expired token." });
  }
}

module.exports = checkToken;
