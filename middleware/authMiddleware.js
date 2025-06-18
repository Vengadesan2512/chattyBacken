import jwt from "jsonwebtoken";
import User from "../Models/user.js";

export const secureRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorised-No token provider" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRETE_KEY);
    if (!decode) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in secureRoute middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
