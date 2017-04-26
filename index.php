<?php

require_once 'model/agendaenlineamodel.php';
require_once 'mailer.php';

$mailer = new mailer();
$model = new agendamodel();

if (isset($_POST['horarios'])) {

    $cliID = $_POST['clinica'];
    $trtID = $_POST['tratamiento'];
    $diaINI = date('Y-m-d');
    //die($diaINI);
    $diaEND = date('Y-m-d');
    $datos = '"request": "getFreeHoursByTrt", "cliID": "' . $cliID . '" ,"iniDate": "' . $diaINI . '","endDate": "' . $diaEND . '",  "trtID":"' . $trtID . '"';
    //$datos = '"request": "getSchedule", "cliID": ' . $cliID . ' ,"iniDate": "' . $diaINI . '","endDate": "' . $diaEND . '",  "trtID":"' . $trtID . '"';
    //echo $datos;
    $rs = $model->apiDent($datos);
    //var_dump($rs["data"][$diaINI]);
    $dr = "";
    $drid = "";
//    echo $diaINI;
//    var_dump($rs);
//    die('que pex');
    $table .= '<div class="table-responsive">
                    <table id="table-horarios" class="table display" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>HORA</th>
                                            <th>DURACION</th>
                                            <th>DR</th>
                                            <th>AGENDAR</th>
                                        </tr>
                                    </thead>'
            . '<tbody id="tabla">';

    foreach ($rs["data"][$diaINI] as $chair => $value) {

        $poschair = strpos($chair, 'chair');
        if ($poschair !== false) {
            $silla = $chair;
        }

        foreach ($value as $name => $valor) {

            $posname = strpos($name, 'drName_');
            if ($posname !== false) {
                $docID = $name;
                $dr = $valor;
            }

            $posid = strpos($name, 'sdi');
            if ($posid !== false) {
                $drid = $valor;
                if ($drid == "ACTIVO") {
                    $lapso = 90;
                } else {
                    $lapso = 60;
                }
            }

            $poshorario1 = strpos($name, 'horario_');
            if ($poshorario1 !== false) {
                foreach ($valor as $horas) {
                    $nuevaHora = strtotime('+' . $lapso . ' minutes', strtotime($horas));
                    $hfinal = date('H:i:s', $nuevaHora);
                    if ($hfinal > $horas) {
                        $ultimahora = $horas;
                    }
                }
            }

            $poshorario = strpos($name, 'horario_');
            if ($poshorario !== false) {
                foreach ($valor as $horas) {
                    $nuevaHora = strtotime('+' . $lapso . ' minutes', strtotime($horas));
                    $hfinal = date('H:i:s', $nuevaHora);
                    if ($hfinal < $ultimahora) {
                        //<td>' . date('h:ia', strtotime($horas)) . " - " . date("h:ia", strtotime($hfinal)) . '</td>
                        $table .= '<tr>
                                        <td>' . date('h:ia', strtotime($horas)) . '</td>
                                        <td><center>' . $lapso . ' min<center></td>
                                        <td>' . $dr . '</td>
                                        <td><center><input name="selecth" class="horarios" value="' . $horas . "_" . $hfinal . "-" . $silla . "-" . $dr . "-" . $docID . '" type="radio" required="required"/></center></td>
                                    </tr>';
                    }
//                    } else {
//                        $table = '<tr>'
//                                . '<td class="acomoda">NO HAY HORARIOS DISPONIBLES</td>'
//                                . '<input type="hidden" name="cliid" id="cliid" value="' . $cliID . '" />'
//                                . '<input type="hidden" name="trtid" id="trtid" value="' . $trtID . '" />'
//                                . '<input type="hidden" name="chair" id="chair" value="' . $s . '" />'
//                                . '<input type="hidden" name="drname" id="drname" value="' . $dr . '"/>'
//                                . '<input type="hidden" name="drid" id="drid" value="' . $drid . '" />'
//                                . '<input type="hidden" name="fecha" id="fecha" value="' . $diaINI . '" />'
//                                . '</tr>';
//                    }
                }
            }
        }
    }
    $table .= '</tbody>'
            . '</table>'
            . '</div>';
//                                <input type="hidden" name="drname" id="drname" value="' . $dr . '"/>
//                            <input type="hidden" name="drid" id="drid" value="' . $docID . '" />

    $inputs = '<div id="oculto"><input type="hidden" name="cliid" id="cliid" value="' . $cliID . '" />
                            <input type="hidden" name="trtid" id="trtid" value="' . $trtID . '" />
                            <input type="hidden" name="fecha" id="fecha" value="' . $diaINI . '" />'
            . '<input type="radio" name="selecth" class="horarios" value="" required="required" /></div>';
//    echo $table;
//    die('que pex');
    $formhorarios = file_get_contents('parts/horarios.html');
    $armamoshorarios = str_replace('{tabla}', $table, $formhorarios);
    $cargamosdatos = str_replace('{datos}', $inputs, $armamoshorarios);
    $master = file_get_contents('parts/master.html');
    $replace = str_replace("{contenido}", $cargamosdatos, $master);
} else if (isset($_POST['identificacion'])) {

    //var_dump($_POST);
    $separa = explode("-", $_POST['selecth']);
    $horaini = $separa[0];

    $chair = $separa[1];
    $drname = $separa[2];
    $clave = explode("_", $separa[3]);
    $drid = $clave[1];
//    die('que llega');
//    $_POST['fecha']
    $inputs = '<input type = "hidden" name = "drname" value = "' . $drname . '" />'
            . '<input type = "hidden" name = "cliid" value = "' . $_POST['cliid'] . '" />'
            . '<input type="hidden" name="trtid" id="trtid" value="' . $_POST['trtid'] . '" />'
            . '<input type="hidden" name="chair" value="' . $chair . '" />'
            . '<input type = "hidden" name = "drid" value = "' . $drid . '" />'
            . '<input type = "hidden" name = "fecha" value = "' . $_POST['fecha'] . '" />'
            . '<input type = "hidden" name = "horai" value = "' . $horaini . '" />';

//    echo $inputs;
//    die();
    $formidentifica = file_get_contents('parts/identificacion.html');
    $complete = str_replace('{inputs}', $inputs, $formidentifica);

    $master = file_get_contents('parts/master.html');
    $replace = str_replace("{contenido}", $complete, $master);
} else if (isset($_POST['confirmacion'])) {
//    var_dump($_POST);
//    die('que llega?');
    /* traer los datos de la clinica, DIR, */
    $datos = '"request": "getClinicById","cliID":"' . $_POST['cliid'] . '", "iniDate":"' . $_POST['fecha'] . '","endDate":"' . $_POST['fecha'] . '"';
    //'sttID': Integer
    //echo $datos;
    $rs = $model->apiDent($datos);
    //var_dump($rs);

    $silla = substr($_POST['chair'], -1);    // devuelve numero de silla
    foreach ($rs["data"] as $number => $valor) {
        /* trae los tratamientos y su id */
        if ($number == "cliAddress") {
            $direccion = $valor;
        }
        if ($number == "cliName") {
            $cliname = $valor;
        }
        //$direccion = $number['cliAddress'];
//        $final[] = array($valor["trtID"], $valor["trtName"]);
    }
//    var_dump($final);
//    echo $direccion;
//    die('regreso del api');
    $times = explode("_", $_POST['horai']);
    $horaini = $times[0];
    $horaend = $times[1];

    $dia = date("l", strtotime($_POST['fecha']));

    if ($dia == "Monday")
        $dia = "Lunes";
    if ($dia == "Tuesday")
        $dia = "Martes";
    if ($dia == "Wednesday")
        $dia = "Miércoles";
    if ($dia == "Thursday")
        $dia = "Jueves";
    if ($dia == "Friday")
        $dia = "Viernes";
    if ($dia == "Saturday")
        $dia = "Sábado";
    if ($dia == "Sunday")
        $dia = "Domingo";

    /* hacer explode para tomar mi fecha */
    $mes = date("F", strtotime($_POST['fecha']));

    if ($mes == "January")
        $mes = "Enero";
    if ($mes == "February")
        $mes = "Febrero";
    if ($mes == "March")
        $mes = "Marzo";
    if ($mes == "April")
        $mes = "Abril";
    if ($mes == "May")
        $mes = "Mayo";
    if ($mes == "June")
        $mes = "Junio";
    if ($mes == "July")
        $mes = "Julio";
    if ($mes == "August")
        $mes = "Agosto";
    if ($mes == "September")
        $mes = "Setiembre";
    if ($mes == "October")
        $mes = "Octubre";
    if ($mes == "November")
        $mes = "Noviembre";
    if ($mes == "December")
        $mes = "Diciembre";
    $dia2 = date("d", strtotime($_POST['fecha']));
    $ano = date("Y", strtotime($_POST['fecha']));
    $hztl = '
<form action = "index.php" method = "post">
<b>Datos del Paciente:</b>
<dl class = "dl-horizontal">
<dt>PACIENTE:</dt>
<dd>' . $_POST['nombre'] . ' ' . $_POST['apaterno'] . ' ' . $_POST['amaterno'] . '</dd>
<dt>TEL.</dt>
<dd>' . $_POST['tel'] . '</dd>
<dt>EMAIL</dt>
<dd>' . $_POST['mail'] . '</dd>
</dl>
<b>Datos de Clínica:</b>
<dl class = "dl-horizontal">
<dt>DR:</dt>
<dd>' . $_POST['drname'] . '</dd>
<dt>DÍA:</dt>
<dd>' . $dia . ", " . $dia2 . " de " . $mes . " de " . $ano . '</dd>
<dt>HORA:</dt>
<dd>' . date('h:ia', strtotime($horaini)) . " a " . date('h:ia', strtotime($horaend)) . '</dd>
<dt>CLÍNICA:</dt>
<dd>' . $cliname . '</dd>
<dt>DIRECCIÓN CLÍNICA:</dt>
<dd>' . $direccion . '</dd>
</dl>

<input type="hidden" name="nombre" value ="' . $_POST['nombre'] . '" />
<input type="hidden" name="apaterno" value ="' . $_POST['apaterno'] . '" />
<input type="hidden" name="amaterno" value ="' . $_POST['amaterno'] . '" />
<input type="hidden" name="fecnac" value ="' . $_POST['datepickerform'] . '" />
<input type="hidden" name="email" value ="' . $_POST['mail'] . '" />
<input type="hidden" name="genero" value ="' . $_POST['genero'] . '" />
<input type="hidden" name="tel" value ="' . $_POST['tel'] . '" />

<input type="hidden" name="cliid" value="' . $_POST['cliid'] . '" />
<input type = "hidden" name = "drname" value = "' . $_POST['drname'] . '" />
<input type = "hidden" name = "drid" value = "' . $_POST['drid'] . '" />
<input type = "hidden" name = "fecha" value = "' . $_POST['fecha'] . '" />
<input type = "hidden" name = "horai" value = "' . $horaini . "-" . $horaend . '" />
<input type="hidden" name="trtid" id="trtid" value="' . $_POST['trtid'] . '" />
<input type="hidden" name="chair" value="' . $silla . '" />
<input type = "hidden" name = "cliname" value = "' . $cliname . '" />
<input type = "hidden" name = "clidir" value = "' . $direccion . '" />
<input type = "hidden" name = "final" value = "final" />';
    $confirma = file_get_contents('parts/confirmacion.html');
    $complete = str_replace('{hztl}', $hztl, $confirma);

    $master = file_get_contents('parts/master.html');
    $replace = str_replace("{contenido}", $complete, $master);

###############################################################################################################################3
} else if (isset($_POST['final'])) {

    /* primero debo insertar al paciente */
    $datospac = '"request":"addPatient","patName":"' . $_POST['nombre'] . '","patLastname":"' . $_POST['apaterno'] . '","patSurename":"' . $_POST['amaterno'] . '",'
            . '"patBdate":"' . $_POST['fecnac'] . '","patEmail":"' . $_POST['email'] . '","patGender":"' . $_POST['genero'] . '","patTelephone":"' . $_POST['tel'] . '"';
//{"module":"modPatSchedule","request":"api_addAppointment","cliID":"71","docID":"1744","patID":"10001528992","chairID":"1","apptDate":"2017-03-31","apptIniHour":"09:00:00","apptEndHour":"10:00:00","trtID":"4"}
    $rspat = $model->apiDent($datospac);
    //$patID = 10001528992;
    $patID = $rspat["data"]["patID"];
    //$fechaapp = '2017-04-08';
    $fechaapp = $_POST['fecha'];


    $hor = explode('-', $_POST['horai']);
    $IniHour = date('H:i', strtotime($hor[0]));
    $EndHour = date('H:i', strtotime($hor[1]));
    $datos = '"request":"addAppointment","cliID":"' . $_POST['cliid'] . '","docID":"' . $_POST['drid'] . '","patID":"' . $patID . '","chairID":"' . $_POST['chair'] . '","apptDate":"' . $fechaapp . '","apptIniHour":"' . $IniHour . '","apptEndHour":"' . $EndHour . '","trtID":"' . $_POST['trtid'] . '"';

    $rs = $model->apiDent($datos);
    //$clavedeappt = $rs["data"]["apptID"];
    //setlocale(LC_ALL, "es_ES", 'Spanish_Spain', 'Spanish');
    //date_default_timezone_set('America/Mexico_City');
    //setlocale(LC_TIME, "es_ES");
    //setlocale(LC_TIME, 'es_ES.UTF-8');
    //setlocale(LC_TIME, 'de_DE.UTF-8');
    //echo strftime("%d de %B de %Y", strtotime($_POST['fecha']));
    //echo iconv('ISO-8859-2', 'UTF-8', strftime("%d de %B de %Y", strtotime($_POST['fecha'])));
    //echo iconv('ISO-8859-2', 'UTF-8', strftime(%A, %d de %B de %Y", strtotime($row['date'])));
    //echo iconv('ISO-8859-2', 'UTF-8', strftime(date('l jS \of F Y', strtotime($_POST['fecha']))));


    if ($rs["error"] == "") {
        $mailer->enviamail($_POST);
        $confirma = file_get_contents('parts/final.html');
        $master = file_get_contents('parts/master.html');
        $replace = str_replace("{contenido}", $confirma, $master);
    } else {
        $confirma = "<div><h3>Ocurrió un error al guardar la cita, por favor comunicate al 01.800.003.3682</h3></div>"
                . "<center><a class='btn btn-info' href='index.php'>Volver al Inicio</a></center>";
        //$confirma = file_get_contents('parts/final.html');
        $master = file_get_contents('parts/master.html');
        $replace = str_replace("{contenido}", $confirma, $master);
    }
} else {
#########################################################################################################################################################3
    /* primero me traigo los estados y los mando como lista */
    $datos = '"request": "getStateList"';
    $rs = $model->apiDent($datos);

    $list .= '<option value="">--Selecciona Estado--</option>';
    foreach ($rs["data"] as $number => $valor) {
        /* traigo el lat lng del estado */
        $lngalt = $model->apiMaps($valor["sttName"]);
        if ($lngalt['results'][0]['address_components'][0]['long_name'] == "Mexico City") {
            $name = "CDMX y Area Metropolitana";
        } else if ($lngalt['results'][0]['address_components'][0]['long_name'] == "State of Mexico") {
            $name = "Estado de México";
        } else {
            $name = $lngalt['results'][0]['address_components'][0]['long_name'];
        }
        //$final[] = array($lngalt['results'][0]['address_components'][0]['long_name'], $lngalt['results'][0]['geometry']['location']['lat'], $lngalt['results'][0]['geometry']['location']['lng']);
        //$list .= '<a href = "#" onClick = "traeclinic(this)" data-idedo = "' . $number . '" data-lat = "' . $lngalt['results'][0]['geometry']['location']['lat'] . '" data-lng = "' . $lngalt['results'][0]['geometry']['location']['lng'] . '" id = "' . $number . '" class = "list-group-item">' . $name . '</a>';
        //$list .= '<option onClick = "traeclinic(this)" data-idedo = "' . $number . '" data-lat = "' . $lngalt['results'][0]['geometry']['location']['lat'] . '" data-lng = "' . $lngalt['results'][0]['geometry']['location']['lng'] . '" id = "' . $number . '">' . $name . '</option>';
        $list .= '<option value="' . $lngalt['results'][0]['geometry']['location']['lat'] . $lngalt['results'][0]['geometry']['location']['lng'] . "-" . $number . '" id = "' . $number . '">' . $name . '</option>';
    }
    $formmapa = file_get_contents('parts/formmapa.html');
    $reemplazalist = str_replace('{list}', $list, $formmapa);

//$replace = str_replace("{contenido}", $reemplazalist, $master);
    $master = file_get_contents('parts/master.html');
    $replace = str_replace("{contenido}", $reemplazalist, $master);
}

echo $replace;
?>