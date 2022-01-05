exports.verifyToken = (req, res, next) => {
  // Formate of token => Authorization: Bearer <token>
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const token = bearer[1];
    // Set the token
    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }
};
