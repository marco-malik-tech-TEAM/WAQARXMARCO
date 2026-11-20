"use strict";
const { handleVideo } = require("../utils/ytVideo");

module.exports = {
  name: "video",
  aliases: ["ytv", "ytmp4"],
  description: "Download the full YouTube video (up to 2GB). Usage: .video <name or link> [quality e.g. 480]",
  async execute(sock, msg, args) {
    return handleVideo(sock, msg, args, { prefer: "ytdlp" });
  },
};
