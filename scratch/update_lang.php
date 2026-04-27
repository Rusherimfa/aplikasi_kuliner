<?php

$id = json_decode(file_get_contents('lang/id.json'), true);
$id['Crystal Ocean'] = 'Mode Terang (Ocean)';
$id['Deep Sea'] = 'Mode Gelap (Deep Sea)';
$id['Adaptive Sync'] = 'Otomatis (Sistem)';
$id['Pure, bright, and high readability'] = 'Murni, terang, dan mudah dibaca';
$id['Cinematic indigo and deep navy'] = 'Indigo sinematik dan navy dalam';
$id['Follows your system environment'] = 'Mengikuti pengaturan sistem Anda';
file_put_contents('lang/id.json', json_encode($id, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo 'Success';
