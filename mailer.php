<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
require_once 'vendor/PHPMailer-master/PHPMailerAutoload.php';

class mailer {

    function enviamail($datos) {

        //Create a new PHPMailer instance
        // Crear una nueva  instancia de PHPMailer habilitando el tratamiento de excepciones
        $mail = new PHPMailer(true);
// Configuramos el protocolo SMTP con autenticación
        $mail->IsSMTP();
        $mail->SMTPAuth = true;
// Puerto de escucha del servidor
        $mail->Port = 25;
// Dirección del servidor SMTP
        $mail->Host = 'mail.dentalia.com.mx';
// Usuario y contraseña para autenticación en el servidor
        $mail->Username = "no-reply@dentalia.com.mx";
        $mail->Password = "x#l%=pcDw,TS";

//Set who the message is to be sent from
        $mail->setFrom('no-reply@dentalia.com.mx', 'Dentalia');
//Set an alternative reply-to address
        $mail->addReplyTo('contacto@dentalia.com.mx', 'Dentalia');
//Set who the message is to be sent to
        //$mail->addAddress('gdeleon@dentalia.com', 'Geovanny De Leon');
        $nombre = $datos['nombre'] . " " . $datos['apaterno'] . " " . $datos['amaterno'];
        $mail->addAddress($datos['email'], $nombre);
        //$mail->addCC('gldeleon@live.com.mx', 'Geovanny De Leon');
//Set the subject line
        $mail->Subject = utf8_decode('Confirmación de Cita en Dentalia');
//Read an HTML message body from an external file, convert referenced images to embedded,
//convert HTML into a basic plain-text alternative body
        $msj = file_get_contents('parts/mailer.html');
        $replacename = str_replace("{patname}", $nombre, $msj);
        $replaceclnic = str_replace("{nombreclinic}", $datos['cliname'], $replacename);
        $dia = date("l", strtotime($datos['fecha']));

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

        $mes = date("F", strtotime($datos['fecha']));

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
        $dia2 = date("d", strtotime($datos['fecha']));
        $ano = date("Y", strtotime($datos['fecha']));
        $replacefecha = str_replace("{fecha}", $dia . ", " . $dia2 . " de " . $mes . " de " . $ano, $replaceclnic);
        $hor = explode("-", $datos['horai']);
        $horaini = date('h:ia', strtotime($hor[0]));
        $horaend = date('h:ia', strtotime($hor[1]));
        $horaconc = $horaini . " a " . $horaend;
        $replacef = str_replace("{horario}", $horaconc, $replacefecha);

//        $ruta = "webcal://" . $_SERVER["SERVER_NAME"] . "/parts/evento.ics";
//        /* reemplazamos para el calendario */
//        $replaceCal = str_replace("{ruta}", $ruta, $replacef);

        $final = str_replace("{dirclinic}", $datos['clidir'], $replacef);


        $mail->msgHTML(utf8_decode($final));

//        var_dump($final);
//        echo "cual es el error?";
        if ($mail->send()) {
            //echo "Message sent!";
            return true;
        } else {
            echo "Mailer Error: " . $mail->ErrorInfo;
        }
    }

}
