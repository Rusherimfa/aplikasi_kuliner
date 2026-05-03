<?php

function cleanJson(string $filePath)
{
    if (! file_exists($filePath)) {
        echo "File not found: $filePath\n";

        return;
    }

    $content = file_get_contents($filePath);
    $data = json_decode($content, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "Invalid JSON in $filePath: ".json_last_error_msg()."\n";

        return;
    }

    // ksort($data); // Optional: sort keys alphabetically

    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    file_put_contents($filePath, $json);
    echo "Cleaned $filePath\n";
}

cleanJson($argv[1]);
