

$(document).ready(function () {

    $('#table-horarios').DataTable({
        //"jQueryUI": true,
        "language": {
            "lengthMenu": "Mostrando _MENU_ resultados por página",
            "zeroRecords": "NO HAY HORARIOS DISPONIBLES EN ESTA FECHA",
            "info": "Página _PAGE_ de _PAGES_",
            "infoEmpty": "...",
            "infoFiltered": "(filtrado de _MAX_ resultados totales)",
            "search": "Buscar",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": ">",
                "previous": "<"
            }
        },
        "responsive": true,
        "bLengthChange": true,
        "pageLength": 10,
        "bDestroy": true
    });

    $('#datepickerform').datetimepicker({
        startView: 'decade',
        format: 'yyyy-mm-dd',
        minView: 2,
        maxView: 4,
        language: 'es',
        //weekStart: 1,
        //endDate: 'today',
        endDate: '+0d',
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
                            //"jQueryUI": true,
                            "language": {
                                "lengthMenu": "Mostrando _MENU_ resultados por página",
                                "zeroRecords": "NO HAY HORARIOS DISPONIBLES EN ESTA FECHA",
                                "info": "Página _PAGE_ de _PAGES_",
                                "infoEmpty": "...",
                                "infoFiltered": "(filtrado de _MAX_ resultados totales)",
                                "search": "Buscar",
                                "jQueryUI": "true",
                                "paginate": {
                                    "first": "Primero",
                                    "last": "Ultimo",
                                    "next": ">",
                                    "previous": "<"
                                }
                            },
                            "responsive": true,
                            "bLengthChange": true,
                            "pageLength": 10,
                            "bDestroy": true
                        });
                    }
                });

            }
        });
    });
});

