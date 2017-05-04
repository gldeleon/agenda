
$(document).ready(function () {

    $("#estados").change(function () {
        //var edoid = $("#estados option:selected").val();
        var edoid = $(this).val();
        //alert(edoid);
        if (edoid !== "") {
            traeclinic(edoid);
        } else {
            //alert('Debes seleccionar un estado');
            var listItems = "<option value=''>--Selecciona Clinica--</option>";
            $("#clinica").html(listItems);
            initialize();
        }

    });

    $("#clinica").change(function () {
        var cliid = $("#clinica option:selected").val();
        //alert(cliid);
        if (cliid !== "") {
            var sp = $("#clinica option:selected").attr('id');
            //alert(sp);
            var rs = sp.split(',');
            if (typeof rs[3] !== 'undefined') {
                var final = rs[1] + " " + rs[2] + " " + rs[3];
            } else if (typeof rs[2] !== 'undefined') {
                var final = rs[1] + " " + rs[2];
            } else {
                var final = rs[1];
            }
            //alert(final);
            $('#nombreclinica').val(final);
            traeEspecialidad(cliid);
        } else {
            /*traigo el id del estado, seleccionado anteriormente*/
            var edoid = $("#estados").val();
            traeclinic(edoid);
        }
    });

    $("#especialidadSelect").change(function () {
        var esp_id = $(this).val(); //option:selected

        if (esp_id !== "") {
            traetrts(esp_id);
        } else {
            alert('Debes seleccionar una especialidad');
        }
    });
});

function traetrts(espid) {
    var listItems = '';
    $("#resultado").html("<p align='center'><img width='80px' src='https://contractaciopublica.gencat.cat/images/loading.gif' /></p>");
    $("#resultado").empty();
    $("#tratamiento").prop("disabled", false);
    if (espid == 2) {
        listItems += "<option value=''>--Selecciona Tratamiento--</option>";
        listItems += "<option id='4' value='4'>LIMPIEZA</option>";
        listItems += "<option id='3' value='3'>REVISION Y DIAGNOSTICO</option>";
    } else {
        listItems += "<option value=''>--Selecciona Tratamiento--</option>";
        listItems += "<option id='2' value='2'>LIMPIEZA CON FLUOR</option>";
        listItems += "<option id='490' value='490'>REVISION Y DIAGNOSTICO NIÑOS</option>";
    }
    $("#tratamiento").html(listItems);
}

function traeEspecialidad(datos) {
//getSpcList
///*De momento solo vamos a mostrar General y Odontopediatria, pero dejamos listo para traer todos*/
    $("#resultado").html("<p align='center'><img width='80px' src='https://contractaciopublica.gencat.cat/images/loading.gif' /></p>");
    $("#resultado").empty();
    $("#especialidadSelect").prop("disabled", false);
    var listItems = '';
    listItems += "<option value=''>--Selecciona Especialidad--</option>";
    listItems += "<option data-id='2' id='2' value='2'>GENERAL</option>";
    listItems += "<option data-id='3' id='3' value='3'>ODONTOPEDIATRIA</option>";
    $("#especialidadSelect").html(listItems);
    var cliid = datos;
    //alert(cliid);
    var marcadores;
    /*sirve para determinar el zoom que se le dará al Edo*/
    function formatDate(date) {
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return year + '-' + monthIndex + '-' + day;
    }

    var fecha = formatDate(new Date());
    //alert(fecha);
    //var params = {"controller": "traeclinicabyid", "cliid": cliid};
    var params = {"controller": "getClinicById", "cliID": cliid, "iniDate": fecha, "endDate": fecha}
    $.ajax({
        type: "POST",
        data: params,
        dataType: "json",
        url: "controller.php",
        beforeSend: function () {
            //imagen de carga
            $("#resultado").html("<p align='center'><img width='80px' src='https://contractaciopublica.gencat.cat/images/loading.gif' /></p>");
        },
        success: function (response) {
            $("#resultado").empty();
            marcadores = response;
            //$("#resultado").toSource(response);

            var map = new google.maps.Map(document.getElementById('mapa'), {
                center: new google.maps.LatLng(marcadores[0][1], marcadores[0][2]),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoom: 18
            });
            var infowindow = new google.maps.InfoWindow();
            var marker, i;
            var pinIcon = new google.maps.MarkerImage(
                    'images/Señaladores_Azul_c.png',
                    null, /* size is determined at runtime */
                    null, /* origin is 0,0 */
                    null, /* anchor is bottom center of the scaled image */
                    new google.maps.Size(20, 38)
                    );
            for (i = 0; i < marcadores.length; i++) {
                var contentString = '<div id="content">' +
                        '<div id="siteNotice">' +
                        '</div>' +
                        '<h3 id="firstHeading" class="firstHeading">DENTALIA ' + marcadores[0][0] + '</h3>' +
                        '<div id="bodyContent">' +
                        '<p>' + marcadores[0][4] + '.</p>' +
//                        '<p><a href="https://www.dentalia.mx/clinicas-dentales/" target="_blank">DENTALIA: ' + marcadores[0][0] + '</a>' +
                        '</div>' +
                        '</div>';

                var infowindow = new google.maps.InfoWindow({
                    content: contentString,
                    maxWidth: 200
                });

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(marcadores[i][1], marcadores[i][2]),
                    map: map,
                    title: marcadores[0][0],
                    icon: pinIcon,
                    //icon: 'https://www.dentalia.mx/templates/dentaliav2/favicon.ico',
                    cursor: 'default',
                    draggable: false,
                    animation: google.maps.Animation.DROP
                });
                infowindow.open(map, marker);
//                google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
//                    return function () {
////                        infowindow.setContent(marcadores[i][0]);
////                        infowindow.open(map, marker);
//                        infowindow.open(map, marker);
//                    }
//                })(marker, i));
            }
        }
    });
}

function traeclinic(data) {
    //alert(id);
    var latlanid = data.split('-');

    var lat = latlanid[0];
    var lng = "-" + latlanid[1];
    var id = latlanid[2];

//    var lat = $(data).data('lat');
//    var lng = $(data).data('lng');
//    var id = $(data).data('idedo');
    var marcadores;

    /*sirve para determinar el zoom que se le dará al Edo */
    var z = 0;
    if (id == 14) {
        z = 11;
    } else if (id == 15 || id == 11 || id == 22 || id == 31 || id == 26) {
        z = 9;
    } else if (id == 19 || id == 21 || id == 9) {
        z = 10;
    } else {
        z = 7;
    }

    var map = new google.maps.Map(document.getElementById('mapa'), {
        zoom: 4,
        center: new google.maps.LatLng(lat, lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: z
    });
    var infowindow = new google.maps.InfoWindow();
    var marker, i;

    var params = {"controller": "traeclinicas", "cveedo": id};
    $.ajax({
        type: "POST",
        data: params,
        dataType: "json",
        url: "controller.php",
        beforeSend: function () {
            //imagen de carga
            $("#resultado").html("<p align='center'><img width='80px' src='https://contractaciopublica.gencat.cat/images/loading.gif' /></p>");
        },
        success: function (response) {
            $("#resultado").empty();
            marcadores = response;
            var pinIcon = new google.maps.MarkerImage(
                    'images/Señaladores_Azul_c.png',
                    null, /* size is determined at runtime */
                    null, /* origin is 0,0 */
                    null, /* anchor is bottom center of the scaled image */
                    new google.maps.Size(20, 38)
                    );
            for (i = 0; i < marcadores.length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(marcadores[i][1], marcadores[i][2]),
                    map: map,
                    title: marcadores[i][0],
                    icon: pinIcon,
                    //icon: 'https://www.dentalia.mx/templates/dentaliav2/favicon.ico',
                    cursor: 'default',
                    draggable: false,
                    animation: google.maps.Animation.DROP
                });
                google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
                    return function () {
                        infowindow.setContent(marcadores[i][0]);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        //var lng = marcadores[i][0].toString();
                        var idc = marcadores[i][0].split(" ");
                        //alert(idc);
                        /*se requiere enviar la clave de la clinica*/
                        $("#clinica option[id='" + idc.toString() + "']").attr("selected", true);
                        var idclinic = idc.toString();
                        var rs = idclinic.split(',');
                        //alert(rs);
                        if (typeof rs[3] !== 'undefined') {
                            var final = rs[1] + " " + rs[2] + " " + rs[3];
                        } else if (typeof rs[2] !== 'undefined') {
                            var final = rs[1] + " " + rs[2];
                        } else {
                            var final = rs[1];
                        }
                        //alert(final);
                        $('#nombreclinica').val(final);
                        /*actualizamos el input*/
                        //$("#estados option[id=" + marcadores[i][3] + "]").attr("selected", true);
                        traeEspecialidad(idc[0]);
                    }
                })(marker, i));
//                google.maps.event.addListener(marker, 'click', (function (marker, i) {
//                    return function () {
//                        alert('clinica');
////                        infowindow.setContent(marcadores[i][0]);
////                        infowindow.open(map, marker);
//                        //zoom: 7;
//                        //map.setZoom(7);
//                    }
//                })(marker, i));
//                window.setTimeout(function () {
//                    map.panTo(marker.getPosition());
//                }, 3000);

//                marker.addListener('click', function () {
//                    map.setZoom(8);
//                    map.setCenter(marker.getPosition());
//                });
            }
            var listItems = "";
            $("#clinica").prop("disabled", false);
            listItems += "<option value=''>--Selecciona Clinica--</option>";
            for (i = 0; i < marcadores.length; i++) {
                /*ahora llenamos la lista con las clinicas*/
                var res = marcadores[i][0].split(" ");
                if (typeof res[3] !== 'undefined') {
                    var final = res[1] + " " + res[2] + " " + res[3];
                } else if (typeof res[2] !== 'undefined') {
                    var final = res[1] + " " + res[2];
                } else {
                    var final = res[1];
                }

//                if (typeof res[2] !== 'undefined') {
//                    var resto = res[2];
//                } else {
//                    var resto = '';
//                }
                listItems += "<option id='" + res + "' value='" + res[0] + "'>" + final + "</option>";
            }
            $("#clinica").html(listItems);
            //$('#estado').html(response).fadeIn();
        }
    });
}

function initialize() {
    var marcadores;
    /*creamos los primeros marcadores para los estados*/
//    var marcadores =
//            [['Baja California', 30.8406338, -115.2837585], ['Chihuahua', 28.6329957, -106.0691004], ['Mexico City', 19.4326077, -99.133208], ['Coahuila', 27.058676, -101.7068294], ['State of Mexico', 19.4968732, -99.7232673],
//                ['Guanajuato', 21.0190145, -101.2573586], ['Jalisco', 20.6595382, -103.3494376], ['Nuevo Leon', 25.592172, -99.9961947], ['Puebla', 19.0412967, -98.2061996], ['Santiago de Querétaro', 20.5887932, -100.3898881],
//                ['Quintana Roo', 19.1817393, -88.4791376], ['San Luis Potosi', 22.1564699, -100.9855409], ['Sonora', 37.9829496, -120.3821724], ['Yucatan', 20.7098786, -89.0943377], ];
//var marcadores = [['Edo. Méx', 19.430560, -99.135618]];

    var map = new google.maps.Map(document.getElementById('mapa'), {
        zoom: 4,
        center: new google.maps.LatLng(24.430560, -102.135618),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var infowindow = new google.maps.InfoWindow();
    var marker, i;

    var params = {"controller": "edosmaps"};
    $.ajax({
        type: "POST",
        url: "controller.php",
        data: params,
        dataType: "json",
        beforeSend: function () {
            //imagen de carga
            $("#resultado").html("<p align='center'><img width='80px' src='https://contractaciopublica.gencat.cat/images/loading.gif' /></p>");
        },
        error: function (data) {
            $("#resultado").empty();
            //alert(data)
            $("#resultado").html(data);
        },
        success: function (data) {
            $("#resultado").empty();
            marcadores = data;
            var pinIcon = new google.maps.MarkerImage(
                    'images/Señaladores_Azul_o.png',
                    null, /* size is determined at runtime */
                    null, /* origin is 0,0 */
                    null, /* anchor is bottom center of the scaled image */
                    new google.maps.Size(20, 38)
                    );
            for (i = 0; i < marcadores.length; i++) {

//                marker.addListener('click', function () {
//                    traeclinic(marcadores[i][3]);
//                });

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(marcadores[i][1], marcadores[i][2]),
                    map: map,
                    //title: clinic[1],
                    //icon: pinIcon,
                    //icon: 'https://www.dentalia.mx/templates/dentaliav2/favicon.ico',
                    cursor: 'default',
                    draggable: false,
                    animation: google.maps.Animation.DROP

                });

                google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
                    return function () {
                        var nombre = '';
                        if (marcadores[i][0] == 'Mexico City') {
                            nombre = 'Ciudad de México';
                        } else if (marcadores[i][0] == 'State of Mexico') {
                            nombre = 'Estado de México';
                        } else {
                            nombre = marcadores[i][0];
                        }
                        infowindow.setContent(nombre);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
//                        infowindow.setContent(marcadores[i][0]);
//                        infowindow.marcadores[i][2]open(map, marker);

                        /*colocamos el estado seleccionado*/
                        var idc = marcadores[i][0].split(" ");
                        $("#estados option[id='" + idc.toString() + "']").attr("selected", true);

                        var lng = marcadores[i][2].toString();
                        var ide = lng.split("-");
                        /*se requiere enviar lat, lng y numero de estado*/
                        /*le quito el guion porque en la otra funcion lo agrega nuevamente, ni hablar*/
                        var datos = marcadores[i][1] + "-" + ide[1] + "-" + marcadores[i][3];
                        //$("select[name$='product_type'] option:selected").attr("id")
                        //('#estados option:selected').id(marcadores[i][3]);
                        $("#estados option[id=" + marcadores[i][3] + "]").attr("selected", true);
                        traeclinic(datos);
                    }
                })(marker, i));
            }
        }
    });

}

google.maps.event.addDomListener(window, 'load', initialize);