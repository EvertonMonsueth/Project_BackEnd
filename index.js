const express = require('express')
const uuid = require('uuid')
const app = express()
app.use(express.json())
const port = 3000 
const orders = [] 
app.use((request, response, next) => {
    console.log(`${request.method}  ${request.url}`);
    next();
});
const middleware = (request, response, next)=>{
    const {id} = request.params
    const index = orders.findIndex(order => order.id === id)
    if (index < 0){ 
        return response.status(404).json("Pedido não encontrado")
    }
    request.orderIndex = index 
    request.orderId = id 
    next()  
}
app.get('/order', (request, response) => {
     return response.json(orders)
})     
app.get('/order/:id', middleware, (request, response) => {
    //const index = request.orderIndex
    return response.json(orders[request.orderIndex])
})
app.post('/order', (request, response) => {
    const {pedido, name, price, status} = request.body
    const order = {id: uuid.v4(), pedido, name, price, status} 
    orders.push(order)
    console.log(order)
    return response.status(201).json(orders)
}) 
app.put('/order/:id', middleware, (request, response) => {
 
    const {pedido, name, price, status} = request.body
    const id = request.orderId
    const index = request.orderIndex
    const updateOrder = {id, pedido, name, price, status}
    orders[index]= updateOrder
    return response.json(updateOrder)
})
app.delete('/order/:id', middleware, (request, response) => {
    const index = request.orderIndex
    orders.splice(index, 1)
    return response.status(204).json()
})
app.patch('/order/:id', middleware, (request, response) => {
    const index = request.orderIndex
    orders[index].status = "Pronto"
    return response.json(orders[index])
})
app.listen(port, () =>{
    console.log(`💥 Server Started on port ${port} 💥`)
}) 


