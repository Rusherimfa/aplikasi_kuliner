<?php

function cleanJson($filePath)
{
    if (! file_exists($filePath)) {
        return;
    }
    $content = file_get_contents($filePath);
    $data = json_decode($content, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "Error parsing $filePath: ".json_last_error_msg()."\n";

        return;
    }
    // json_decode with true already handles duplicates by taking the LAST one
    $cleaned = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    file_put_contents($filePath, $cleaned);
    echo "Cleaned $filePath\n";
}

cleanJson('c:/laragon/www/restoweb/lang/en.json');
cleanJson('c:/laragon/www/restoweb/lang/id.json');
