const Sauce = require("../models/Sauce_model");
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
    .catch( error => res.status(400).json({error}) );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !' }))
      .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce =  (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id})
    .then( () => res.status(200).json({message : 'Sauce supprimé'}))
    .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id : req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

exports.getAllSauces =  (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}))
};

exports.likeSauce = (req, res, next) => {
  const likeStatus = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;

  Sauce.findOne({ _id: req.params.id }).then(sauce => {
    
    if (likeStatus === 1 && !sauce.usersLiked.includes(req.body.userId)) {
      console.log(`${userId} like la sauce : ${req.params.id}`);
      Sauce.updateOne(
        { _id: sauceId },
        {$push: { usersLiked: userId }, $inc: { likes: +1 },}
      )
      .then(() => res.status(200).json({ message: "Vous aimez cette sauce." }))
      .catch(error => res.status(400).json({ error }))
    }

    if (likeStatus === -1 && !sauce.usersDisliked.includes(req.body.userId)) {
      console.log(`${userId} dislike la sauce : ${req.params.id}`);
      Sauce.updateOne(
        { _id: sauceId },
        {$push: { usersDisliked: userId }, $inc: { dislikes: +1 },}
      )
      .then(() => res.status(200).json({ message: "Vous n'aimez pas cette sauce." }))
      .catch((error) => res.status(400).json({ error }))
    }

    if (likeStatus === 0) {

      Sauce.findOne({ _id: sauceId })

      .then((sauce) => {
       if (sauce.usersLiked.includes(userId)) { 
        console.log(`${userId} annule son like de la sauce : ${sauceId}` );
         Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
           .then(() => res.status(200).json({ message: `${userId} annule son like de la sauce : ${sauceId}` }))
           .catch((error) => res.status(400).json({ error }))
       }

       if (sauce.usersDisliked.includes(userId)) { 

          console.log(`${userId} annule son dislike de la sauce : ${sauceId}` );
          Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
           .then(() => res.status(200).json({ message: `${userId} annule son dislike de la sauce : ${sauceId}` }))
           .catch((error) => res.status(400).json({ error }))
       }
     })
     .catch((error) => res.status(404).json({ error }))
    }
  });
}