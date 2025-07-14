const repository = require('../repositories/userRepository');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.getLoggedInData = async (req, res) => {
    try {
        if ((req.role === "Guest") || (!req.role)) {
            return res.status(403).json({errors: ["guest_need_login"]});
        }
        else {
            const user = await repository.getUser(req.user);
            res.status(200).send({role: user.role, id: user.id, email: user.email});
        }
    } catch (err) {
        res.status(500).json({ errors: ["get_me_error"] });
    }
}
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 7 } = req.query;
        const offset = (page - 1) * limit;

        const users = await repository.getUsers({ limit, offset });
        const totalUsers = await repository.getTotalUsersCount();

        res.status(200).json({
            data: users,
            pagination: {
                currentPage: parseInt( page),
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers,
                pageSize: parseInt(limit),
            },
        });
    } catch (err) {
        res.status(500).json({ errors: ["get_users_error"] });
    }
};


exports.postUser = async (req, res) => {
    try {
        const formData = req.body;
        const user = new User(formData);
        user.role = "User";
        const errors = user.validate();

        if (errors.length > 0) {
            return res.status(400).json({errors: errors});
        }

        const emailExists = await repository.existsByEmail(user.email);

        if (emailExists) {
            return res.status(400).json({errors: ["email_exists"]});
        }
        user.password = await bcrypt.hash(user.password, 10);
        await repository.insertNewUser(user);
        res.status(200).send();
    } catch (err) {
        res.status(500).json({errors: ["insert_user_error"]});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const formId = Number(req.params.id);
        if ((req.role ==="Guest") || (!req.role)) {
            return res.status(403).json({errors: ["guest_need_login"]});
        }
        if ((req.role !=="Admin") && (req.user != formId) ) {
            return res.status(403).json({errors: ["not_admin_or_owner"]});
        }
        const exists = await repository.existsById(formId);

        if (!exists) {
            return res.status(404).json({errors: ["user_not_found"]});
        }

        await repository.deleteUser(formId);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({errors: ["delete_user_error"]});
    }
};

exports.patchUser = async (req, res) => {
    try {
        const formId = req.params.id;
        const existingUser = await repository.getUser(formId);

        if ((req.role ==="Guest") || (!req.role)) {
            return res.status(403).json({errors: ["guest_need_login"]});
        }
        if ((req.role !=="Admin") && (req.user != formId) ) {
            return res.status(403).json({errors: ["not_admin_or_owner"]});
        }

        if (!existingUser) {
            return res.status(404).json({errors: ["user_not_found"]});
        }

        const formData = req.body;
        const user = new User(formData);
        user.role = existingUser.role;
        const errors = user.validate();

        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        user.id = formId;

        if (user.email !== existingUser.email) {
            const emailExists = await repository.existsByEmail(user.email);
            if (emailExists) {
                return res.status(400).json({errors: ["email_exists"]});
            }
        }
        user.password = await bcrypt.hash(user.password, 10);
        await repository.updateUser(user);
        res.status(200).send();
    } catch (err) {
        res.status(500).json({errors: ["update_user_error"]});
    }
};

exports.getUser = async (req, res) => {
    try {
        const formId = req.params.id;
        const exists = await repository.existsById(formId);

        if ((req.role ==="Guest") || (!req.role)) {
            return res.status(403).json({errors: ["guest_need_login"]});
        }
        if ((req.role !=="Admin") && (req.user != formId) ) {
            return res.status(403).json({errors: ["not_admin_or_owner"]});
        }

        if (!exists) {
            return res.status(404).json({errors: ["user_not_found"]});
        }

        const user = await repository.getUser(formId);
        const purchases = await repository.getUserAssociations(formId);

        res.status(200).json({...user, purchases});
    } catch (err) {
        res.status(500).json({errors: ["get_user_error"]});
    }
};
exports.login = async (req, res) => {
    try {
        if ((req.role)) {
            const sessions = req.app.get('sessions');
            sessions.delete(req.sessionId);
            res.clearCookie('sessionId');
        }
        const email = req.body.email;
        const password = req.body.password;

        const exists = await repository.existsByEmail(email);
        if (!exists)
            return res.status(404).json({errors: ["user_not_found"]});
        const user = await repository.getUserByEmail(email);
        const result = bcrypt.compareSync(password, user.password);
        if (result) {
            const sessionId = crypto.randomBytes(16).toString('hex');
            const sessions = req.app.get('sessions');

            let ts = Date.now() + 600000;
            sessions.set(sessionId, {login: user.id, logoutTime: ts, role: user.role, cart: []});
            res.cookie('sessionId', sessionId, {maxAge: 600000});
            res.status(200).send({"role": user.role, "id" : user.id});
        } else {
            res.status(403).json({errors: ["invalid_credentials"]});
        }
    } catch (err) {
        res.status(500).send(err);
    }
}
exports.logout = async (req, res) => {
    const sessions = req.app.get('sessions');
    sessions.delete(req.sessionId);
    res.clearCookie('sessionId');
    res.status(200).send();
}
exports.promoteAdmin = async (req,res) =>{
    try {
        const formId = req.params.id;
        console.log(formId);
        const exists = await repository.existsById(formId);

        if (req.role !=="Admin") {
            return res.status(403).json({errors: ["not admin"]});
        }
        if (!exists) {
            return res.status(404).json({errors: ["user_not_found"]});
        }

        await repository.promoteToAdmin(formId);

        res.status(200).send();
    } catch (err) {
        res.status(500).json({errors: ["get_user_error"]});
    }
}
exports.promoteManager = async (req,res) =>{
    try {
        const formId = req.params.id;
        const exists = await repository.existsById(formId);

        if (req.role !=="Admin") {
            return res.status(403).json({errors: ["not admin"]});
        }
        if (!exists) {
            return res.status(404).json({errors: ["user_not_found"]});
        }
        const user = await repository.getUser(formId);
        if (user.role === "Admin") {
            return res.status(400).json({errors: ["cannot_demote"]});
        }

        await repository.promoteToManager(formId);

        res.status(200).send();
    } catch (err) {
        res.status(500).json({errors: ["get_user_error"]});
    }
}