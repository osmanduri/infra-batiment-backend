const userModel = require('../Models/userModel')
const ObjectID = require('mongoose').Types.ObjectId
const maxAge = 3 * 24 * 60 * 60 * 1000
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { signUpErrors, signInErrors } = require('../utils/errors.utils')
const CryptoJS = require("crypto-js");

module.exports.getAllUsers = async(req, res) => {
    const users = await userModel.find().select("-password");

    res.status(200).send(users)
}

module.exports.getUserById = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown :' + req.params.id)
    await userModel.findById(req.params.id, (err, data) => {
        if (!err)
            res.status(200).send(data);
        else
            res.status(400).send(err);
    }).select('-password');
}

module.exports.updateUser = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown :' + req.params.id)

    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString()
    }

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id, {
                $set: req.body
            }, { new: true },

        );
        res.status(200).json(updatedUser)
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

module.exports.deleteUser = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown :' + req.params.id)

    try {
        await userModel.remove({ _id: req.params.id }).exec()
        res.status(200).json({ message: "Successfully deleted" })
    } catch (err) {
        res.status(400).send({ message: err })
    }


}

module.exports.signUp = async(req, res) => {
    const newUser = new userModel({
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(200).send(savedUser);
    } catch (err) {
        const errors = signUpErrors(err)
        res.status(400).send(errors);
    }
}
module.exports.signIn = async(req, res) => {
    try {
        const user = await userModel.findOne({ pseudo: req.body.pseudo })

        !user && res.status(401).json("Utilisateur inconnue !")

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );

        const original_password = hashedPassword.toString(CryptoJS.enc.Utf8);

        original_password !== req.body.password &&
            res.status(401).json("Mauvais mot de passe !")

        const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC, { expiresIn: "3d" }
        )

        const { password, ...others } = user._doc

        //res.cookie('jwt', accessToken, { maxAge: 1000 * 3 * 24 * 60 * 60 });

        
        res.status(200).send({...others, accessToken })



    } catch (err) {
        const errors = signInErrors(err);
        console.log(errors)
        res.status(401).send(errors)
    }
}

module.exports.signOut = (req, res) => {
    console.log('logout')
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/users')
}