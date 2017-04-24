<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
require_once 'model/agendaenlineamodel.php';
$model = new agendamodel();
switch ($_POST['controller']) {
    case 'edosmaps':
        $datos = '"request": "getStateList"';
        /* obtengo la lista de estados donde hay una clinica Dentalia */
        $rs = $model->apiDent($datos);

        foreach ($rs["data"] as $number => $valor) {
            /* traigo el lat lng del estado */
            $lngalt = $model->apiMaps($valor["sttName"]);
            $final[] = array($lngalt['results'][0]['address_components'][0]['long_name'], $lngalt['results'][0]['geometry']['location']['lat'], $lngalt['results'][0]['geometry']['location']['lng'], $number);
        }
        break;
    case 'edosmapsselect':
        $datos = '"request": "getStateList"';
        /* obtengo la lista de estados donde hay una clinica Dentalia */
        $rs = $model->apiDent($datos);
        //$final .= '<option value="0">-- Seleccionar un Estado --</option>';
        foreach ($rs["data"] as $number => $valor) {
            /* traigo el lat lng del estado */
            $lngalt = $model->apiMaps($valor["sttName"]);
            $final .= '<option value="' . $lngalt['results'][0]['address_components'][0]['long_name'] . '">' . $lngalt['results'][0]['address_components'][0]['long_name'] . '</option>';
        }
        break;
    case 'traeclinicas':
        $claveedo = $_POST['cveedo'];
        $datos = '"request": "getCliList", "sttID": "' . $claveedo . '"';
        //'sttID': Integer no trae direcciones de clinicas
        $rs = $model->apiDent($datos);
//        var_dump($rs);
//        die('que devuelve de clinic');

        foreach ($rs["data"]["cliList"] as $number => $valor) {
            /* traigo el lat lng de la clinica */
            $final[] = array($valor["cliID"] . ' ' . $valor["cliName"], $valor["cliLat"], $valor["cliLng"]);
        }
        if ($claveedo == 9) {
            $datos = '"request": "getCliList", "sttID": "' . 15 . '"';
            $rs = $model->apiDent($datos);
//        var_dump($rs);
//        die('que devuelve de clinic');

            foreach ($rs["data"]["cliList"] as $number => $valor) {
                /* traigo el lat lng del estado */
                if ($valor["cliID"] != 21) {
                    $final[] = array($valor["cliID"] . ' ' . $valor["cliName"], $valor["cliLat"], $valor["cliLng"]);
                }
            }
        }

        //var_dump($rs->data->cliList);
        //var_dump($final);
        //die('como lo regresa');
        break;
    case 'especialidades':
        $datos = '"request": "getSpcList"';
        //'sttID': Integer
        $rs = $model->apiDent($datos);
        //var_dump($rs);
        foreach ($rs["data"] as $number => $valor) {
            /* traigo el lat lng del estado */
            $final[] = array($valor["spcID"], $valor["spcName"]);
        }
        break;
    case 'tratamientos':
        $esp_id = $_POST['esp_id'];
        $datos = '"request": "getTrtListBySpc", "spcID": ' . $esp_id . '';
        //'sttID': Integer
        $rs = $model->apiDent($datos);
        //var_dump($rs);
        foreach ($rs["data"] as $number => $valor) {
            /* trae los tratamientos y su id */
            $final[] = array($valor["trtID"], $valor["trtName"]);
        }
        break;

    case 'getClinicById':

        //die('datos a solicitar');
        $fecha = date('Y-m-d');
        //echo var_dump($_POST);
        //$datos = '"request": "getTrtListBySpc", "spcID": ' . $esp_id . '';
        $datos = '"request": "getClinicById", "cliID": "' . $_POST['cliID'] . '", "iniDate": "' . $fecha . '", "endDate": "' . $fecha . '"';
        //echo $datos;
        $rs = $model->apiDent($datos);
        //var_dump($rs);
        $final[] = array($rs["data"]["cliName"], $rs["data"]["cliMapLat"], $rs["data"]["cliMapLng"], $rs["data"]["cliEmail"], $rs["data"]["cliAddress"]);

//        foreach ($rs["data"]["cliList"] as $number => $valor) {
//            /* traigo el lat lng del estado */
//            $final[] = array($valor["cliID"] . ' ' . $valor["cliName"], $valor["cliLat"], $valor["cliLng"]);
//        }
        //var_dump($final);
        //die();
        break;
    case 'calendar':
        //var_dump($_POST);
        $cliID = $_POST['cliid'];
        $trtID = $_POST['trtid'];
        $diaINI = $_POST['fecha'];
        $diaEND = $_POST['fecha'];
        $datos = '"request": "getFreeHoursByTrt", "cliID": "' . $cliID . '", "iniDate": "' . $diaINI . '", "endDate": "' . $diaEND . '", "trtID":"' . $trtID . '"';
        //$datos = '"request": "getSchedule", "cliID": ' . $cliID . ', "iniDate": "' . $diaINI . '", "endDate": "' . $diaEND . '", "trtID":"' . $trtID . '"';
        //echo $datos;
        $rs = $model->apiDent($datos);

        $dr = "";
        $drid = "";
//          var_dump($rs["data"][$diaINI]);
        $final .= '      <div class="table-responsive1">
                                <table id="table-horarios1" class="table display" cellspacing="0" width="100%">
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
//<td><center><input class="horarios" name="selecth" value="' . $horas . "-" . $hfinal . "-" . $silla . '" type="radio" required="required"/></center></td>
                $poshorario = strpos($name, 'horario_');
                if ($poshorario !== false) {
                    foreach ($valor as $horas) {
                        $nuevaHora = strtotime('+' . $lapso . ' minutes', strtotime($horas));
                        $hfinal = date('H:i:s', $nuevaHora);
                        if ($hfinal < $ultimahora) {
                            //<td>' . date('h:ia', strtotime($horas)) . " - " . date("h:ia", strtotime($hfinal)) . '</td>
                            $final .= '<tr>
                                        <td>' . date('h:ia', strtotime($horas)) . '</td>
                                        <td><center>' . $lapso . ' min<center></td>
                                        <td>' . $dr . '</td>
                                        <td><center><input name="selecth" class="horarios" value="' . $horas . "_" . $hfinal . "-" . $silla . "-" . $dr . "-" . $docID . '" type="radio" required="required"/></center></td>
                                    </tr>';
                        }
                    }
                }
            }
        }
        $final .= '</tbody>'
                . '</table>'
                . '</div>';

        break;
}
echo json_encode($final);
exit();


