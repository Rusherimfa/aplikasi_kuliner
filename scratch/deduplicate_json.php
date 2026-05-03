<?php

function deduplicateJson($filePath)
{
    if (! file_exists($filePath)) {
        echo "File not found: $filePath\n";

        return;
    }

    $content = file_get_contents($filePath);
    // JSON decode will naturally keep the LAST occurrence of a duplicate key
    $data = json_decode($content, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "JSON Error in $filePath: ".json_last_error_msg()."\n";

        return;
    }

    // Re-encode with pretty print and unescaped slashes/unicode
    $newContent = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    file_put_contents($filePath, $newContent);
    echo "Deduplicated $filePath\n";
}

deduplicateJson('lang/id.json');
deduplicateJson('lang/en.json');
