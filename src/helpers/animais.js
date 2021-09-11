var MIN = 0.0,
  MAX = 1.0;

export const gerarAnimais = (machos, femeas) => {
  let arrayVacas = [],
    arrayTouros = [];

  for (let i = 0; i < machos; i++) {
    arrayTouros.push({
      id: i,
      idGeral: i,
      contribuicao: Math.random() * (MAX - MIN) + MIN,
      sexo: "macho",
      acasalamentos: 0
    });
  }

  for (let i = 0; i < femeas; i++) {
    arrayVacas.push({
      id: i,
      idGeral: i + machos,
      contribuicao: Math.random() * (MAX - MIN) + MIN,
      sexo: "femea"
    });
  }

  return { arrayVacas, arrayTouros };
};

export const contagemAcasalamentos = (matriz, touros) => {
  const qtdLinhas = matriz.length;

  for (let i = 0; i < qtdLinhas; i++) {
    const vacas = matriz[i];
    let contagem = 0;

    for (let j = 0; j < vacas.length; j++) {
      if (vacas[j] === 1) {
        contagem = contagem + 1;
      }
    }

    touros[i].acasalamentos = contagem;
  }

  return touros;
};

const vacasPossiveisAcasalar = (touroIndice, matrizP, touros, vacas) => {
  const linhaMatriz = matrizP[touroIndice];

  touros[touroIndice].pares = linhaMatriz.map((item, index) => {
    if (linhaMatriz[index] == 0) {
      return vacas[index];
    } else {
      return {};
    }
  });

  const ordenados = touros[touroIndice].pares.sort((a, b) => (a.id > b.id ? 1 : -1));

  touros[touroIndice].pares = ordenados;
};
