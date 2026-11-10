const accountModel = require('../models/account.model');

async function createAccountController(req, res) {
    try{

        const user = req.user;

        const account = await accountModel.create({user: user._id})
        return res.status(201).json({message: "Account Created Successfully", account})

    }catch(err){
        return res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = {createAccountController}