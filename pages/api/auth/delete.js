import * as cookie from "cookie";
const jwt = require("jsonwebtoken");
const getDB = require("../../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    const token = req.cookies.ganttToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = jwt.verify(token, "jwtSecret");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user) {
      const User = getDB("User");
      User.findOneAndDelete({ _id: user.id }, (err, doc) => {
        if (err) return res.status(500).json({ message: "Ошибка базы данных" });
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("ganttToken", "", {
            maxAge: 0,
            path: "/",
            sameSite: true,
            secure: true,
          })
        );
        return res.json({ message: "ok" });
      });
    }
  } catch (e) {
    return res.status(500).json({ message: "Ошибка базы данных" });
  }
};
