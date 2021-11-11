const functions = require("firebase-functions");
const admin = require("firebase-admin")
const stripe = require('stripe')('sk_test_51JdT8ABTMX0Txwgt5sk68HsKyhzIIf1bkV41cuf8Sx9UU6LtkVbBySRsXx0XyapRPfhDStIKQzJ4BtvGNUj8LQL400nOEVSR2V');

admin.initializeApp()
const db = admin.firestore()


exports.users = functions.https.onRequest(async(request,response) =>{
  const snapshot = await db.collection("users").get()
  const users = snapshot.empty?
   []
   : snapshot.docs.map(doc=>Object.assign(doc.data(),{id:doc.id}))
  response.send(users)
})

exports.vendors = functions.https.onRequest(async(request,response) =>{
  const snapshot = await db.collection("vendors").get()
  const users = snapshot.empty?
   []
   : snapshot.docs.map(doc=>Object.assign(doc.data(),{id:doc.id}))
  response.send(users)
})

exports.products = functions.https.onRequest(async(request,response) =>{
  const snapshot = await db.collection("products").get()
  const users = snapshot.empty?
   []
   : snapshot.docs.map(doc=>Object.assign(doc.data(),{id:doc.id}))
  response.send(users)
})

exports.catagories = functions.https.onRequest(async(request,response) =>{
  const snapshot = await db.collection("categories").get()
  const users = snapshot.empty?
   []
   : snapshot.docs.map(doc=>Object.assign(doc.data(),{id:doc.id}))
  response.send(users)
})
exports.orders = functions.https.onRequest(async(request,response) =>{
  const snapshot = await db.collection("orders").get()
  const users = snapshot.empty?
   []
   : snapshot.docs.map(doc=>Object.assign(doc.data(),{id:doc.id}))
  response.send(users)
})
exports.requests = functions.https.onRequest(async(request,response) =>{
  const snapshot = await db.collection("requests").get()
  const requests = snapshot.empty?
   []
   : snapshot.docs.map(doc=>Object.assign(doc.data(),{id:doc.id}))
  response.send(requests)
})



exports.completePaymentWithStripe = functions.https.onRequest(async(request,response)=>{
  const body = JSON.parse(request.body)
  const charge = await stripe.charges.create({
    amount:body.amount,
    currency:body.currency,
    source:body.token
  })
  console.log(request.body)
  response.send("Success")
})

exports.updateUserMobile = functions.https.onRequest(async(request,response)=>{
  const body = JSON.parse(request.body)
  const mobile = body.mobile
  const currentUserID = body.id
  const ref = await db.collection('users').doc(currentUserID).update({mobile})
  response.send(mobile)
})

exports.updateUserProfile = functions.https.onRequest(async(request,response)=>{

  const body = JSON.parse(request.body)
  console.log(body)
  const mobile = body.mobile
  const currentUserID = body.id
  const username= body.username
  const address= body.address
  const lastname= body.lastname
  const language = body.language
  const cards = body.cards
  const paymentMethod = body.paymentMethod
  const location = body.location
  const createAt = admin.firestore.FieldValue.serverTimestamp()
  
 
  await db.collection('users').doc(currentUserID).update({mobile})
  await db.collection('users').doc(currentUserID).update({username})
  await db.collection('users').doc(currentUserID).update({lastname})
  await db.collection('users').doc(currentUserID).update({address})
  await db.collection('users').doc(currentUserID).update({language})
  await db.collection('users').doc(currentUserID).update({cards})
  await db.collection('users').doc(currentUserID).update({paymentMethod})
  await db.collection('users').doc(currentUserID).update({createAt})
    await db.collection('users').doc(currentUserID).update({location})
  response.send("Success")
 
}) 

exports.createRequest = functions.https.onRequest(async(request,response)=>{
  try{
  const body = JSON.parse(request.body)
  const productId = body.productId
  const vendorId = body.vendorId
  const customerId = body.customerId
  const ref = await db.collection('requests').add({vendorId,productId,customerId})
  response.send({id:ref.id,vendorId,customerId,productId})
  }catch(err){
    console.log("Success")
  }
})

exports.createOrder = functions.https.onRequest(async(request,response)=>{
    try{
    const body = JSON.parse(request.body)
    const createAt = admin.firestore.FieldValue.serverTimestamp()
    const customerId = body.customerId
    const deliveryCharge = body.deliveryCharge
    const discount = body.discount
    const paymentMethod = body.paymentMethod
    const status = "pending"
    const subTotal = body.subTotal
    const totalCount = body.totalCount
    const totalPrice = body.totalPrice
    const transactionId = ""
    const vendorId = body.vendorId
    const items = body.items
    console.log(items)
    const ref = await db.collection('orders').add({
      createAt,
      items,
      vendorId,
      customerId,
      deliveryCharge,
      discount,
      paymentMethod,
      status,
      subTotal,
      totalCount,
      totalPrice,
      transactionId
    })
    response.send({
      id:ref.id, 
      createAt,
      items,
      vendorId,
      customerId,
      deliveryCharge,
      discount,
      paymentMethod,
      status,
      subTotal,
      totalCount,
      totalPrice,
      transactionId})
    }catch(err){
      console.log(err.message)
  }
})








exports.getUserById = functions.https.onRequest(async(request,response)=>{
  try{
    const body = JSON.parse(request.body)
    const currentUserID = body.id
    const snapshot = await db.collection('users').doc(currentUserID).get()

    response.send(Object.assign(snapshot.data(),{id:snapshot.id}))
  }catch(err){
    console.log(err.message)
  }

})