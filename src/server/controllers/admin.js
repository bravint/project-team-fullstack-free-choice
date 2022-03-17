const { checkPassword, hashPassword } = require('../utils/bcrypt');
const { registerSchema, loginSchema } = require('../utils/joi');
const { createToken } = require('../utils/jwt');
const { prisma } = require('../utils/prisma');

const { HTTP_RESPONSE } = require('../config');

const createAdmin = async (req, res) => {
    const { error } = registerSchema.validate(req.body);

    if (error) return res.status(HTTP_RESPONSE.BAD_REQUEST.CODE).json({ error: error.details[0] });

    let { username, password, email } = req.body;

    password = await hashPassword(password);

    try {
        let createdAdmin = await prisma.admin.create({
            data: {
                username,
                password,
                email,
            },
        });

        if (createdAdmin) {
            delete createdAdmin.password;

            const token = `Bearer ${createToken(createdAdmin.id)}`;

            return res.status(HTTP_RESPONSE.CREATED.CODE).json({ data: createdAdmin, token: token });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP_RESPONSE.INTERNAL_ERROR.CODE).json({ error: HTTP_RESPONSE.INTERNAL_ERROR.MESSAGE });
    }
};

const authenticateAdmin = async (req, res) => {
    const { error } = loginSchema.validate(req.body);

    if (error) { 
        return res.status(HTTP_RESPONSE.BAD_REQUEST.CODE).json({ error: error.details[0] });}

    const { username, password } = req.body;

    try {
        let selectedAdmin = await prisma.admin.findUnique({
            where: {
                username,
            },
        });

        if (!selectedAdmin)
            return res.status(HTTP_RESPONSE.UNAUTHORIZED.CODE).json({ error: HTTP_RESPONSE.UNAUTHORIZED.MESSAGE });

        const checkedPassword = checkPassword(selectedAdmin.password, password);

        if (!checkedPassword)
            return res.status(HTTP_RESPONSE.UNAUTHORIZED.CODE).json({ error: HTTP_RESPONSE.UNAUTHORIZED.MESSAGE });

        delete selectedAdmin.password;

        const token = `Bearer ${createToken(selectedAdmin.id)}`;

        return res.status(HTTP_RESPONSE.CREATED.CODE).json({ data: selectedAdmin, token: token });
    } catch (error) {
        console.log(error);
        return res.status(HTTP_RESPONSE.INTERNAL.CODE).json({ error: HTTP_RESPONSE.INTERNAL.MESSAGE });
    }
};

const getAdminFromJWT = (req, res) => {
    let {user} = req;

    delete user.password;

    res.json({ data: user });
}

module.exports = {
    authenticateAdmin,
    createAdmin,
    getAdminFromJWT,
};