<?php

header('Content-Type: application/json; charset=utf-8');

// =====================================================
// НАСТРОЙКИ
// =====================================================

$webhook = "https://discord.com/api/webhooks/1510923358676717600/Wp7Ybdxi2QLrjiiavGK6ky8G5CouGGmsiqukAN3jN5lNfbiumpKn8HygV762ZgEM6y23";

// Ссылка на картинку Miller Family
$imageUrl = "https://cdn.discordapp.com/attachments/1509898657242021969/1510924961102172160/xmapp.png?ex=6a1e9606&is=6a1d4486&hm=436b8c61e6e3048fec413a50a7dfe6bfe185b522d478b7ae2bc870f993178773";

// =====================================================
// ПОЛУЧЕНИЕ ДАННЫХ
// =====================================================

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Пустой запрос"
    ]);

    exit;
}

// =====================================================
// ДАННЫЕ ФОРМЫ
// =====================================================

$nickname = trim($data["nickname"] ?? "");
$age = trim($data["age"] ?? "");
$discord = trim($data["discord"] ?? "");
$experience = trim($data["experience"] ?? "");
$reason = trim($data["reason"] ?? "");

if (
    empty($nickname) ||
    empty($age) ||
    empty($discord) ||
    empty($experience) ||
    empty($reason)
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Не все поля заполнены"
    ]);

    exit;
}

// =====================================================
// EMBED ДЛЯ DISCORD
// =====================================================

$message = [
    "embeds" => [
        [
            "title" => "📋 НОВАЯ ЗАЯВКА В MILLER FAMILY",

            "description" =>
                "Поступила новая заявка на вступление в семью.",

            "color" => 15548997,

            "fields" => [

                [
                    "name" => "👤 Никнейм",
                    "value" => $nickname,
                    "inline" => true
                ],

                [
                    "name" => "🎂 Возраст",
                    "value" => $age,
                    "inline" => true
                ],

                [
                    "name" => "💬 Discord",
                    "value" => $discord,
                    "inline" => false
                ],

                [
                    "name" => "🎮 RP Опыт",
                    "value" => $experience,
                    "inline" => false
                ],

                [
                    "name" => "📝 Причина вступления",
                    "value" => $reason,
                    "inline" => false
                ]
            ],

            "image" => [
                "url" => $imageUrl
            ],

            "footer" => [
                "text" => "Miller Family • Power • Loyalty • Respect"
            ],

            "timestamp" => gmdate("c")
        ]
    ]
];

// =====================================================
// ОТПРАВКА В DISCORD
// =====================================================

$ch = curl_init($webhook);

curl_setopt($ch, CURLOPT_POST, true);

curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json"
]);

curl_setopt(
    $ch,
    CURLOPT_POSTFIELDS,
    json_encode($message, JSON_UNESCAPED_UNICODE)
);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

$error = curl_error($ch);

curl_close($ch);

// =====================================================
// ОТВЕТ САЙТУ
// =====================================================

if ($httpCode === 204) {

    echo json_encode([
        "success" => true
    ]);

} else {

    echo json_encode([
        "success" => false,
        "http_code" => $httpCode,
        "error" => $error,
        "discord_response" => $response
    ]);
}