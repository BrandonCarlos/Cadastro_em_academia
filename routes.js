//Inicio da CONFIGURAÇÃO DE ROTAS
const express = require('express');
const routes = express.Router()
//Agora que mandamos todo o código da função POST(CREATE) para o arquivo "intructor.js"
//vamos IMPORTAR AKI
const instructors = require('./controllers/instructors')
//IMPORTANDO A ROTA DE MEMBERS
const members = require('./controllers/members')


//Agora "routes" é RESPONSÁVEL PELAS ROTAS
//Invez do "server" agora vamos usar o "routes.get('/', function(){})"


routes.get('/', function (req, res) {
  //Está função irá DIRECIONAR(redirect) para localhost:5000/instructors
  //REDIRECIONAR PARA /instructors irá REDIRECIONAR para a linha abaixo veja
  //Estou dizendo se o usuário acessar localhost:5000/
  //que direcione este usuário para localhost:5000/instructors  que é a ROTA abaixo
  return res.redirect("/instructors")
})

routes.get('/instructors', instructors.index)

//Criando uma ROTA para o "create"
routes.get('/instructors/create', instructors.create)

//Está rota é para mostrar o INSTRUCTOR CADASTRADO ex:
//localhost:3000/instructor/1
//instructor com id: 1 é um INSTRUTOR DIFERENTE DO INSTRUTOR com id 2
routes.get('/instructors/:id', instructors.show)

routes.get('/instructors/:id/edit', instructors.edit)


//Quando o usuário clicar em SALVAR no FORMULÁRIO então irá direcionar para está página
//com o texto "RECEBIDO"
routes.post("/instructors", instructors.post)

//Se lembra que CONVERTEMOS O MÉTODO POST PARA PUT?
//Então aki está a ROTA daquele método PUT
//OBS: quem converteu de POST PARA PUT foi a DEPENDÊNCIA method_override
routes.put("/instructors", instructors.put)

//Lembre-se que no "instructor.post" estava todo aquele código que está no arquivo
//"instructors.js"

//ROTA PARA DELETAR UM INSTRUCTOR OU ALUNO
routes.delete("/instructors", instructors.delete)

//Acima é para os INSTRUTORES


//Abaixo é só para MEMBROS

routes.get('/members', members.index)

//Criando uma ROTA para o "create"
routes.get('/members/create', members.create)

//Está rota é para mostrar o INSTRUCTOR CADASTRADO ex:
//localhost:3000/instructor/1
//instructor com id: 1 é um INSTRUTOR DIFERENTE DO INSTRUTOR com id 2
routes.get('/members/:id', members.show)

routes.get('/members/:id/edit', members.edit)


//Quando o usuário clicar em SALVAR no FORMULÁRIO então irá direcionar para está página
//com o texto "RECEBIDO"
routes.post("/members", members.post)

//Se lembra que CONVERTEMOS O MÉTODO POST PARA PUT?
//Então aki está a ROTA daquele método PUT
//OBS: quem converteu de POST PARA PUT foi a DEPENDÊNCIA method_override
routes.put("/members", members.put)

//Lembre-se que no "instructor.post" estava todo aquele código que está no arquivo
//"members.js"

//ROTA PARA DELETAR UM INSTRUCTOR OU ALUNO
routes.delete("/members", members.delete)

//Agora precisamos EXPORTAR ESTE ARQUIVO
module.exports = routes