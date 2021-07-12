const { displayQueryInstance } = require("./routesCommons");
const { Storage } = require("@google-cloud/storage");

exports.generateSignedUrl = function () {
  return async (req, res) => {
    let r = {};
    // These options will allow temporary read access to the file
    const options = {
      version: "v2", // defaults to 'v2' if missing.
      action: "read",
      expires: Date.now() + 1000 * 60 * 20, // 20 minutes.
    };

    try {
      let bucketName;
      let filePath;
      // Creates a client from a Google service account key
      const storage = new Storage({ keyFilename: "config/gcp_key.json" });
      if (req.method.toLowerCase() === "get") {
        bucketName = req.query["bucketName"];
        filePath = req.query["filePath"];
      } else {
        bucketName = req.body["bucketName"];
        filePath = req.body["filePath"];
      }

      // Get a v2 signed URL for the file
      const [url] = await storage
        .bucket(bucketName)
        .file(filePath)
        .getSignedUrl(options);
      r = { results: url };
    } catch (e) {
      r["error"] = e.message;
    }
    displayQueryInstance(res, r);
  };
};
