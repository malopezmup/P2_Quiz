const model = require('./model');
const {log, biglog, errorlog, colorize} = require("./out");

exports.helpCmd = rl =>{
	console.log("Comandos");
	console.log(" h|help - Muestra esta yuda.");
	console.log(" list - lista los quizes existentes.");
	console.log(" show <id> - Muestra la pregunta y su respuesta en el quiz");
	console.log(" add - Añadir nuevo quiz.");
	console.log(" delete <id> - Borra el quiz indicado");
	console.log(" edit <id> - Edita el quiz indicado");
	console.log(" test <id> - Prueba el quiz indicado");
	console.log(" p|play - Jugar con preguntas aleatorias de todos los quizes");
	console.log(" credits - Créditos");
	console.log(" q|quit - Salir del programa");
	rl.prompt();
};

exports.quitCmd = rl =>{
	rl.close();
	rl.prompt();
};

exports.addCmd = rl =>{
	rl.question(colorize(' Introduzca una pregunta: ', 'red'), question =>{

			rl.question(colorize(' Introduzca la respuesta ', 'red'), answer=> {

				model.add(question, answer);
				log(` ${colorize('se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`),
				rl.prompt();
			});
		});
};

exports.listCmd = rl =>{

	model.getAll().forEach((quiz, id) =>{

		log(` [${colorize(id, 'magenta')}]: ${quiz.question} `);
	});
	rl.prompt();
};

exports.showCmd = (rl, id) => {
	
	if (typeof id === "undefined"){
		errorlog(`Falta el parametro id.`);
	} else {
		try{
			const quiz = model.getByIndex(id);
			log(` [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
		} catch(error){
			errorlog(error.message);
		}
	}

rl.prompt();
};

exports.testCmd = (rl,id) =>{
	if (typeof id === "undefined"){
		errorlog(`El valor del parámetro id no es válido.`);
		rl.prompt();
	} else {
		try{
			const quiz = model.getByIndex(id);
			rl.question(`${quiz.question}: `, answer =>{
				if(answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
					log('Su respuesta es correcta.');
					biglog(' Correcta', 'green');
					rl.prompt();
				}
				else{
					log('Su respuesta es incorrecta.');
					biglog(' Incorrecta', 'red');
					rl.prompt();
				}	
			});
			rl.prompt();
		} catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}
};
exports.deleteCmd = (rl,id) =>{
	if (typeof id === "undefined"){
		errorlog(`Falta el parametro id.`);
	} else {
		try{
			model.delete(id);
			
		} catch(error){
			errorlog(error.message);
		}
	}

rl.prompt();
};
	

exports.playCmd = rl => {
	let score = 0;
	pendientes = [];
	let long= model.count();
	for (i =0; i<model.count(); i++) {
		pendientes.push(i);
	}
	function numeroAleatorio(min, max) {
 			 return Math.round(Math.random() * (max - min) + min);
			}
	const askrandom = () => {

		if (pendientes.length===0){
			log("Fin");
			log(`Ha obtenido una puntuación de: ${colorize(score, 'green')} sobre ${colorize(long, 'green')}`);
			biglog(`${score}`, 'magenta');
			rl.prompt();
		}else{
					let randi = numeroAleatorio(0,pendientes.length-1);
					let id = pendientes[randi];
					pendientes.splice(randi,1);
			
				try{
					const quiz=model.getByIndex(id);
					rl.question(`${quiz.question}: `, answer =>{
						if(answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
							biglog(' Correcto', 'green');
							log('Su respuesta es correcta.');
							score++;
							log(`Ha obtenido una puntuación de: ${colorize(score, 'green')} hasta ahora`);
							biglog(`${score}`, 'magenta');
							askrandom();
						}else{
							log('Su respuesta es incorrecta.');
							biglog(' Incorrecto', 'red');
							log("Fin");
							log(`Ha obtenido una puntuación de: ${colorize(score, 'green')} sobre ${colorize(long, 'green')}`);
							biglog(`${score}`, 'magenta');
							rl.prompt();
							}	
						});

				}catch(error){
					errorlog(error.message);
					rl.prompt();
				}
		}

	}
	askrandom();
};

exports.editCmd = (rl,id) =>{
	if (typeof id === "undefined"){
		errorlog(`Falta el parametro id.`);
		rl.prompt();
	} else {
		try{
			const quiz = model.getByIndex(id);

			process.stdout.isTTY && setTimeout (() => {rl.write(quiz.question)},0);

			rl.question(colorize(' Introduzca una pregunta: ', 'red'), question =>{

				process.stdout.isTTY && setTimeout (() => {rl.write(quiz.answer)},0);
				rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer=> {
					model.update(id, question, answer);
					log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`)
				});
			});
			
			rl.prompt();
		} catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}


};


exports.creditsCmd = rl =>{
	console.log('Autor de la practica');
	console.log('Miguel Angel Lopez Muñoz');
	rl.prompt();
};
