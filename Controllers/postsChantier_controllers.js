const chantierModel = require('../Models/postsChantier')
const ObjectID = require('mongoose').Types.ObjectId
const moment = require('moment')
moment.locale('fr')
module.exports.getAllChantier = async(req, res) => {
    const chantier = await chantierModel.find();
    res.status(200).send(chantier)
}

module.exports.getChantierById = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id unknown: ' + req.params.id)

    await chantierModel.findById(req.params.id, (err, data) => {
        if (!err)
            return res.status(200).send(data)
        else
            res.status(401).send('error')
    })
}

module.exports.chantierNew = (req, res) => {
    const categorie = new chantierModel({
        id: req.body.id,
        title: req.body.title,
        image: req.body.image,
        format: req.body.format,
        h2: req.body.h2,
        p: req.body.p,
        vue: req.body.vue,
        commentaire: req.body.commentaire,
        like: req.body.like,
        date: moment().format('l')
    })

    categorie.save()

    res.send(categorie)
}

module.exports.chantierUpdate = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id unknown: ' + req.params.id)

    const updateCategorie = {
        id: req.body.id,
        title: req.body.title,
        image: req.body.image,
        format: req.body.format,
        h2: req.body.h2,
        p: req.body.p,
        vue: req.body.vue,
        single_commentaire: req.body.single_commentaire,
        commentaire: req.body.commentaire,
        like: req.body.like,
        date: moment().format('l')
    }
    try {
        await chantierModel.findByIdAndUpdate(
            req.params.id, {
                $set: updateCategorie

            }, { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, data) => {
                if (!err)
                    return res.status(200).send(data)
                if (err)
                    return res.status(401).send(err)

            }

        )

    } catch (err) {
        res.send(err)
    }
}

module.exports.chantierDelete = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id unknown: ' + req.params.id)

    try {
        chantierModel.findByIdAndRemove(
            req.params.id,
            (err, data) => {
                if (!err)
                    res.status(200).send(data)
                if (err)
                    res.status(401).send(err)
            }
        )
    } catch (err) {
        res.send(err)
    }

}

module.exports.chantierUpdateVue = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id unknown: ' + req.params.id)

    let vue = await chantierModel.findByIdAndUpdate(req.params.id)

    try {
        await chantierModel.findByIdAndUpdate(
            req.params.id, {
                $set: {
                    vue: ++vue.vue
                }

            }, { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, data) => {
                if (!err)
                    return res.status(200).send(data)
                if (err)
                    return res.status(401).send(err)

            }

        )

    } catch (err) {
        res.send(err)
    }
}

module.exports.addLike = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)){
        return res.status(400).send('Id unknown: ' + req.params.id)
    }
    

    let user_in_array = false;
    const my_data = await chantierModel.findById(req.params.id)

    my_data.like.forEach(element => {
        if(element === req.body.user_id){
            user_in_array = true;
        }
    })

    if(user_in_array){
        var filtered = my_data.like.filter(value => {
            return value != req.body.user_id
        })
        try{
            await chantierModel.findByIdAndUpdate(
                req.params.id, {
                    $set: {
                        like: filtered
                    }
                }, { new : true, upsert:true, setDefaultsOnInsert: true},
                (err, data) => {
                    if(!err){
                        
                        return res.status(200).send(data)
                    }
                    if(err){
                        
                        return res.status(400).send(err)
                    }
                }
            )
        }catch(err){
            console.log('catch erreur')
            
        }
    
    }else if(!user_in_array){
        try{
            await chantierModel.findByIdAndUpdate(
                req.params.id, {
                    $addToSet: {
                        like: req.body.user_id
                    }
                }, { new : true, upsert:true, setDefaultsOnInsert: true},
                (err, data) => {
                    if(!err){
                        
                        return res.status(200).send(data)
                    }
                    if(err){
                        
                        return res.status(400).send(err)
                    }
                }
            )
        }catch(err){
            console.log('catch erreur')
            
        }
    }
    

    

}

module.exports.removeLike = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('Id unknown: ' + req.params.id)

    let like = await chantierModel.findByIdAndUpdate(req.params.id)

    try{
        await chantierModel.findByIdAndUpdate(
            req.params.id, {
                $set: {
                    like: --like.like
                }
            }, { new : true, upsert:true, setDefaultsOnInsert: true},
            (err, data) => {
                if(!err){
                    return res.status(200).send(data)
                }
                if(err){
                    return res.status(400).send(err)
                }
            }
        )
    }catch(err){
        res.send(err)
    }

}

module.exports.addCommentaire = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id unknown: ' + req.params.id)

    //let chantier = await chantierModel.findByIdAndUpdate(req.params.id)


    const single_commentaire = req.body.single_commentaire;
    const user_id = req.body.user_id;
    const pseudo = req.body.pseudo;
    console.log(chantierModel.date)

    try {
         chantierModel.findByIdAndUpdate(
            req.params.id, {
                $push:{
                    commentaire_array: {single_commentaire, user_id, pseudo}                    
                    },

            }, { new: true, upsert: true },
            (err, data) => {
                if (!err)
                    return res.status(200).send(data)
                    //console.log('il ya pas d erreur')
                if (err)
                    return res.status(401).send(err)
                    //console.log('il ya une erreur')
            }
        )

    } catch (err) {
        res.send(err)
    }
}

module.exports.removeCommentaire = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id unknown: ' + req.params.id)
        try {

            await chantierModel.findByIdAndUpdate(
                req.params.id,
                {
                    
                    $pull: { 
                        commentaire_array: { _id : req.body.id } 
                    }
                },
                { new: true },
                (err, data) => {
                    if (!err)
                        res.status(200).send(data)
                    if (err)
                        res.status(401).send(err)
                }
            )
        } catch (err) {
            res.send(err)
        }

}

