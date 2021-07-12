const { getCraneIdsByUser } = require("../users/userProject");
const { constants } = require("../config/config");
const { displayQueryInstance } = require("../utils/routesCommons");
const knex = require("../utils/utils");

function stringToObject(numberInCurrentPage, queryResults) {
  const result = [];
  let item = queryResults.data;
  if (item && item.length > 0) {
    for (let i = 0; i < numberInCurrentPage; i++) {
      result[i] = {};
      result[i].id = item[i].id;
      result[i].code = item[i].code;
      result[i].craneId = item[i].craneid;
      result[i].lockTime = item[i].lock_time;
      result[i].unlockTime = item[i].unlock_time;
      result[i].lockBlock = item[i].lock_block;
      result[i].unlockBlock = item[i].unlock_block;
      result[i].update_time = item[i].update_time;
      result[i].lock = {};
      result[i].unlock = {};
      result[i].result = {};

      if (typeof item[i].raw_data === "string") {
        result[i].result = JSON.parse(item[i].raw_data);
      }
      if (typeof item[i].lock === "string") {
        result[i].lock = JSON.parse(item[i].lock);
      }
      if (typeof item[i].unlock === "string") {
        result[i].unlock = JSON.parse(item[i].unlock);
      }
    }
  }
  return result;
}
async function getParams(req, res) {
  const queryParams = req.query;
  //console.log(queryParams);
  let params = {};
  params["craneIds"] = [];
  const craneidsParams =
    queryParams["crane_id"].indexOf(",") < 0
      ? queryParams["crane_id"]
      : queryParams["crane_id"].split(",");
  if (!(craneidsParams instanceof Array)) {
    params["craneIds"].push(queryParams["crane_id"]);
  } else {
    params["craneIds"] = craneidsParams;
  }

  let crane_results = await getCraneIdsByUser(req);
  let allowed_crane_ids = crane_results.data
    .map((x) => String(x.crane_id))
    .filter((x) => x !== null);

  // check if params['craneIds'] in the allowed readable crane ids
  let checker = (arr, target) => target.every((v) => arr.includes(v));
  if (!checker(allowed_crane_ids, params["craneIds"])) {
    let r = {};
    r["error"] = { message: "Bad Request. Device is inaccessible." };
    displayQueryInstance(res, r);
    return r;
  }

  params["cols"] = constants["columns"];
  params["tableName"] = constants["tableName"] || constants["defaultTableName"];
  params["page"] = parseInt(queryParams.page, 10) || 1;
  params["pageSize"] =
    parseInt(queryParams.pageSize, 10) || constants["defaultResultPageSize"];
  params["startIndex"] =
    params["pageSize"] * (params["page"] - 1) > 0
      ? params["pageSize"] * (params["page"] - 1)
      : 0;
  params["code"] = queryParams["code"] || "";

  params["unlockTime_lte"] = queryParams["unlockTime_lte"] || 0;
  params["lockTime_gte"] = queryParams["lockTime_gte"] || 0;
  params["order_by"] = queryParams["order_by"] || "unlock_time";
  params["sort"] = queryParams["sort"] || "DESC";

  return params;
}

exports.getResults = function () {
  return async (req, res) => {
    const queryParams = req.query;
    if (!queryParams["crane_id"]) {
      let r = {};
      r["error"] = {
        message: "Bad Request. The 'crane_id' must be specified.",
      };
      displayQueryInstance(res, r);
      return r;
    }

    const params = await getParams(req, res);
    if (params["error"]) {
      return params;
    }

    let r = {};

    try {
      const whereClauses = (() => {
        let cls = `craneid = '${params["craneIds"]}'`;
        const { code, lockTime_gte, unlockTime_lte, order_by, sort } = params;
        if (code != "") cls += ` and code = '${code}'`;
        if (lockTime_gte != 0) cls += ` and lock_time >= '${lockTime_gte}'`;
        if (unlockTime_lte != 0)
          cls += ` and unlock_time <= '${unlockTime_lte}'`;
        const ob =
          (order_by === "unlockTime" && "unlock_time") ||
          (order_by === "lockTime" && "lock_time") ||
          order_by;
        cls += ` order by ${ob} ${sort}`;
        return cls;
      })();
      const tmp = knex(constants["tableName"])
        .distinct(constants["columns"])
        .where(knex.raw(whereClauses))
        .toSQL();
      //console.log(tmp);
      const queryResults = await knex(constants["tableName"])
        .distinct(constants["columns"])
        .where(knex.raw(whereClauses))
        .paginate({
          perPage: params["pageSize"],
          currentPage: params["page"],
          isLengthAware: true,
        })
        .catch((err) => {
          return { error: err };
        });

      let numberInCurrentPage = queryResults.data.length;

      const resultObj = stringToObject(numberInCurrentPage, queryResults);

      r = {
        results: resultObj,
        requestInfo: { params: params, user: req.authUser || "Anonymous" },
        responseInfo: {
          currentPage: params.page,
          numberInCurrentPage: numberInCurrentPage,
          startIndex: queryResults.pagination
            ? queryResults.pagination.from
            : params.startIndex,
          pageSize: queryResults.pagination
            ? queryResults.pagination.perPage
            : params.pageSize,
          totalRows: queryResults.pagination.total,
          pageToken: "",
        },
      };
    } catch (error) {
      r["error"] = error.message;
    }

    displayQueryInstance(res, r);
  };
};
/*
const getResultFromBigQuery = async function (bigquery, sqlQuery, params) {
  const queryOptions = {
    query: sqlQuery,
    params: params,
    location: "US",
  };

  // Run the query as a job
  const [job] = await bigquery.createQueryJob(queryOptions);
  // Wait for job to complete and get rows. [rows] only get results[0]
  const results = await job.getQueryResults({
    startIndex: params.startIndex,
    maxResults: params.pageSize,
  });

  return results;
};
*/
// FINAL
// CREATE TEMP FUNCTION GetCount(result STRING)
// RETURNS FLOAT64
// LANGUAGE js AS
// """
//
// if (!result) return 0;
// var items = result.split(",");
// for (i=0; i<items.length; i++) {
//     if (items[i].toLowerCase().includes('count')) {
//         var x = (items[i].split(':'))[2];
//         return parseFloat(x);
//     }
// }
// return 0;
//
// """;
//
//
// WITH
// Base_query AS (
//     SELECT DISTINCT *, ROW_NUMBER() OVER(ORDER BY lockTime DESC) AS ex_id FROM `machine-learning-148914.containers_result.containers_number_recognize` WHERE craneId='170' ORDER BY lockTime DESC LIMIT 500  OFFSET 1000
// ),
//
// add_count AS (
//     SELECT *, GetCount(result) as count FROM Base_query
// ),
//
// lockTime_group AS(
//     SELECT lockTime FROM add_count GROUP BY lockTime ORDER BY lockTime DESC
// )
//
// SELECT A.* FROM
// (
//     Select a.*,ROW_NUMBER() OVER(PARTITION BY a.lockTime ORDER BY a.count DESC) AS rank
// From add_count as a, lockTime_group as b
// WHERE a.lockTime=b.lockTime ORDER BY a.count DESC
// ) A
// WHERE A.rank = 1 ORDER BY a.lockTime DESC
//
// # SELECT * FROM Base_query
