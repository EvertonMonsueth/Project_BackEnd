const express = require('express')
//importando a biblioteca express para axiliar nas rotas e nos Middleware
const uuid = require('uuid')//importa a biblioteca UUID na variavel UUID, gerar id universal
const app = express() //para facilitar a digitação coloca app para buscar uma função express
//criamos uma variavel par ligar as rotas na biblioteca e chamada de APP
app.use(express.json())//use ferramenta do express - comunica express que vai comunicar via json
const port = 3000 //posrta para direcionar o navegador a aplicação
const users = [] //cria um ARRAY chamado USERS(usado para estudo -aqui qnd servidor é iniciado
// perde informação)

const middleware = (request, response, next)=>{//INTERCEPTA tem o poder de parar ou alterar a requisição
    //checar o id de entrada dentro do array
    const {id} = request.params//cria uma variavel com id entrada pelo requerimento
    const index = users.findIndex(user => user.id === id)//findIndex busca posicionamente dentro array com id entrada
    if (index < 0){ //se a função nao for atendida retorna -1 o IF retorna
        return response.status(404).json("id não encontrado no array")
    }
    request.userIndex = index
    request.userId = id
    next() //NEXT possibilita a continuação do Código
}
app.get('/users', (request, response) => {//navegador usa GET busca informação no BACKEND
    //usas as funçoes REQUEST e RESPONSE
    return response.json(users)//retorna com os dados do array para FRONTEND
    
    //app.get('/users/:id', (request, response) => {//navegador usa get e a função request e response
    // const {id} = request.params //Recebe um dado como Id pelo get
    // console.log(id)
    // return response.json({id}) //Retorna para o site como json ({})

    //const {name, age} = request.query //cria variavel que exista na biblioteca requesty.query
    //console.log(name, age)
    //return response.send('Hello todo mundo') //response(responde), send pode ser texto 
    //return response.json({name, age}) //retorna para o FRONTEND usando o json como tradutor
})
app.post('/users', (request, response) => {//navegador usa POST CRIA informação no BACKEND
    const {name, age} = request.body //chega via POST request.body informação para variavel name e age
    const user = {id: uuid.v4(), name, age} // gera um ID UNIVERSAL pela biblioteca UUID
    // na variavel user ID NAME AGE
    users.push(user)//PUSH adiciona o USER no ARRAY USERS
    console.log(user)
    return response.status(201).json(user)//retorna para FRONTEND usando json, USER adicionado ao 
    //array - STATUS (201) user criado com sucesso.
    
})
app.put('/users/:id', middleware, (request, response) => {//navegador usa PUT ATUALIZA informação no BACKEND
    //const {id} = request.params //recebe do FRONTEND a requisição tipo params na variavel Id 
    const {name, age } = request.body //recebe do FRONTEND a requisição tipo body na variavel name e age
    const id = request.userId
    const index = request.userIndex
    const updateUser = {id, name, age} //Salva na variavel updateUser o id, name, age digitado
    users[index]= updateUser//se for encontrado users[index] recebe atualização
    return response.json(updateUser)//retorna para FRONTEND atualização pelo json
})
app.delete('/users/:id', middleware, (request, response) => {//navegador usa DELETE para deletar informações do BACKEND
    //const {id} = request.params //função delete recebe o id pelo requisição.params
    const index = request.userIndex // 
    users.splice(index, 1)//possibilita deletar numero de posição do array index = id digitado e 1 é numero de posição
    return response.status(204).json()
})

app.listen(port, () =>{
    console.log(`💥 Server Started on port ${port} 💥`)
}) //aqui informa ao express.listen em qual porta a aplicação vai rodar porta 3000

