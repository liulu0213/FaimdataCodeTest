const util = require("util");

exports.defaultPageSize = 500;
exports.getMessage = (ids, res, str) => {
  if (ids["error"]) {
    ids["error"]["status"] = 400;
    res.status(400).json({ permission: res.permission, message: ids["error"] });
    // res.render('error', {error: ids['error']});
  } else if (ids.length === 0) {
    res
      .status(200)
      .json({ permission: res.permission, message: [], count: ids.length });
  } else {
    let s = ids.length <= 1 ? "] has" : "] have";
    res.status(200).json({
      permission: res.permission,
      message:
        "[" +
        ids.map((item) => `${util.inspect(item, { depth: null })} `) +
        s +
        " been " +
        str +
        ".",
      count: ids.length,
    });
  }
};

exports.displayQueryInstance = (res, instances) => {
  //console.log('instances:', instances)
  if (instances["error"]) {
    // instances['error']['status'] = 400;
    res
      .status(400)
      .json({ permission: res.permission, message: instances["error"] });
    // res.status(400).render('error', {error: instances['error']});
  } else {
    res.status(200).json({ message: instances });
  }
};

exports.getUsernameFromToken = (req) => {
  //console.log(req.header('token'));
  let user = req.header("token");
  if (user) {
    try {
      const base64String = user.split(".")[1];
      let decoded_user = JSON.parse(
        Buffer.from(base64String, "base64").toString("ascii")
      );
      return decoded_user.name;
    } catch {
      return "Anonymous";
    }
  }
  return "Anonymous";
};
