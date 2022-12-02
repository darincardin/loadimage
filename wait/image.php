<?php

for($i; $i<1000; $i++) ;

$test = "http://examples.darincardin.infinityfreeapp.com/photos/birds.jpg";
$string = "http://examples.darincardin.infinityfreeapp.com/photos/";
$string .= $_GET['img'];

header('Content-type: image/jpeg');
echo file_get_contents( $string );



?>