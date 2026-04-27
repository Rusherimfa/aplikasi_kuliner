<?php

function appendKeys($filePath, $newKeys)
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
    'Last updated: April 2026. How we protect your digital gastronomic identity.' => 'Terakhir diperbarui: April 2026. Bagaimana kami melindungi identitas gastronomi digital Anda.',
    'Data Collection' => 'Pengumpulan Data',
    'We collect information that you provide directly to us, such as when you create a reservation, order food, or contact us for support. This includes your name, email, phone number, and preferences.' => 'Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, seperti saat Anda membuat reservasi, memesan makanan, atau menghubungi kami untuk bantuan. Ini mencakup nama, email, nomor telepon, dan preferensi Anda.',
    'Information Security' => 'Keamanan Informasi',
    "Ocean's Resto implements state-of-the-art encryption protocols to safeguard your personal data. We treat your privacy with the same precision we apply to our culinary creations." => "Ocean's Resto menerapkan protokol enkripsi mutakhir untuk melindungi data pribadi Anda. Kami memperlakukan privasi Anda dengan presisi yang sama seperti saat kami meracik kreasi kuliner kami.",
    'Usage of Data' => 'Penggunaan Data',
    'Your data is used exclusively to enhance your experience, manage bookings, process payments, and provide concierge assistance via our AI and staff support.' => 'Data Anda digunakan secara eksklusif untuk meningkatkan pengalaman Anda, mengelola pemesanan, memproses pembayaran, dan memberikan bantuan concierge melalui AI dan dukungan staf kami.',
    'Need clarification?' => 'Butuh klarifikasi?',
    'If you have questions about our digital protocols, our concierge team is available 24/7.' => 'Jika Anda memiliki pertanyaan tentang protokol digital kami, tim concierge kami tersedia 24/7.',
    "The agreement between the guest and Ocean's Resto. Our mutual commitment to excellence." => "Kesepakatan antara tamu dan Ocean's Resto. Komitmen bersama kami terhadap keunggulan.",
    'Reservation Protocol' => 'Protokol Reservasi',
    'By booking a table, you agree to arrive within 15 minutes of your scheduled time. Late arrivals may result in the reallocation of your table to ensure optimal flow of our gastronomic experience.' => 'Dengan memesan meja, Anda setuju untuk tiba dalam waktu 15 menit dari waktu yang dijadwalkan. Keterlambatan dapat mengakibatkan pengalihan meja Anda untuk memastikan kelancaran pengalaman gastronomi kami.',
    'Cancellations' => 'Pembatalan',
    'Cancellations must be made at least 24 hours in advance. Deposits for premium experiences or private bookings are non-refundable but may be credited for future visits.' => 'Pembatalan harus dilakukan setidaknya 24 jam sebelumnya. Deposit untuk pengalaman premium atau pemesanan privat tidak dapat dikembalikan tetapi dapat dikreditkan untuk kunjungan mendatang.',
    'Code of Conduct' => 'Kode Etik',
    'We maintain an environment of refined elegance. We reserve the right to refuse service to anyone whose behavior disrupts the sanctuary of flavor we have created for our guests.' => 'Kami menjaga lingkungan yang elegan dan berkelas. Kami berhak menolak layanan kepada siapa pun yang perilakunya mengganggu ketenangan rasa yang telah kami ciptakan untuk tamu kami.',
    'Agreement Questions?' => 'Pertanyaan Kesepakatan?',
    'For detailed inquiries regarding our service protocols, please reach out to our legal liaison.' => 'Untuk pertanyaan mendetail mengenai protokol layanan kami, silakan hubungi bagian hukum kami.',
];

$newKeysEn = [
    'Last updated: April 2026. How we protect your digital gastronomic identity.' => 'Last updated: April 2026. How we protect your digital gastronomic identity.',
    'Data Collection' => 'Data Collection',
    'We collect information that you provide directly to us, such as when you create a reservation, order food, or contact us for support. This includes your name, email, phone number, and preferences.' => 'We collect information that you provide directly to us, such as when you create a reservation, order food, or contact us for support. This includes your name, email, phone number, and preferences.',
    'Information Security' => 'Information Security',
    "Ocean's Resto implements state-of-the-art encryption protocols to safeguard your personal data. We treat your privacy with the same precision we apply to our culinary creations." => "Ocean's Resto implements state-of-the-art encryption protocols to safeguard your personal data. We treat your privacy with the same precision we apply to our culinary creations.",
    'Usage of Data' => 'Usage of Data',
    'Your data is used exclusively to enhance your experience, manage bookings, process payments, and provide concierge assistance via our AI and staff support.' => 'Your data is used exclusively to enhance your experience, manage bookings, process payments, and provide concierge assistance via our AI and staff support.',
    'Need clarification?' => 'Need clarification?',
    'If you have questions about our digital protocols, our concierge team is available 24/7.' => 'If you have questions about our digital protocols, our concierge team is available 24/7.',
    "The agreement between the guest and Ocean's Resto. Our mutual commitment to excellence." => "The agreement between the guest and Ocean's Resto. Our mutual commitment to excellence.",
    'Reservation Protocol' => 'Reservation Protocol',
    'By booking a table, you agree to arrive within 15 minutes of your scheduled time. Late arrivals may result in the reallocation of your table to ensure optimal flow of our gastronomic experience.' => 'By booking a table, you agree to arrive within 15 minutes of your scheduled time. Late arrivals may result in the reallocation of your table to ensure optimal flow of our gastronomic experience.',
    'Cancellations' => 'Cancellations',
    'Cancellations must be made at least 24 hours in advance. Deposits for premium experiences or private bookings are non-refundable but may be credited for future visits.' => 'Cancellations must be made at least 24 hours in advance. Deposits for premium experiences or private bookings are non-refundable but may be credited for future visits.',
    'Code of Conduct' => 'Code of Conduct',
    'We maintain an environment of refined elegance. We reserve the right to refuse service to anyone whose behavior disrupts the sanctuary of flavor we have created for our guests.' => 'We maintain an environment of refined elegance. We reserve the right to refuse service to anyone whose behavior disrupts the sanctuary of flavor we have created for our guests.',
    'Agreement Questions?' => 'Agreement Questions?',
    'For detailed inquiries regarding our service protocols, please reach out to our legal liaison.' => 'For detailed inquiries regarding our service protocols, please reach out to our legal liaison.',
];

appendKeys('lang/id.json', $newKeysId);
appendKeys('lang/en.json', $newKeysEn);
