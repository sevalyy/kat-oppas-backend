const User = require("../models").user;
const { toData } = require("./jwt");

async function auth(req, res, next) {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");

  if (!auth || !(auth[0] === "Bearer") || !auth[1]) {
    console.log("Auth error: Authentication token not found!");

    return res.status(401).send({
      message:
        "This endpoint requires an Authorization header with a valid token",
    });
  }

  try {
    const data = toData(auth[1]);
    const user = await User.findByPk(data.userId);
    if (!user) {
      console.log("Auth error: User not found!");
      return res.status(404).send({ message: "User does not exist" });
    }

    // add user object to request
    req.user = user;
    // next handler
    return next();
  } catch (error) {
    console.log("Auth error: ", error);

    switch (error.name) {
      case "TokenExpiredError":
        return res
          .status(401)
          .send({ error: error.name, message: error.message });

      case "JsonWebTokenError":
        return res
          .status(400)
          .send({ error: error.name, message: error.message });

      default:
        return res.status(400).send({
          message: "Something went wrong, sorry",
        });
    }
  }
}

module.exports = auth;
