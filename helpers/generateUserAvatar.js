const crypto = require("crypto");

const DEFAULT_USER_AVATAR =
    "https://www.gravatar.com/avatar/b0cb6e7e381a708f71dd434d3113000d3fa9bdf59cb6e419604fe862e23a67e2?s=60&d=monsterid";

function getGravatarUrl(username, options = {}) {
    const defaultImage = options?.defaultImage || "monsterid";
    const size = options?.size || 60;
    const trimmedUsername = username.trim().toLowerCase();
    const hash = crypto.createHash("sha256").update(trimmedUsername).digest("hex");
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
}

module.exports = {
    getGravatarUrl,
    DEFAULT_USER_AVATAR
};
