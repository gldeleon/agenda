<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class agendamodel {

    function apiDent($data) {
        $api = 'miplan';
        $llave = '47b787581d55919d52f89c17c2afef2c859fb150';
        header('Content-Type: text/html; charset=UTF-8');
        ## URL dentalia
        //$url = 'https://api.dentalia.com.mx/index.php?api=' . $api;
        /* LOCAL */
        $url = 'http://api.dentalia.com.mx.local/index.php?api=' . $api;

        $jsonRequest = '{"ext_key":"' . $llave . '", ' . $data . '}';
        $postArray = json_decode($jsonRequest, TRUE);
        //echo "testAPI({$url}) cURL: <pre>" . print_r($postArray, true) . "</pre><br/>";
        ## cURL request
        $curl = curl_init();
        $curlOptions = array(
            CURLOPT_URL => $url,
            CURLOPT_POST => TRUE,
            CURLOPT_POSTFIELDS => http_build_query($postArray),
            CURLOPT_HEADER => FALSE,
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_VERBOSE => 1
        );
        curl_setopt_array($curl, $curlOptions);
        // obtenemos la respuesta (cadena JSON)
        $output = curl_exec($curl);

        if (curl_errno($curl)) {
            echo '<p style="color:red;">Curl error: ' . curl_error($curl) . '</p>';
        }

        curl_close($curl);
        //var_dump($output);
        // imprime la cadena JSON
        /**/
//        echo '<p>Respuesta de la api: ' . $output . '</p>';
//        echo "<br/>En print_r dice: <br/><pre>" . print_r(json_decode($output), TRUE) . "</pre>";
        return json_decode($output, true);
    }

    function apiMaps($city) {
        $apikey = 'AIzaSyAwSft_DFI-xKHyAQ9WrLH3QXVQ0gd4jAY';
        $cityclean = str_replace(" ", "+", $city);
        $details_url = "https://maps.googleapis.com/maps/api/geocode/json?address=" . $cityclean . "+mexico&sensor=false&key=" . $apikey . "";
        //echo $details_url;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $details_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $geoloc = json_decode(curl_exec($ch), true);
        return $geoloc;
    }

}
