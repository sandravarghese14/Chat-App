const express = require('express');
const msgRouter = express.Router();

const Messagedata = require('../model/Messagedata');

function router() {


    msgRouter.post('/load',function(req,res){
        console.log('Room - ',req.body.rooms)
        let room1=req.body.room;
        let room2=req.body.roomalt;
        
        Messagedata.find({$or:[{"room":room1},{"room":room2}] }).sort({datefield: 1})
        .then((chats) =>{
            console.log('chats-',chats)
            res.send(chats);
        })
    })
    return msgRouter;
}

module.exports = router;