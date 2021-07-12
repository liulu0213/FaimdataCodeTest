const { getCraneIdsByUser } = require("../users/userProject");
const { displayQueryInstance } = require("../utils/routesCommons");

exports.getLoaders = function () {
  const mockLoaders = import("../config/loader.json");
  return (req, res) => {
    res.status(200).json(mockLoaders);
  };
};

exports.getLoaders_ori = function () {
  return async (req, res) => {
    let crane_results = await getCraneIdsByUser(req);
    let group_results = {};
    crane_results.data.map((loader) => {
      if (!group_results[loader.code]) {
        group_results[loader.code] = {};
        group_results[loader.code].code = loader.code;
        group_results[loader.code].data = [];
      }
      group_results[loader.code].displayName = loader.name;
      group_results[loader.code].data.push(loader);
      //console.log(group_results)
    });

    displayQueryInstance(res, group_results);
  };
};
