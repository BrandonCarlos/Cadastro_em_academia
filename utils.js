module.exports = {
  //Lógica de idade
  age: function age(timestamp) {
    const today = new Date()
    const birthDate = new Date(timestamp)

    // 2020 - 1984 = 36
    let age = today.getFullYear() - birthDate.getFullYear()
    const month = today.getMonth() - birthDate.getMonth()

    //11- 12 = -1
    //11 - 11 = 0
    if (month < 0 || month == 0 && today.getDate() < birthDate.getDate()) {
      age = age - 1
    }

    return age

  },
  date: function (timestamp) {
    const date = new Date(timestamp)

    //Vamos pegar o ANO
    const year = date.getUTCFullYear() //UTC para PEGAR O TEMPO UNIVERSAL

    //Vamos pegar o MÊS
    //Aki os meses vão de 0 a 11
    //11 = DEZEMBRO e 0 = JANEIRO
    //O MÊS irá vir NÚMERICO
    const month = `0${date.getUTCMonth() + 1}`.slice(-2)//SLICE = CORTAR, Cortando a STRING
    //e pegando só o que me INTERESSA NELA = .slice(-2) Estou DIZENDO PEGA OS 2 ULTIMOS DIGITOS

    //Agora vamos pegar o DIA
    const day = `0${date.getUTCDate()}`.slice(-2)

    //Eu preciso montar ele dessa forma = return yyyy-mm-dd

    //Vamos RETORNAR UM OBJETO NO FORMATO "ISO"
    return {
      day, 
      month,
      year,
      iso: `${year}-${month}-${day}`,
      birthDay: `${day}/${month}`
    }

  }
}