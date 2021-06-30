const express = require('express');
const authRouter = express.Router();
const jwt = require ('jsonwebtoken');
const { update } = require('../model/Userdata');

const Userdata = require('../model/Userdata');

function router() {
    // SIGN UP
    authRouter.post('/signUp',function(req,res){
       console.log(req.body);
       let userData = req.body;

       //Verify is email/chatHadndle is already registered 
       
       Userdata.count({ username:userData.username}) 
       .then((count) => { 
         if (count > 0) { 
           console.log('Username exists.'); 
           res.sendStatus(404);
         } else { 
           console.log('Username does not exist.');
              Userdata.count({ email:userData.email})
                .then((count) => { 
                  if (count > 0) { 
                    console.log('Email exists.'); 
                    res.sendStatus(401);
                  } else { 
                      console.log('Username does not exist.');
                      //Save data to DB
                      var user = {
                        username: userData.username,
                        email: userData.email,
                        password: userData.password,
                        image:userData.image,
                        contacts:[]
                       }
                      var user = Userdata(user);
                      console.log('DB USER-',user);
                      user.save();
                      res.status(200).send({"message": "Data recieved"});
                   }
                  });
                }});   
       }); 
      


    authRouter.post('/signIn',function(req,res){
      console.log(req.body);
      let username =req.body.username;
      let password =req.body.password;   
  
     Userdata.findOne({username:username})
     .then(function(user){
           var id=user._id;
           console.log("User ID - ",id);
           if(user.password == password)
           {           
             // res.status(200).send({"message": "Valid User"});
            let payload = {subject: username + password};
            let token = jwt.sign(payload,'secretKey');
            res.status(200).send({token,id});
             }
           else{
              res.status(401).send('Invalid Credentials');
              }
      })
      .catch( ()=> {
              res.status(404).send({"message": "User not found! Please SIGN UP!"});
    });

  })

  authRouter.get('/getUser/:id',function(req,res){
    const id = req.params.id;
    Userdata.findOne({"_id":id})
      .then((user)=>{
          res.send(user);
      });
})

//EXTRA ROUTES

//search User
authRouter.post('/searchUser',function (req,res){
    const username=req.body.username;
    Userdata.find( { "username": { $regex:`${username}`, $options: "i" } })
       .then((users)=>{
         console.log('Users..',users);
         res.send(users);
       })
    
})

//change DP
authRouter.post('/changeDP/:id',function (req,res){
  const id = req.params.id;
  console.log('Updating - ', req.body);
  var update = Userdata.findByIdAndUpdate(id,{
    image:req.body.image
  });
   update.exec(function (err,data){
    res.status(200).send(data);
   })
  });

  //add contact


  authRouter.post('/addContact/:id',function (req,res){
    const id = req.params.id;
    console.log('Updating - ', req.body);
    var contact={
      name:req.body.username,
      image:req.body.image,
      isMuted:false,
      isBlocked:false
    }
    var update = Userdata.findByIdAndUpdate(id,
      { $push: { contacts: contact } },
     );
     update.exec(function (err,data){
      res.status(200).send(data);
     })
    });

    //block User

    authRouter.post('/blockUser/:id',function (req,res){
      const id = req.params.id;
      const toUser = req.body.toUser;
      Userdata.findOne({"_id":id})
      .then((user) =>{
             
             user.contacts.forEach(contact => {
               if(contact.name == toUser){
                contact["isBlocked"] = true;              
               }                           
             });
             user.save();
           
            console.log('Blocked in DB',user)
            res.status(200);
        })
    })  

    //unblock user
    authRouter.post('/unblockUser/:id',function (req,res){
      const id = req.params.id;
      const toUser = req.body.toUser;
      Userdata.findOne({"_id":id})
      .then((user) =>{
             
             user.contacts.forEach(contact => {
               if(contact.name == toUser){
                contact["isBlocked"] = false;              
               }                             
             });
             user.save();
            console.log('Unblocked in DB',user)
            res.status(200);
        })
    })  

    authRouter.post('/muteUser/:id',function (req,res){
      const id = req.params.id;
      const toUser = req.body.toUser;
      Userdata.findOne({"_id":id})
      .then((user) =>{
             
             user.contacts.forEach(contact => {
               if(contact.name == toUser){
                contact["isMuted"] = true;              
               }                             
             });
             user.save();
            console.log('Muted in DB',user)
            res.status(200);
        })
    })  

    authRouter.post('/unmuteUser/:id',function (req,res){
      const id = req.params.id;
      const toUser = req.body.toUser;
      Userdata.findOne({"_id":id})
      .then((user) =>{
             
             user.contacts.forEach(contact => {
               if(contact.name == toUser){
                contact["isMuted"] = false;              
               }                             
             });
             user.save();
            console.log('Unmuted in DB',user)
            res.status(200);
        })
    })  
      
    return authRouter;
}

module.exports = router;