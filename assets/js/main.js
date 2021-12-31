
/* Ejecutar después de que todos los elementos del documentos esten cargados */
$(document).ready(() => {

    /* Al hacer submit el formulario */
    $('form').submit((event) => {

        /* Previene que se recargue el formulario por default */
        event.preventDefault();

        /* Declara y asigna variable al input que obtiene el valor de búsqueda */
        let valor = $('#InputHeroe').val();

        /* Ajax */
        $.ajax({

            /* Petición tipo get */
            type: "GET",

            /* URL API */
            url: `https://gateway.marvel.com/v1/public/characters?ts=1&nameStartsWith=${valor}&limit=50&apikey=c1efd10b9d3a7f00d45ee5abc540401f&hash=0d19341b710a4287d0ae479d7e2a5298`,

            /* Devolver los datos en formato json */
            dataType: "json",

            /* Si la respuesta de la consulta es exitosa obtener datos */
            success: (datos) => {

                /* Si los datos obtenidos son distintos de 0 */
                if (datos.data.count !== 0) {

                    /* Se desvanece la seccion principal con animación difuminada de 1 segundo */
                    $('#Principal').fadeOut(800);

                    /* Declara y asigna a la variable el resultado de los datos */
                    let personajes = datos.data.results;

                    /* Mapea cada dato del arreglo obtenido */
                    let pers = personajes.map((personaje) => {

                        /* Declara y asigna en variables los datos requeridos */
                        let id = personaje.id;
                        let nombre = personaje.name;
                        let img = personaje.thumbnail.path + '.jpg';


                        /* Retorna una estructura html con los datos obtenidos previamente */
                        return `<button type="button" onclick="personaje_id(${id})" id="Personaje_id" class="text-decoration-none col-12 col-md-4 bg-transparent border-0">
                                    <div class="card my-4 text-center align-items-center bg-dark text-white">
                                        <img src="${img}" alt="Hero_img">
                                        <div class="card-body">
                                            <h5 class="mt-2 mb-4">${nombre}</h5>
                                        </div>
                                    </div>
                                </button>`;
                    }).join(''); /* Join une los elementos obtenidos del arreglo */

                    /* Inserta la estructura html en el elemento obtenido por id */
                    $('#SuperHero_cards').html(pers);

                    /* Agrega margen arriba de 6rem */
                    $('#SuperHero_cards').css('margin-top', '6rem');

                } else {

                    /* Si no se encuentran los datos, mostrar modal */
                    $("#Modal").modal("show");
                }
            },
        });
    });
});


/* Función personaje_id() que obtiene como parámetro el id del personaje */
const personaje_id = (id) => {

    /* Ajax */
    $.ajax({

        /* Petición tipo get */
        type: "GET",

        /* URL API */
        url: `https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=c1efd10b9d3a7f00d45ee5abc540401f&hash=0d19341b710a4287d0ae479d7e2a5298`,

        /* Devolver los datos en formato json */
        dataType: "json",

        /* Si la respuesta de la consulta es exitosa obtener datos */
        success: (datos) => {

            /* Se desvanece la seccion SuperHero_cards con animación difuminada de 1 segundo */
            $('#SuperHero_cards').fadeOut(800);

            /* Reaparece la sección SuperHero con animación difuminada de 1 segundo */
            $('#SuperHero').fadeIn(800);

            /* Declara y asigna en variables los datos requeridos */
            let id = datos.data.results[0].id;
            let id_stats = (datos.data.results[0].id).toString().slice(5); /* recorta el id */
            let nombre = datos.data.results[0].name;
            let img = datos.data.results[0].thumbnail.path + '.jpg';
            let ver_mas = datos.data.results[0].urls[0].url;


            /* Ajax */
            $.ajax({

                /* Petición tipo get */
                type: "GET",

                /* URL API */
                url: `https://superheroapi.com/api.php/10225290433023596/${id_stats}`,

                /* Devolver los datos en formato json */
                dataType: "json",

                /* Si la respuesta de la consulta es exitosa obtener datos */
                success: (datos) => {

                    /* Declara y asigna variable a un arreglo vacío */
                    let estadisticas = [];


                    /* Por cada estadística obtenida de la api, insertar objeto de estadísticas al arreglo vacío*/
                    for (const stat in datos.powerstats) {

                        /* Si el valor obtenido es nulo, setear con cantidad estándar para mostrar gráfico */
                        if (datos.powerstats[stat] == 'null') {

                            estadisticas.push(
                                {
                                    name: stat,
                                    y: 15,
                                }
                            );

                        } else {

                            estadisticas.push(
                                {
                                    name: stat,
                                    y: datos.powerstats[stat],
                                }
                            );
                        }
                    }


                    /* Función para que el gráfico tipo pie funcione correctamente */
                    let explodePie = (e) => {
                        if (typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
                            e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
                        } else {
                            e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
                        }
                    }


                    /* Declara y asigna a variable un objeto con parámetros para el gráfico canvas */
                    let config = {

                        animationEnabled: true,
                        theme: "dark1", // "light1", "light2", "dark1", "dark2"
                        title: {
                            text: "Estadísticas"
                        },
                        legend: {
                            cursor: "pointer",
                            itemclick: explodePie
                        },
                        data: [
                            {
                                toolTipContent: "{name}: <strong>{y}%</strong>",
                                indexLabel: "{name} {y}%",
                                type: "pie",
                                dataPoints: estadisticas,
                            },
                        ],
                    };


                    /* Declara y asigna a variable un nuevo objeto canvas con los parámetros del id del elemento a insertar y el objeto de configuración creado anteriormente */
                    let char = new CanvasJS.Chart('Stats', config);

                    /* Renderizar el gráfico canvas */
                    char.render();
                }
            })

            /* Inserta estructura html con los datos obtenidos en el elemento con el id indicado */
            $('#SuperHero').html(`
            <div id="Hero-card" class="card mx-2 row text-center bg-dark text-white">
                <img class="col-10 col-lg-4" src="${img}" alt="Hero_img">
                <div class="col-10 col-lg-6 px-0">
                    <h3>${nombre}</h3>
                    <h4>N° de héroe: ${id}</h4>
                    <a href="${ver_mas}" target="_blank"><h5>Ver más sobre este personaje</h5></a>
                    <div id="Stats" class="text-center"></div>
                </div>
            </div>
            `);
        },
    });
}