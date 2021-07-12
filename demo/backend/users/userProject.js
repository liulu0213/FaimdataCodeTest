const knex = require("../utils/utils");
const basicConfig = require("../config/config").basicConfig;
const { queryExe } = require("../utils/dao");

exports.getCraneIdsByUser = async function (req) {
  let tableNames = {
    users: "users",
    loader: "loader",
    project: "project",
    users_project: "users_project",
  };
  let selectClause = {
    project: "project.*",
    username: "users.username",
    user_id: "users.id",
    crane_id: "loader.crane_id",
    displayName: "loader.name",
  };
  let whereClause = {
    "users.username": req.authUser,
    "loader.project_id": knex.raw("project.id"),
    "users_project.project_id": knex.raw("project.id"),
    "users_project.user_id": knex.raw("users.id"),
  };
  let r = await queryExe(
    tableNames,
    selectClause,
    whereClause,
    null,
    basicConfig.maxPageSize,
    1
  );
  //console.log('res: ', r)
  return r;
};

async function getProjectDetails(req) {
  let pageSize = basicConfig.maxPageSize;
  let currentPage = 1;

  let tableNames = {
    users: "users",
    project: "project",
    users_project: "users_project",
    location: "location",
    region: "region",
    loader: "loader",
    time_zone: "time_zone",
  };

  let selectClause = {
    project: "project.*", // project.id for orderBy
    username: "users.username",
    user_id: "users.id",

    location_id: "location.id",
    location_name: "location.name",
    location_code: "location.code",
    location_address: "location.address",
    location_coordinates: "location.coordinates",

    loader_id: "loader.id",
    loader_craneId: "loader.crane_id",
    loader_name: "loader.name",
    loader_type: "loader.type",
    loader_config: "loader.config",
    loader_coordinates: "loader.coordinates",

    region_id: "region.id",
    region_name: "region.name",
    region_country: "region.country",

    time_zone_id: "time_zone.id",
    time_zone_name: "time_zone.name",
    time_zone_description: "time_zone.description",
  };
  let whereClause = {
    "users.username": req.authUser,
    "users_project.project_id": knex.raw("project.id"),
    "users_project.user_id": knex.raw("users.id"),
    "loader.project_id": knex.raw("project.id"),
    "loader.location_id": knex.raw("location.id"),
    "region.id": knex.raw("location.region_id"),
    "time_zone.id": knex.raw("location.time_zone_id"),
  };

  return await queryExe(
    tableNames,
    selectClause,
    whereClause,
    null,
    pageSize,
    currentPage
  );
}

exports.queryUserProjects = async (req, res) => {
  if (!req.authUser) {
    res.status(401).json({
      permission: res.permission,
      message: "Unauthorized",
    });
  }

  let projectByUserDetails = await getProjectDetails(req);
  let output = usersProjectReformat(projectByUserDetails);
  return output;
};

usersProjectReformat = async (projectByUserDetails) => {
  let messageOutput = [];
  let resultOrigin = projectByUserDetails.data;
  for (let i = 0; i < resultOrigin.length; i++) {
    messageOutput[i] = {};

    messageOutput[i]["user"] = {
      id: resultOrigin[i]["user_id"],
      name: resultOrigin[i]["username"],
    };

    messageOutput[i]["project"] = {
      id: resultOrigin[i]["id"],
      code: resultOrigin[i]["code"],
      name: resultOrigin[i]["name"],
      description: resultOrigin[i]["description"],
    };

    messageOutput[i]["loader"] = {
      id: resultOrigin[i]["loader_id"],
      name: resultOrigin[i]["loader_name"],
      crane_id: resultOrigin[i]["loader_craneId"],
      type: resultOrigin[i]["loader_type"],
      config: resultOrigin[i]["loader_config"],
      coordinates: resultOrigin[i]["loader_coordinates"],
    };

    messageOutput[i]["location"] = {
      id: resultOrigin[i]["location_id"],
      code: resultOrigin[i]["location_code"],
      name: resultOrigin[i]["location_name"],
      address: resultOrigin[i]["location_address"],
      coordinates: resultOrigin[i]["location_coordinates"],
    };

    messageOutput[i]["region"] = {
      id: resultOrigin[i]["region_id"],
      name: resultOrigin[i]["region_name"],
      country: resultOrigin[i]["region_country"],
    };

    messageOutput[i]["time_zone_"] = {
      id: resultOrigin[i]["time_zone_id"],
      name: resultOrigin[i]["time_zone_name"],
      description: resultOrigin[i]["time_zone_description"],
    };
  }

  return messageOutput;
};
