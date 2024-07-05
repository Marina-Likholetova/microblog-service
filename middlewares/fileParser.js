const multer = require("multer");
const { randomUUID } = require("crypto");
const path = require("path");
const fs = require("fs");
const { server } = require("config");
const { ValidationError } = require("../errors");

const avaliableMediaTypes = ["image", "video"];
 
const storage = multer.diskStorage({
    destination: (_req, _file, next) => {
        fs.existsSync(server.uploadsDir) || fs.mkdirSync(server.uploadsDir);
        next(null, server.uploadsDir);
    },

    filename: (req, file, next) => {
        if (req.body.media) {
            next(null, req.body.media.url.replace(/^\/uploads\//, ''));
        }

        const type = avaliableMediaTypes.find(type => file.mimetype.startsWith(type));

        if (!type) {
            next(new ValidationError({
                errors: {
                    media: "Invalid file type"
                }
            }))
        }

        const fileExt = path.extname(file.originalname);
        let fileName = `${randomUUID()}${fileExt}`;

        const mimetype = file.mimetype;
        
        req.body.media = {
            type,
            mimetype,
            url: `/uploads/${fileName}`
        };

        next(null, fileName);
    },
});

module.exports = {
    fileParser: multer({
        storage,
        // limits: { fileSize: 5 * 1024 * 1024 }, // max = 50MB
    }),
};