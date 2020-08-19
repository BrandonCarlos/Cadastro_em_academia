//Guardar os dados em um arquivo JSON
const fs = require('fs')//'fs' trabalha com arquivos do SISTEMA
//Linha abaixo é para escrever dados no arquivo "data.json" e escrever mais dados e mantelos
const data = require('../data.json')
//Toda vez que EXPORTAMOS podemos CAPTURA-LA AKI com o IMPORT
const { age, date } = require('../utils')


exports.index = function (req, res) {
  return res.render('Instructors/index', { instructors: data.instructors })//Ou seja acessar a PASTA "instructors" e acesse o arquivo "index.njk"

}


exports.create = function (req, res) {
  //Pedindo para RENDERIZAR O arquivo "create.njk"
  return res.render('instructors/create')

}


//ESTE ARQUIVO IRÁ EXPORTAR AS FUNÇÔES CREATE, READ, UPDATE, DELETE

//Vou querer EXPORTAR função para o CREATE, UPDATE, DELETE
//CREATE
exports.post = function (req, res) {
  // req.query
  // req.body
  //Agora eu posso usar essas VARIAVEIS: "avatar_url", "name", "birth", "gender", "services"

  //Se o "name" for diferente de VAZIO então ...
  //Validando os dados do FORMULÁRIO
  //Vamos usar uma estratégia de TODOS OS CAMPOS SÃO OBRIGATÓRIOS
  //if (req.body.name == "") {
  //Se ele estiver diferente de vazio pode mostrar o nome
  //return res.send("Preencha o nome do instrutor")
  //}

  //Object = "Constructor" que vai te criar um OBJETO
  //A linha abaixo retorna isto: ARRAY
  //[
  //"avatar_url",
  //"name",
  //"birth",
  //"gender",
  //"services"
  //]

  //req.body {
  //"avatar_url": "",
  //"name": "",
  //"birth": "",
  //"gender": "M",
  //"services": ""
  //}
  const keys = Object.keys(req.body)
  //keys pegou somente as CHAVES do nosso OBJETO e não pegou os VALORES
  //Vamos percorrer este ARRAY e verificar se algum deles está vazio, se estiver vazio eu quero imprimir uma mensagem
  for (key of keys) {
    //Para cada item do "keys"
    //req.body.key == ""
    //Se o que estiver no MOMENTO estiver VÁZIO entao ..
    if (req.body[key] == "") {
      return res.send("Please, fill all fields!")
    }
  }

  //Se tiver dados que eu não preciso? por isso vamos DESESTRUTURAR O OBJETO
  //Vai pegar de dentro do "req.body" vai DESESTRUTURAR e vai pegar só o que eu to pedindo aki
  //no caso "avatar_url"
  let { avatar_url, birth, name, services, gender } = req.body


  //Irá pegar a data de aniversário e transformar em MILISEGUNDOS
  //Ou seja ele transforma em MILISEGUNDOS e joga no mesmo lugar(birth)
  //ex: birth: 1245645645
  birth = Date.parse(birth)

  //Date.now() irá criar uma DATA DESTE MOMENTO AGORA
  //const porque essas váriaveis não existem ainda
  const created_at = Date.now()

  //A linha abaixo está GARANTINDO QUE ID SERÁ DO TIPO NÚMERICO
  //ex: La no nosso JSON irá criar o ATRIBUTO "id" do tipo NÚMERICO
  //{
  // id: 1  
  //}

  //const porque essas váriaveis não existem ainda
  const id = Number(data.instructors.length + 1)



  //Chave será INSTRUCTORS
  //[]
  //Na linha abaixo está acessando o arquivo data.json entrando no OBJETO "intructors"
  //e adicionando o que colocarmos no FORMULÁRIO e os arquivo se mantém
  //ou seja podemos colocar 100 arquivos lá e os dados não se perdem

  //Organizando os dados que eu quero ENVIAR aki pra dentro
  //Os item's abaixo são os que eu estou enviando para o DATA.JSON
  data.instructors.push({
    //Então estou usando dentro do PUSH:
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at,
  })// [{...}] ou seja aki irá manter os dados que colocarmos no FORMULÁRIO


  //Configurando aonde vamos guardar os dados 
  //JSON.stringify para transformar o OBJETO de JAVASCRIPT para OBJETO JSON
  //Callback FUNCTION é uma FUNÇÃO que vai ser executada depois de alguma coisa
  //no caso Depois de escrever o arquivo "data.json" ele vai executar uma FUNÇÃO
  //Pra que é IMPORTANTE uma CALLBACK FUNCTION?
  //Para não BLOQUEAR O SEU APLICATIVO

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send('Write fails error!')

    //Escreveu o arquivo data.json ? blz então redireciona para /instructors
    return res.redirect(`/instructors/${id}`)
  })

  //return res.send(req.body)
  //return res.send(req.body)
}

//Para mostrar os dados do INSTRUCTOR
//se acessar INSTRUCTOR com id 1 será mostrado um INSTRUCTOR
//e se acessar um INSTRUCTOR com id 2 será mostrado um INSTRUCTOR DIFERENTE
//SHOW
exports.show = function (req, res) {
  //E aqui vamos pegar o id: 1
  //req.query ex:
  //localhost:3000/instructor?id=1
  //req.body ex: pega do corpo da requisição ou seja pega do BODY(ex: FORMULÁRIO)
  //Estou RETIRANDO DO REQ.PARAMS O id e fazendo com que ele seja um VÁRIAVEL
  const { id } = req.params

  //Vamos encontrar o INSTRUCTOR dentro do DATA(arquivo DATA.JSON)
  //Cada vez que ele encontrar um INSTRUTOR dentro do ARRAY DE INSTRUCTORES
  //Então irá passar o INSTRUTOR do momento
  const foundInstructor = data.instructors.find(function (instructor) {
    return instructor.id == id
  })

  //Se não encontrar o INSTRUCTOR
  if (!foundInstructor) return res.send('Instructor not found!')


  //Vamos CORRIGIR OS DADOS
  const instructor = {

    //O resto das váriaveis vamos ESPALHAR NO INSTRUCTOR
    //o OPERADOR SPREAD
    //ESPALHAR: TRAZER AS OUTRAS VÁRIAVEIS AKI TAMBÉM
    //Operador "SPREAD" = ... 
    //OBS: gender, services, created_at tudo isso está dentro do ...foundInstructor  
    //Então não é necessário colocar esses "dados"? não, pois vamos arrumar o "AGE" ainda
    ...foundInstructor,
    age: age(foundInstructor.birth),
    //SPLIT = irá transformar STRING EM ARRAY e irá quebrar quando achar VIRGULA
    services: foundInstructor.services.split(","),
    created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
  }


  //Caso ENCONTRE O INSTRUCTOR .. 
  //To RENDERIZANDO MAIS NÃO TO PASSANDO O DADO, pra enviar o DADO
  //Mandamos desse FORMA { instructor: foundInstructor }
  return res.render("instructors/show", { instructor })
}

//EDIT
exports.edit = function (req, res) {
  //Mandando um OBJETO lá pro "EDIT", ou seja MANDANDO OBJETO PRO FRONT-END
  //Precisamos pegar apenas UM INSTRUCTOR

  //E aqui vamos pegar o id: 1
  //req.query ex:
  //localhost:3000/instructor?id=1
  //req.body ex: pega do corpo da requisição ou seja pega do BODY(ex: FORMULÁRIO)
  //Estou RETIRANDO DO REQ.PARAMS O id e fazendo com que ele seja um VÁRIAVEL
  const { id } = req.params

  //Vamos encontrar o INSTRUCTOR dentro do DATA(arquivo DATA.JSON)
  //Cada vez que ele encontrar um INSTRUTOR dentro do ARRAY DE INSTRUCTORES
  //Então irá passar o INSTRUTOR do momento
  const foundInstructor = data.instructors.find(function (instructor) {
    return id == instructor.id
  })

  //Se não encontrar o INSTRUCTOR
  if (!foundInstructor) return res.send('Instructor not found!')

  const instructor = {
    ...foundInstructor,
    birth: date(foundInstructor.birth).iso //Está linha está RETORNANDO 2000-7-5

  }


  // instructor.birth = 73654664565 milisegundos
  // date(instructor.birth)
  // return no formato yyyy-mm-dd   

  //Chamando a FUNÇÃO


  return res.render('instructors/edit', { instructor })
}

//PUT
exports.put = function (req, res) {
  //Mandando um OBJETO lá pro "EDIT", ou seja MANDANDO OBJETO PRO FRONT-END
  //Precisamos pegar apenas UM INSTRUCTOR

  //E aqui vamos pegar o id: 1
  //req.query ex:
  //localhost:3000/instructor?id=1
  //req.body ex: pega do corpo da requisição ou seja pega do BODY(ex: FORMULÁRIO)
  //Estou RETIRANDO DO REQ.PARAMS O id e fazendo com que ele seja um VÁRIAVEL
  const { id } = req.body

  let index = 0;

  //Vamos encontrar o INSTRUCTOR dentro do DATA(arquivo DATA.JSON)
  //Cada vez que ele encontrar um INSTRUTOR dentro do ARRAY DE INSTRUCTORES
  //Então irá passar o INSTRUTOR do momento
  const foundInstructor = data.instructors.find(function (instructor, foundIndex) {
    if( id == instructor.id) {
      index = foundIndex
      return true
    }
  })

  //Se não encontrar o INSTRUCTOR
  if (!foundInstructor) return res.send('Instructor not found!')

  //Se encontrar o INSTRUCTOR ai vem para a linha de baixo
  const instructor = {
    ...foundInstructor,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)//ID será RETORNADO como NÚMERO

  }

  data.instructors[index] = instructor

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write error!")

    return res.redirect(`/instructors/${id}`)
  })

}

//Delete
exports.delete = function(req, res) {
  const { id } = req.body
  const filteredInstructors = data.instructors.filter(function(instructor){
    return instructor.id != id
  })

  data.instructors = filteredInstructors

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
    if(err) return res.send("Write file error!")

    return res.redirect("/instructors")
  })
}

