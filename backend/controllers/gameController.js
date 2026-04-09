const Game = require("../models/Game");
const Module = require("../models/Module");

const getGames = async (req, res, next) => {
  try {
    const { module: moduleName, moduleId } = req.query;
    const query = {};

    if (moduleId) {
      query.moduleId = moduleId;
    } else if (moduleName) {
      const moduleDocument = await Module.findOne({ name: moduleName });

      if (!moduleDocument) {
        return res.json([]);
      }

      query.moduleId = moduleDocument._id;
    }

    const games = await Game.find(query)
      .populate("moduleId", "name code")
      .sort({ name: 1 });

    res.json(games);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGames,
};
