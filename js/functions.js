/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {

    $('#table-horarios').DataTable({
        "responsive": true,
        "bLengthChange": false,
        "pageLength": 10,
        "bDestroy": true
    });


    $("#estados").change(function () {
        //var edoid = $("#estados option:selected").val();
        var edoid = $(this).val();
        //alert(edoid);
        traeclinic(edoid);
    });

    $("#clinica").change(function () {
        var cliid = $("#clinica option:selected").val();
        traeEspecialidad(cliid);
    });

    $("#especialidadSelect").change(function () {
        var esp_id = $(this).val(); //option:selected
        traetrts(esp_id);
    });

    $('#datepickerform').datetimepicker({
        format: 'yyyy-mm-dd',
        minView: 2,
        maxView: 4,
        language: 'es',
        weekStart: 1,
        forceParse: 0,
        autoclose: true,
        changeMonth: true,
        changeYear: true,
        showOtherMonths: true,
        selectOtherMonths: true
    });


});

function validate(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault)
            theEvent.preventDefault();
    }
}

$(function () {
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '< Ant',
        nextText: 'Sig >',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        weekHeader: 'Sm',
        //format: 'yyyy-mm-dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
    $(function () {
        $("#datepicker").datepicker({
            dateFormat: 'yy-mm-dd',
            minDate: 0,
            onSelect: function (date) {
                /*obtengo los datos que requiero enviar*/
                var cliid = $('#cliid').val();
                var trtid = $('#trtid').val();

                var formatdate = date;
                var dateArr = formatdate.split("-");
                formatdate = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
                $('#fechahorarios').text(formatdate);
                /*hacemos la peticion ajax y actualizamos la tabla de horarios*/
                //var fechaenviar = $('#fechahorarios').text();
                $('#fecha').val(date);
                var params = {"controller": "calendar", "cliid": cliid, "trtid": trtid, "fecha": date};
                $.ajax({
                    type: "POST",
                    data: params,
                    dataType: "json",
                    url: "controller.php",
                    beforeSend: function () {
                        //imagen de carga
                        $(".table-responsive").html("<p align='center'><img width='80px' src='https://contractaciopublica.gencat.cat/images/loading.gif' /></p>");
                    },
                    success: function (response) {
                        $(".table-responsive").empty();
                        $(".table-responsive").html(response);
                        $('#table-horarios1').DataTable({
                            "language": {
                                "lengthMenu": "Mostrando _MENU_ resultados por página",
                                "zeroRecords": "No hay datos para mostrar",
                                "info": "Página _PAGE_ de _PAGES_",
                                "infoEmpty": "No hay datos disponibles",
                                "infoFiltered": "(filtrado de _MAX_ resultados totales)",
                                "search": "Buscar"
                            },
                            "responsive": true,
                            "bLengthChange": false,
                            "pageLength": 10,
                            "bDestroy": true
                        });

//                        $('#table-horarios').DataTable({
//                            "responsive": true,
//                            "pageLength": 10
//                        });
//                            var inte = 1;
//                            if (inte == 1) {
//                                datatab();
//                                inte++;
//                            }

                        //$('#estado').html(response).fadeIn();
                    }
                });

            }
        });
    });
});


//$(function () {
//    $.datepicker.regional['es'] = {
//        closeText: 'Cerrar',
//        prevText: '< Ant',
//        nextText: 'Sig >',
//        currentText: 'Hoy',
//        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
//        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
//        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
//        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
//        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
//        weekHeader: 'Sm',
//        //dateFormat: 'yyyy-mm-dd',
//        firstDay: 1,
//        isRTL: false,
//        showMonthAfterYear: false,
//        yearSuffix: ''
//    };
//    $.datepicker.setDefaults($.datepicker.regional['es']);
//    $(function () {
//        $("#datepickerform").datepicker({
//            changeMonth: true,
//            changeYear: true,
//            dateFormat: 'yy-mm-dd',
//            startDate: '-3d',
//            yearRange: "-100:+0"
//        });
//    });
//});
//$("#datepickerform").datetimepicker({format: 'yyyy-mm-dd'});

//$('#datepickerform').datepicker({
//    beforeShow: function (input, inst) {
//        $('#datepickerform').removeClass(function () {
//            return $('input').get(0).id;
//        });
//        //$('#ui-datepicker-div').addClass(this.id);
//    }
//});

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

//    var params = {"controller": "tratamientos", "esp_id": espid};
//    $.ajax({
//        type: "POST",
//        data: params,
//        dataType: "json",
//        url: "controller.php",
//        beforeSend: function () {
//            //imagen de carga
//            $("#resultado").html("<p align='center'><img width='80px' src='http://www.maytag.com/images/ajax-loader.gif' /></p>");
//        },
//        success: function (response) {
//            var listItems = '';
//            $("#resultado").empty();
//            $("#tratamiento").prop("disabled", false);
//            listItems += "<option value=''>--Selecciona Tratamiento--</option>";
//            for (i = 0; i < response.length; i++) {
//                /*ahora llenamos la lista con las clinicas*/
//                listItems += "<option id='" + response[i][0] + "' value='" + response[i][0] + "'>" + response[i][1] + "</option>";
//            }
//            $("#tratamiento").html(listItems);
//        }
//    });
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

            for (i = 0; i < marcadores.length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(marcadores[i][1], marcadores[i][2]),
                    map: map,
                    title: marcadores[i][0],
                    //icon: 'https://www.dentalia.mx/templates/dentaliav2/img/clinica-dental-en-mexico-dentalia-logo.png',
                    //icon: 'https://www.dentalia.mx/templates/dentaliav2/favicon.ico',
                    cursor: 'default',
                    draggable: false,
                    animation: google.maps.Animation.DROP
                });
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        infowindow.setContent(marcadores[i][0]);
                        infowindow.open(map, marker);
                        //zoom: 10;
                        //map.setZoom(7);
                    }
                })(marker, i));

//                marker.addListener('click', function () {
//                    map.setZoom(8);
//                    map.setCenter(marker.getPosition());
//                });
            }
//            var listItems = "";
//            $("#clinica").prop("disabled", false);
//            listItems += "<option value=''>--Selecciona Clinica--</option>";
//            for (i = 0; i < marcadores.length; i++) {
//                /*ahora llenamos la lista con las clinicas*/
//                var res = marcadores[i][0].split(" ");
//                if (typeof res[2] !== 'undefined') {
//                    var resto = res[2];
//                } else {
//                    var resto = '';
//                }
//                listItems += "<option id='" + res[0] + "' value='" + res[0] + "'>" + res[1] + ' ' + resto + "</option>";
//            }
//            $("#clinica").html(listItems);
            //$('#estado').html(response).fadeIn();
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
            for (i = 0; i < marcadores.length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(marcadores[i][1], marcadores[i][2]),
                    map: map,
                    title: marcadores[i][0],
                    //icon: 'https://www.dentalia.mx/templates/dentaliav2/img/clinica-dental-en-mexico-dentalia-logo.png',
                    //icon: 'https://www.dentalia.mx/templates/dentaliav2/favicon.ico',
                    cursor: 'default',
                    draggable: false,
                    animation: google.maps.Animation.DROP
                });
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        infowindow.setContent(marcadores[i][0]);
                        infowindow.open(map, marker);
                        //zoom: 7;
                        //map.setZoom(7);
                    }
                })(marker, i));

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
                if (typeof res[2] !== 'undefined') {
                    var resto = res[2];
                } else {
                    var resto = '';
                }
                listItems += "<option id='" + res[0] + "' value='" + res[0] + "'>" + res[1] + ' ' + resto + "</option>";
            }
            $("#clinica").html(listItems);
            //$('#estado').html(response).fadeIn();
        }
    });
}


//function cargaSelectEdos() {
//    var params = {"controller": "edosselect"};
//    $.ajax({
//        type: "POST",
//        data: params,
//        dataType: "json",
//        url: "controller.php",
//        success: function (response)
//        {
//            $('#estado').html(response).fadeIn();
//        }
//    });
//}







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
            for (i = 0; i < marcadores.length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(marcadores[i][1], marcadores[i][2]),
                    map: map,
                    //title: 'Pulsa aquí',
                    //icon: 'https://www.dentalia.mx/templates/dentaliav2/img/clinica-dental-en-mexico-dentalia-logo.png',
                    //icon: 'https://www.dentalia.mx/templates/dentaliav2/favicon.ico',
                    cursor: 'default',
                    draggable: false,
                    animation: google.maps.Animation.DROP

                });
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        infowindow.setContent(marcadores[i][0]);
                        infowindow.open(map, marker);

                    }
                })(marker, i));
//                map.addListener('center_changed', function () {
//                    // 3 seconds after the center of the map has changed, pan back to the
//                    // marker.
//                    window.setTimeout(function () {
//                        map.panTo(marker.getPosition());
//                    }, 3000);
//                });

                marker.addListener('click', function () {
                    map.setZoom(8);
                    map.setCenter(marker.getPosition());
                });


            }
            //cargaSelectEdos();
        }
    });

}

google.maps.event.addDomListener(window, 'load', initialize);

//function toggleBounce() {
//    if (marker.getAnimation() !== null) {
//        marker.setAnimation(null);
//    } else {
//        marker.setAnimation(google.maps.Animation.BOUNCE);
//    }
//}

//var x = document.getElementById("mapa");
//function getLocation() {
//    if (navigator.geolocation) {
//        navigator.geolocation.getCurrentPosition(showPosition);
//    } else {
//        x.innerHTML = "Geolocation is not supported by this browser.";
//    }
//}
//function showPosition(position) {
//    x.innerHTML = "Latitude: " + position.coords.latitude +
//            "<br>Longitude: " + position.coords.longitude;
//}