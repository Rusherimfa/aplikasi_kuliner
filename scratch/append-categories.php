<?php

function appendKeys(string $filePath, array $newKeys)
{
    if (! file_exists($filePath)) {
        return;
    }
    $content = file_get_contents($filePath);
    $data = json_decode($content, true);
    if (! $data) {
        $data = [];
    }

    foreach ($newKeys as $k => $v) {
        $data[$k] = $v;
    }

    file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
}

$newKeysId = [
    'All' => 'Semua',
    'Signature Seafood' => 'Seafood Andalan',
    'Grilled Fish' => 'Ikan Bakar',
    'Vegetables' => 'Sayuran',
    'Seafood' => 'Seafood',
];

$newKeysEn = [
    'All' => 'All',
    'Signature Seafood' => 'Signature Seafood',
    'Grilled Fish' => 'Grilled Fish',
    'Vegetables' => 'Vegetables',
    'Seafood' => 'Seafood',
];

appendKeys('lang/id.json', $newKeysId);
appendKeys('lang/en.json', $newKeysEn);
