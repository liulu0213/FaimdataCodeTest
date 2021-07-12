const util = require("util");
const knex = require("./utils");
const { basicConfig } = require("../config/config");
const { attachPaginate } = require("knex-paginate");

const getUTCDateTime = () => {
  const utc = new Date(new Date().toUTCString());
  return utc.toISOString().replace(/T/, " ").replace(/\..+/, "");
};

attachPaginate();

exports.queryBoxes = () => {
  return knex("box")
    .join("box_identifier", "box.id", "=", "box_identifier.box_id")
    .select(
      "box.*",
      "box_identifier.box_id",
      "box_identifier.key",
      "box_identifier.value",
      "box_identifier.updated_time"
    )
    .where({
      "box_identifier.key": "mac",
    });
};

exports.updateBoxPort = async (info) => {
  await knex("box")
    .where("id", info.id)
    .update({
      tunnel_port: info.tunnelPort,
      webservice_port: info.webservicePort,
      // 'updated_time': knex('box_status').select('updated_time').where('box_id', knex.raw('??', [info.id])),
      updated_time: knex.ref("box_status.updated_time"),
      // 'status': info.status})
      status: knex.ref("box_status.status"),
    });
};

exports.queryBoxStatusxx = (info) => {
  return knex("box_status").where("box_id", info.id);
};

exports.queryBoxStatus = async (craneId) => {
  const query = `SELECT updateTime,port FROM \`machine-learning-148914.edge_device.crane_connects\` WHERE craneId = '${craneId}' order by updateTime desc LIMIT 1`;
  const options = {
    query: query,
    location: "US",
  };
  try {
    const [job] = await bq.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    const currentTime = new Date();
    const lastTimeStamp = new Date(rows[0].updateTime.value);
    const diff = currentTime - lastTimeStamp;
    return {
      port: `${rows[0].port}`,
      status: `${diff > deviceMonitorInterval * 1000 ? "Offline" : "Online"}`,
      updateTime: lastTimeStamp,
    };
  } catch (e) {
    return { port: "-", status: "Unknown", updateTime: currentTime };
  }
};

exports.updateBoxStatus = async (info) => {
  await knex("box_status").where("box_id", info.id).update({
    updated_time: getUTCDateTime(),
    status: info.status,
    detail: info.statusDetail,
  });
  // update the corresponding info in 'box'

  // await updateBoxStatus(info);
  await knex("box")
    .where("id", info.id)
    .update({ updated_time: getUTCDateTime(), status: info.status });
};

exports.insertBoxStatus = async (info) => {
  await knex("box_status").insert({
    box_id: info.id,
    status: info.status,
    created_time: getUTCDateTime(),
    updated_time: getUTCDateTime(),
    detail: info.statusDetail,
  });
};

exports.queryExe = async (
  tableNames,
  selectClause,
  whereClause,
  whereIds,
  pageSize,
  currentPage
) => {
  pageSize = pageSize || basicConfig.defaultPageSize;
  currentPage = currentPage || 1;
  const rst = knex(tableNames)
    .select(selectClause)
    .where((builder) => {
      if (whereClause) {
        builder.where(whereClause);
      }
      if (whereIds) builder.whereIn(whereIds[0], whereIds[1]);
    })
    .orderBy("id", "desc")
    .paginate({
      perPage: pageSize,
      currentPage: currentPage,
      isLengthAware: true,
    })
    .catch((err) => {
      //console.log('Error: ', err.message, err.stack);
      return { error: err };
    });
  return rst;
};

exports.deleteExe = async (knex, tableName, whereClause) => {
  // let column_name = (tableName.t === 'users') ? 'username' : 'name';
  let column_name = getColName(tableName);

  if (whereClause.length > 0) {
    let rs = knex(tableName)
      .whereIn(whereClause[0], whereClause[1])
      .returning(["id", column_name])
      .delete()
      .catch((err) => {
        //console.log('Error: ', err.message, err.stack);
        return { error: err };
      });
    //console.log('rs: ', rs);
    return rs;
  } else {
    const err = new Error("Trying to delete instances without any condition.");
    //console.log('Error: ', err.message);
    return { error: err };
  }
};

exports.insertExe = async (knex, tableName, instances, userId = null) => {
  instances.map((item) => (item["created_time"] = getUTCDateTime()));
  instances.map((item) => (item["updated_time"] = getUTCDateTime()));

  // for users.changed_by field
  if (userId) {
    instances.map((item) => (item["changed_by"] = userId));
  }

  // let column_name = (tableName.t === 'users') ? 'username' : 'name';
  let column_name = getColName(tableName);
  return knex(tableName)
    .returning(["id", column_name])
    .insert(instances)
    .catch((err) => {
      //console.log('Error: ', err.message, err.stack);
      return { error: err };
    });
};

exports.updateExe = async (
  knex,
  tableName,
  instances,
  middlewareIds,
  userId = null
) => {
  instances.map(
    (item) => (item["updateData"]["updated_time"] = getUTCDateTime())
  );
  // for users.changed_by field
  if (userId) {
    instances.map((item) => (item["updateData"]["changed_by"] = userId));
  }
  //console.log('instances: ', instances);
  let ids = middlewareIds.map((item) => item.id);
  // let column_name = (tableName.t === 'users') ? 'username' : 'name';
  let column_name = getColName(tableName);
  // use transaction for multiple instances updates
  return knex.transaction((trx) => {
    const queries = [];
    instances.forEach((item) => {
      //console.log('item.id: ', item.id);
      //console.log('Middleware ids: ', ids);
      // for box_status, id filed is 'bigint', which is in the type of string in ids.
      if (ids.includes(item.id) || ids.includes(item.id.toString())) {
        const query = knex(tableName)
          .where("id", item.id)
          .returning(["id", column_name])
          .update(item.updateData)
          .transacting(trx);
        queries.push(query);
      }
    });

    Promise.all(queries) // Once every query is written
      .then(trx.commit) // We try to execute all of them
      .catch(trx.rollback); // And rollback in case any of them goes wrong})
  });
};

exports.subQuery = async (knex, tableName, instances) => {
  //console.log('instances: ', instances);
  for (let i = 0; i < instances.length; i++) {
    if (!instances[i].id) {
      let e =
        util.inspect(instances[i], { depth: null }) +
        ` misses the 'id' property.`;
      const err = new Error(e);
      //console.log('Error: ', err.message);
      return { error: err.message.replace(/['"]/g, "'") };
    }
  }
  const condition = instances.map((item) => item.id);
  // let column_name = (tableName.t === 'users') ? 'username' : 'name';
  // let column_name = getColName(tableName);
  return (
    knex(tableName)
      .select("*")
      // .select('id', column_name)
      .whereIn("id", condition)
      .catch((err) => {
        //console.log('Error: ', err.message, err.stack);
        return { error: err };
      })
  );
};

exports.getIdByUsername = async (username) => {
  return knex("users")
    .select("id")
    .where("username", username)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      //console.log('Error: ', err.message, err.stack);
      return { error: err };
    });
};

function getColName(tableName) {
  let column_name;
  if (tableName.t === "users") {
    column_name = "username";
  } else if (tableName.t === "box_identifier") {
    column_name = "box_id";
  } else if (tableName.t === "box_status") {
    column_name = "box_id";
  } else if (tableName.t === "camera_identifier") {
    column_name = "camera_id";
  } else if (tableName.t === "camera_status") {
    column_name = "camera_id";
  } else if (tableName.t === "box_app") {
    column_name = "box_id";
  } else {
    column_name = "name";
  }
  return column_name;
}
