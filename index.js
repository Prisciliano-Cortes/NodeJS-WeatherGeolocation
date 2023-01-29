require('dotenv').config()
const { inquirerMenu, pausa, leerInput, listarLugares } = require("./helpers/inquirer.js");
const Busquedas = require("./models/busquedas.js");
require('colors');

const main = async() => {

    const busquedas = new Busquedas()
    let opt;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //* Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                //* Buscar los lugares
                const lugares = await busquedas.ciudad(termino);
                
                //* Seleccionar el lugar
                const id = await listarLugares(lugares);

                if( id === '0' ) continue;

                const lugarSeleccionado = lugares.find( lugar => lugar.id === id);
            
                //* Guardar en DB
                busquedas.agregarHistorial( lugarSeleccionado.nombre )

                //* Clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng)

                //* Mostrar resultados
                console.clear();
                console.log("\nInformación de la ciudad\n".green);
                console.log("Ciudad:", lugarSeleccionado.nombre.red);
                console.log("Latitud:", lugarSeleccionado.lat);
                console.log("Longitud:", lugarSeleccionado.lng);
                console.log("Temperatura:", clima.temp);
                console.log("T. mínima:", clima.min);
                console.log("T. máxima:", clima.max);
                console.log("Cómo está el clima:", clima.desc.red);
            break;
        
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1}.`.green;
                    console.log(`${ idx } ${ lugar }`);
                })

            break;
        }

        if(opt !== 0) await pausa()

    } while (opt !== 0);
}

main()