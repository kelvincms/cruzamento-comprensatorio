var MIN = 0.0,
  MAX = 10.0;

export const gerarAnimais = (machos, femeas) => {
  let arrayVacas = [],
    arrayTouros = [];

  for (let i = 0; i < machos; i++) {
    arrayTouros.push({
      id: i,
      contribuicao: Math.random() * (MAX - MIN) + MIN,
      sexo: "macho",
      paresPossiveis: 0,
      acasalou: false,
      paresGarantidos: [],
    });
  }

  for (let i = 0; i < femeas; i++) {
    arrayVacas.push({
      id: i,
      paresPossiveis: 0,
      contribuicao: Math.random() * (MAX - MIN) + MIN,
      sexo: "femea",
      acasalou: false,
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

export const checaVacasTouros = (touros,vacas) =>{
for (let index = 0; index < touros.length; index++) {
  console.log("Touro: ",touros[index]);
}
for (let index = 0; index < vacas.length; index++) {
  console.log("Vaca: ",vacas[index]);
}
};
