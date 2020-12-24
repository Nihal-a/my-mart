var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
const { response } = require('express')
var objectId=require('mongodb').ObjectID
const { ObjectId } = require('mongodb')
module.exports={
    getAllVendors:()=>{
        return new Promise(async(resolve,reject)=>{
            let vendors=await db.get().collection(collection.VENDOR_COLLECTION).find().toArray()
            resolve(vendors)
        })
    },
    getVendorProduct:(venId)=>{
        return new Promise(async(resolve,reject)=>{
            let vendor=await db.get().collection(collection.PRODUCT_COLLECTION).findOne({vendor:objectId(venId)})
            if(vendor){
                resolve(vendor.products)
            }else{
                resolve()
            }
        })
    }
    
}