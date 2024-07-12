const yup = require("yup");
const { ObjectId } = require("mongodb");

const { ValidationError } = require("../errors");

yup.setLocale({
    mixed: {
        notType: "${path} must be a valid ${type}",
        required: "${path} is a required field",
    },
    string: {
        email: "${path} must be a valid email",
        min: "${path} must be at least ${min} characters",
    },
    number: {
        min: "${path} must be greater than or equal to ${min}",
        integer: "${path} must be an integer",
        positive: "${path} must be positive",
    },
});

const baseStringSchema = yup.string().strict().typeError().trim().min(1).required();
const trimedStringSchema = yup.string().transform(value => value.trim()).typeError().trim().min(1).required();

const userDataSchema = yup.object().shape({
    username: baseStringSchema.min(2),
    password: baseStringSchema.min(2),
});

const mediaDataSchema = yup.object().shape({
    type: yup.string().oneOf(["image", "video"]),
    mimetype: baseStringSchema,
    url: baseStringSchema
})

const postDataSchema = yup.object().shape({
    title: trimedStringSchema,
    content: trimedStringSchema,
    media: mediaDataSchema.notRequired().default(undefined)
});

const commentDataSchema = yup.object().shape({
    comment: trimedStringSchema
});

const objectIdSchema = yup
    .string()
    .typeError()
    .required()
    .test("is-valid-object-id", "${path} is not a valid ObjectId", (value) => ObjectId.isValid(value));


const validateIdParam = (idParam) => async (req, _resp, next) => {
    try {
        const parsed = await objectIdSchema.validate(req.params[idParam]);
        req.params[idParam] = parsed;
        next();
    } catch (err) {
        const errors = {
            [idParam]: err.message,
        };

        next(new ValidationError({ errors: errors }));
    }
};

const validateMetaData = (dataShema) => async (req, _resp, next) => {
    try {
        const parsedBody = await dataShema.validate(req.body, { abortEarly: false });
        req.body = parsedBody;
        next();
    } catch (err) {
        const errors = err.inner.reduce((acc, curr) => {
            if (!acc[curr.path]) {
                acc[curr.path] = [];
            }

            acc[curr.path].push(curr.message);
            return acc;
        }, {});

        next(new ValidationError({ errors: errors }));
    }
};

const idValidator = {
    userId: validateIdParam("userId"),
    postId: validateIdParam("postId"),
    commentId: validateIdParam("commentId"),
};

module.exports = {
    userDataValidator: validateMetaData(userDataSchema),
    postDataValidator: validateMetaData(postDataSchema),
    commentDataValidator: validateMetaData(commentDataSchema),
    idValidator,
};
