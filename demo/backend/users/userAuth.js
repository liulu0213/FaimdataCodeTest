const express = require("express");
const { queryInstance } = require("../service/serviceCommons");

const tableName = { t: "users" };

const userAuth = async (req, res, next) => {
  // res takes the permission info through all the 'next' functions to the front-end
  res.permission = { read: true, add: true, delete: true, update: true };
  // get access_token
  let access_token = req.headers.authorization;
  const decodedAccessToken = decodingJWT(access_token);

  // get token
  const idToken = req.header("token");
  if (!idToken) {
    res.status(401).json({
      message: "Unauthorized",
    });
  } else {
    const decodedIdToken = decodingJWT(idToken);

    // check if user exists
    if (!decodedIdToken) {
      res.status(401).json({
        message: "Unauthorized",
      });
    } else {
      let username = decodedIdToken.name;
      let findUserByNames = await queryInstance(req, tableName, username);
      //console.log(findUserByNames);
      if (!findUserByNames["data"].length) {
        res.status(401).json({
          message: "User does not exist.",
        });
      } else {
        let row = findUserByNames["data"][0];
        if (row["admin"]) {
          req["authUser"] = username;
          next();
        } else if (row["staff"]) {
          res.permission = {
            read: true,
            add: false,
            delete: false,
            update: false,
          };
          req["authUser"] = username;
          next();
        } else {
          res.status(403).json({
            message: "Forbidden.",
          });
        }
      }
    }
  }
};

const decodingJWT = (token) => {
  if (token) {
    try {
      const base64String = token.split(".")[1];
      return JSON.parse(Buffer.from(base64String, "base64").toString("ascii"));
    } catch {
      return null;
    }
  }
  return null;
};

module.exports = userAuth;
