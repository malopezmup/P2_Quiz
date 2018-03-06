//preguntas
const fs = require("fs");
const DB_FILENAME = "quizzes.json"

let quizes = [
{
	question:"Capital de Malasia",
	answer:"Kuala Lumpur"
},
{
	question:"Capital de Mozambique",
	answer:"Maputo"
},
{
	question:"Capital de España",
	answer:"Madrid"
},
{
	question:"Capital de Noruega",
	answer:"Oslo"
}];


const load = () =>{

	fs.readFile(DB_FILENAME, (err, data) => {
  if (err) {
    if (err.code === 'ENOENT') {
      save();
      return;
    }

    throw err;
  }
  	let json = JSON.parse(data);

  	if(json){
  		quizzes = json;
  	}
	});
};

//guardar
const save = () =>{

	fs.writeFile(DB_FILENAME, JSON.stringify(quizzes),
		err => {
			if (err) throw err;
		});
};




//contar elemntos
exports.count = () => quizzes.length;

//añadir
exports.add = (question, answer) =>{

	quizzes.push({
		question: (question || "").trim(),
		answer: (answer || "").trim()

	});
	save();
};

exports.update = (id, question, answer) => {

	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error(`El valor de id no es valido,`);
	}
	quizzes.splice(id, 1 ,{
		question: (question || "").trim(),
		answer: (answer || "").trim()
	});
	save();
};
//devuelve todos los quizes
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));

//dame el quiz de id que se ponga como parametro
exports.getByIndex = id => {
	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error(`El valor del parámetro id no es valido,`);
	}
	return JSON.parse(JSON.stringify(quiz));
}; 

//Borrar el quiz de id seleccionado
exports.delete = id => {
	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error(`El valor del parámetro id no es valido,`);
	}
	quizzes.splice(id, 1);
	save();
};


load();