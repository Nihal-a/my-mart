var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
const { response } = require('express')
var objectId=require('mongodb').ObjectID
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
            vendorData.Password=await bcrypt.hash(vendorData.Password,10)
            db.get().collection(collection.VENDOR_COLLECTION).insertOne(vendorData).then((data)=>{
                resolve(data.ops[0]._id)
            })
        })
    },
    getAllVendors:()=>{
        return new Promise(async(resolve,reject)=>{
            let vendors=await db.get().collection(collection.VENDOR_COLLECTION).find().toArray()
            resolve(vendors)
        })
    },
    deleteVendor:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VENDOR_COLLECTION).removeOne({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getVenderDetails:(venId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VENDOR_COLLECTION).findOne({_id:objectId(venId)}).then((vendor)=>{
                resolve(vendor)
            })
        })
    },
    updateVendor:(venId,venDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VENDOR_COLLECTION).updateOne({_id:objectId(venId)},{
                $set:{
                    Name:venDetails.Name,
                    Address:venDetails.Address,
                    Storename:venDetails.Storename,
                    Extrainfo:venDetails.Extrainfo,
                    Phone:venDetails.Phone
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
   
}