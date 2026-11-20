"use strict";
const { handleVideo } = require("../utils/ytVideo");

module.exports = {
  name: "video2",
  aliases: ["ytv2"],
  description: "Download YouTube video via the alternate route (API first). Usage: .video2 <name or link>",
  async execute(sock, msg, args) {
    return handleVideo(sock, msg, args, { prefer: "api" });
  },
};
