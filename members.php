<?php
header('Content-Type: application/json');

// URL твоего Node bot API (или локальный сервер)
$url = "http://localhost:3001/members";

$response = file_get_contents($url);

echo $response;