const router = require('express').Router()
const postsChantier = require('../Controllers/postsChantier_controllers')
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyToken')

//Categorie
router.get('/healthy', (req, res) => {
    res.send('healthy categories')
})

//CRUD
router.get('/', postsChantier.getAllChantier);
router.get('/:id', postsChantier.getChantierById);
router.post('/', postsChantier.chantierNew);
router.put('/:id', postsChantier.chantierUpdate);
router.put('/vue/:id', postsChantier.chantierUpdateVue)
router.post('/add_commentaire/:id', verifyToken, postsChantier.addCommentaire)
router.post('/add_like/:id', verifyToken, postsChantier.addLike)
router.post('/remove_like/:id', verifyToken, postsChantier.removeLike)
router.post('/remove_commentaire/:id', verifyToken, postsChantier.removeCommentaire)
router.delete('/', postsChantier.chantierDelete);

module.exports = router;