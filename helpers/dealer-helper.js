var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectID

module.exports={
    doLogin:(dealerData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let dealer=await db.get().collection(collection.VENDOR_COLLECTION).findOne({Name:dealerData.Name})
            if(dealer){
                bcrypt.compare(dealerData.Password,dealer.Password).then((status)=>{
                    if(status){
                        console.log("login Success");
                        response.dealer=dealer
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("wrong password");
                        resolve({status:false})
                    }
                })
            }else{
                console.log("Username not found");
                resolve({status:false})
            }
        })
    },
    findBannedDealers:(venDetails)=>{
        return new Promise(async(resolve,reject)=>{
            status=false
            let bannedVendor=await db.get().collection(collection.BAN_COLLECTION).findOne({Name:venDetails.Name})
            if(bannedVendor){
                resolve(status=true)
            }else{
                resolve(status=false)
            }
        })
    },
    addProduct:(venId,proDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let venderProducts = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({vendor:objectId(venId)})
            if(venderProducts){
                db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne({vendor:objectId(venId)},
                    {
                        $push:{products:proDetails}
                    }
                ).then((response)=>{
                    resolve()
                })
            }else{
                let productObj = {
                    vendor:(objectId(venId)),
                    products:[proDetails]
                }
                db.get().collection(collection.PRODUCT_COLLECTION).insertOne(productObj).then((response)=>{
                    resolve()
                })
            }
        })
    }
}