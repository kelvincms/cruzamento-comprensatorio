import "./styles.css";

var MIN = 0.0,
  MAX = 1.0;

// interface Animal {
//   id: Number;
//   contribuicao: Number;
//   sexo: String;
// }
const vacas = [];
const touros = [];

const gerarAnimais = (machos, femeas) => {
  let animais = [];

  for (let i = 0; i < machos + femeas; i++) {
    animais[i] = {
      id: i,
      contribuicao: Math.random() * (MAX - MIN) + MIN,
      sexo: i < 5 ? "macho" : "femea"
    };
  }

  return animais;
};

const criarMatrizC = (animais) => {
  const matrizC = [];

  animais.forEach((element) => {
    if (element.sexo === "femea") {
      vacas.push(element);
    }
    if (element.sexo === "macho") {
      touros.push(element);
    }
  });

  for (let i = 0; i < touros.length; i++) {
    matrizC[i] = new Array(vacas.lenght);
  }

  for (let i = 0; i < touros.length; i++) {
    for (let j = 0; j < vacas.length; j++) {
      matrizC[i][j] = Math.floor(Math.random() * 2);
    }
  }

  return matrizC;
};

const mediaProleC = (matrizC) => {
  let sum = 0;
  let vetorContribuicaoIndividual = [];

  for (let i = 0; i < matrizC.length; i++) {
    for (let j = 0; j < matrizC[0].length; j++) {
      if (matrizC[i][j] === 1) {
        const contribuicaoIndividual =
          (touros[i].contribuicao + vacas[j].contribuicao) / 2;
        sum += (touros[i].contribuicao + vacas[j].contribuicao) / 2;
        vetorContribuicaoIndividual.push({
          contribuicaoIndividual: contribuicaoIndividual,
          touro: touros[i],
          vaca: vacas[j]
        });
      }
    }
  }

  const media = sum / vacas.length;

  return {
    media: media,
    vetorContribuicaoIndividual: vetorContribuicaoIndividual
  };
};

const criarMatrizP = () => {
  const matrizP = [];

  return matrizP;
};

export default function App() {
  return (
    <div className="App">
      <h1>Algoritmo de casalamento</h1>
    </div>
  );
}

const animais = gerarAnimais(5, 10);
const matrizC = criarMatrizC(animais);
const prole = mediaProleC(matrizC);

console.log(prole);
