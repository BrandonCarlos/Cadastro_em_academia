//Guardar os dados em um arquivo JSON
const fs = require('fs')//'fs' trabalha com arquivos do SISTEMA
//Linha abaixo é para escrever dados no arquivo "data.json" e escrever mais dados e mantelos
const data = require('../data.json')
//Toda vez que EXPORTAMOS podemos CAPTURA-LA AKI com o IMPORT
const { date } = require('../utils')


exports.index = function (req, res) {
  return res.render('members/index', { members: data.members })//Ou seja acessar a PASTA "members" e acesse o arquivo "index.njk"

}



exports.create = function (req, res) {
  //Pedindo para RENDERIZAR O arquivo "create.njk"
  return res.render('members/create')

}


//ESTE ARQUIVO IRÁ EXPORTAR AS FUNÇÔES CREATE, READ, UPDATE, DELETE

//Vou querer EXPORTAR função para o CREATE, UPDATE, DELETE
//CREATE
exports.post = function (req, res) {
 
  const keys = Object.keys(req.body)
  
  for (key of keys) {
  
    if (req.body[key] == "") {
      return res.send("Please, fill all fields!")
    }
  }

  birth = Date.parse(req.body.birth)

  let id = 1
  const lastMember = data.members[data.members.length - 1]


  if(lastMember) {
    id = lastMember.id + 1
  }

  data.members.push({
    ...req.body,
    id,
    birth
  })


  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send('Write fails error!')

    return res.redirect(`/members/${id}`)
  })
}

//Para mostrar os dados do INSTRUCTOR
//se acessar INSTRUCTOR com id 1 será mostrado um INSTRUCTOR
//e se acessar um INSTRUCTOR com id 2 será mostrado um INSTRUCTOR DIFERENTE
//SHOW
exports.show = function (req, res) {
  //E aqui vamos pegar o id: 1
  //req.query ex:
  //localhost:3000/member?id=1
  //req.body ex: pega do corpo da requisição ou seja pega do BODY(ex: FORMULÁRIO)
  //Estou RETIRANDO DO REQ.PARAMS O id e fazendo com que ele seja um VÁRIAVEL
  const { id } = req.params

  //Vamos encontrar o INSTRUCTOR dentro do DATA(arquivo DATA.JSON)
  //Cada vez que ele encontrar um INSTRUTOR dentro do ARRAY DE INSTRUCTORES
  //Então irá passar o INSTRUTOR do momento
  const foundMember = data.members.find(function (member) {
    return member.id == id
  })

  //Se não encontrar o INSTRUCTOR
  if (!foundMember) return res.send('Member not found!')


  //Vamos CORRIGIR OS DADOS
  const member = {

    //O resto das váriaveis vamos ESPALHAR NO INSTRUCTOR
    //o OPERADOR SPREAD
    //ESPALHAR: TRAZER AS OUTRAS VÁRIAVEIS AKI TAMBÉM
    //Operador "SPREAD" = ... 
    //OBS: gender, services, created_at tudo isso está dentro do ...foundMember  
    //Então não é necessário colocar esses "dados"? não, pois vamos arrumar o "AGE" ainda
    ...foundMember,
    birth: date(foundMember.birth).birthDay
    //SPLIT = irá transformar STRING EM ARRAY e irá quebrar quando achar VIRGULA
  }


  //Caso ENCONTRE O INSTRUCTOR .. 
  //To RENDERIZANDO MAIS NÃO TO PASSANDO O DADO, pra enviar o DADO
  //Mandamos desse FORMA { member: foundMember }
  return res.render("members/show", { member })
}

//EDIT
exports.edit = function (req, res) {
  //Mandando um OBJETO lá pro "EDIT", ou seja MANDANDO OBJETO PRO FRONT-END
  //Precisamos pegar apenas UM INSTRUCTOR

  //E aqui vamos pegar o id: 1
  //req.query ex:
  //localhost:3000/member?id=1
  //req.body ex: pega do corpo da requisição ou seja pega do BODY(ex: FORMULÁRIO)
  //Estou RETIRANDO DO REQ.PARAMS O id e fazendo com que ele seja um VÁRIAVEL
  const { id } = req.params

  //Vamos encontrar o INSTRUCTOR dentro do DATA(arquivo DATA.JSON)
  //Cada vez que ele encontrar um INSTRUTOR dentro do ARRAY DE INSTRUCTORES
  //Então irá passar o INSTRUTOR do momento
  const foundMember = data.members.find(function (member) {
    return id == member.id
  })

  //Se não encontrar o INSTRUCTOR
  if (!foundMember) return res.send('Member not found!')

  const member = {
    ...foundMember,
    birth: date(foundMember.birth).iso //Está linha está RETORNANDO 2000-7-5

  }


  // member.birth = 73654664565 milisegundos
  // date(member.birth)
  // return no formato yyyy-mm-dd   

  //Chamando a FUNÇÃO


  return res.render('members/edit', { member })
}

//PUT
exports.put = function (req, res) {
  //Mandando um OBJETO lá pro "EDIT", ou seja MANDANDO OBJETO PRO FRONT-END
  //Precisamos pegar apenas UM INSTRUCTOR

  //E aqui vamos pegar o id: 1
  //req.query ex:
  //localhost:3000/member?id=1
  //req.body ex: pega do corpo da requisição ou seja pega do BODY(ex: FORMULÁRIO)
  //Estou RETIRANDO DO REQ.PARAMS O id e fazendo com que ele seja um VÁRIAVEL
  const { id } = req.body

  let index = 0;

  //Vamos encontrar o INSTRUCTOR dentro do DATA(arquivo DATA.JSON)
  //Cada vez que ele encontrar um INSTRUTOR dentro do ARRAY DE INSTRUCTORES
  //Então irá passar o INSTRUTOR do momento
  const foundMember = data.members.find(function (member, foundIndex) {
    if( id == member.id) {
      index = foundIndex
      return true
    }
  })

  //Se não encontrar o INSTRUCTOR
  if (!foundMember) return res.send('Member not found!')

  //Se encontrar o INSTRUCTOR ai vem para a linha de baixo
  const member = {
    ...foundMember,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)//ID será RETORNADO como NÚMERO

  }

  data.members[index] = member

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write error!")

    return res.redirect(`/members/${id}`)
  })

}

//Delete
exports.delete = function(req, res) {
  const { id } = req.body
  const filteredmembers = data.members.filter(function(member){
    return member.id != id
  })

  data.members = filteredmembers

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
    if(err) return res.send("Write file error!")

    return res.redirect("/members")
  })
}

