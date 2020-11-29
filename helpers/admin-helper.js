var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
module.exports={
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
           let user=await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:userData.Email})
           if(user){
               bcrypt.compare(userData.Password,user.Password).then((status)=>{
                   if(status){
                       console.log("login success");
                       response.user=user
                       response.status=true
                       resolve(response)
                   }else{
                       console.log("wrong password");
                       resolve({status:false})
                   }
               })
           }else{
               console.log("Email not found");
               resolve({status:false})
           }
        })
    },
    addVendor:(vendorData)=>{
        return new Promise(async(resolve,reject)=>{
            let Password=await bcrypt.hash(vendorData.Password,10)
            db.get().collection(collection.VENDOR_COLLECTION).insertOne(vendorData).then((data)=>{
                resolve(data.ops[0]._id)
            })
        })
    }
}