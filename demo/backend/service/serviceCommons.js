const knex = require("../utils/utils");
const { getUsernameFromToken } = require("../utils/routesCommons");
const {
  updateExe,
  subQuery,
  insertExe,
  deleteExe,
  queryExe,
  getIdByUsername,
} = require("../utils/dao");

exports.deleteInstance = (ids, tableName) => {
  return serviceDeleteInstance(ids, tableName);
};

exports.insertInstance = (req, tableName) => {
  return serviceInsertInstance(req, tableName);
};

exports.updateInstance = (req, tableName, middlewareIds, instances) => {
  return serviceUpdateInstance(req, tableName, middlewareIds, instances);
};

exports.middlewareQuery = (req, tableName) => {
  return serviceMiddlewareQuery(req, tableName);
};

exports.queryInstance = (req, tableName, names = null) => {
  let pageSize = req.query["pageSize"] || 500;
  let currentPage = req.query["page"] || 1;
  let ids = req.query.id;
  //console.log('req.query.id: ', ids);
  let selectClause = "t.*";
  let whereClause = null; // no where clause
  let whereIds;
  if (names) {
    pageSize = 1;
    currentPage = 1;
    if (Array.isArray(names)) {
      whereIds = ["t.username", names.map((x) => +x)];
    } else {
      whereIds = ["t.username", [names]];
    }
  } else if (ids) {
    if (Array.isArray(ids)) {
      whereIds = ["t.id", ids.map((x) => +x)];
    } else {
      whereIds = ["t.id", [ids]];
    }
  }
  return queryExe(
    tableName,
    selectClause,
    whereClause,
    whereIds,
    pageSize,
    currentPage
  );
};

serviceDeleteInstance = (ids, tableName) => {
  //console.log('req.query.id: ', ids);
  if (ids && ids.length > 0) {
    let whereClause;
    if (Array.isArray(ids)) {
      whereClause = ["t.id", ids.map((x) => +x)];
    } else {
      whereClause = ["t.id", [ids]];
    }
    //console.log(`whereClause: ${whereClause}`);
    let ins = deleteExe(knex, tableName, whereClause);
    //console.log('ins: ', ins);
    return ins;
  } else {
    const err = new Error("Trying to delete instances without any conditions.");
    //console.log('Error: ', err.message);
    return { error: err };
  }
};

serviceInsertInstance = async (req, tableName) => {
  //for users.changed_by field
  let userId;
  if (tableName.t === "users") {
    let userName = getUsernameFromToken(req);
    let user = await getIdByUsername(userName);
    userId = user[0].id;
  }

  let instances = req.body;
  //console.log('instances: ' + instances);
  if (instances && instances.length > 0) {
    let nums = insertExe(knex, tableName, instances, userId);
    //console.log('nums: ' + nums);
    return nums;
  } else {
    const err = new Error("Trying to insert instances without any input data.");
    //console.log('Error: ', err.message);
    return { error: err };
  }
};

serviceUpdateInstance = async (req, tableName, middlewareIds, instances) => {
  // const instances = req.body;
  //console.log('instances: ', instances);
  if (!instances || instances.length <= 0) {
    const err = new Error("Trying to update instances without any input data.");
    //console.log('Error: ', err.message);
    return { error: err };
  } else {
    // remove instances without 'id' field and re-organize data
    let instance_filter = [];
    instances.map((item) => {
      if (item["id"]) {
        let _id = item["id"];
        delete item["id"];
        instance_filter.push({ id: _id, updateData: item });
      }
    });
    //console.log('instance_filter: ', instance_filter);

    //for users.changed_by field
    let userId;
    if (tableName.t === "users") {
      let userName = getUsernameFromToken(req);
      let user = await getIdByUsername(userName);
      userId = user[0].id;
    }
    let nums = updateExe(
      knex,
      tableName,
      instance_filter,
      middlewareIds,
      userId
    );
    //console.log('nums: ', nums);
    return nums;
  }
};

serviceMiddlewareQuery = (req, tableName) => {
  const instances = req.body;
  if (!instances || instances.length <= 0) {
    const err = new Error("Trying to update instances without any input data.");
    //console.log('Error: ', err.message);
    return { error: err };
  } else {
    return subQuery(knex, tableName, instances);
  }
};

exports.addTableName = (resultIds, tableName) => {
  if (!Array.isArray(resultIds)) {
    resultIds = [resultIds];
  }
  resultIds = resultIds.map(function (x) {
    x["tableName"] = tableName.t;
    return x;
  });
  return resultIds;
};

function convertor(items, intArray) {
  let id = parseInt(items, 10);
  if (Number.isInteger(id)) {
    intArray["ids"].push(id);
  } else {
    intArray["error"] = "The object's 'id' must be specified as an Integer.";
  }
}

exports.castItemToIntArray = function (items) {
  let intArray = {};
  intArray["ids"] = [];
  if (!Array.isArray(items)) {
    convertor(items, intArray);
  } else {
    for (let x in items) {
      convertor(items, intArray);
    }
  }

  return intArray;
};
