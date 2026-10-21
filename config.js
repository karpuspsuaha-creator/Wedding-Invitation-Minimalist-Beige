/**
 * ============================================================
 * CONFIG — UNTUK MUDAH DI-EDIT / DI-REPLACE
 * ============================================================
 * Cukup ubah data di bawah ini. Semua field di bawah ini
 * otomatis terbaca oleh script.js dan index.html.
 * Format path foto: relatif terhadap folder yang berisi index.html.
 * Contoh: "assets/images/groom.jpg"
 * ============================================================
 */
const WEDDING_CONFIG = {
  // --- IDENTITAS PASANGAN ---
  bride: {
    name: "Sarah Putri",
    parents: "Bapak & Ibu Budi Santoso",
  },
  groom: {
    name: "Andi Wijaya",
    parents: "Bapak & Ibu H. Ahmad Fauzi",
  },

  // --- TANGGAL & WAKTU ---
  weddingDate: "2026-11-28", // format: YYYY-MM-DD
  // --- ACARA RESEPSI (timeline Event Details) ---
  reception: {
    title: "Wedding Reception",
    subtitle: "A beautiful evening to celebrate our love",
    quote: "“Your presence will make our special day even more meaningful.”",
    events: [
      {
        time: "15.30", unit: "WIB", cat: "Penerimaan Tamu", title: "Guest Arrival", icon: "door",
        desc: "Kedatangan dan penyambutan tamu undangan, dilanjutkan dengan registrasi serta menikmati suasana acara.",
      },
      {
        time: "16.00", unit: "WIB", cat: "Sesi Doa & Ucapan", title: "Greeting the Couple & Celebration", icon: "handshake",
        desc: "Menyampaikan ucapan selamat dan doa restu kepada kedua pengantin, serta mengabadikan momen bahagia bersama.",
      },
      {
        time: "16.30", unit: "WIB", cat: "Jamuan & Kebersamaan", title: "Dining & Fellowship", icon: "cutlery",
        desc: "Menikmati hidangan yang tersedia sambil berbincang dan mempererat kebersamaan.",
      },
      {
        time: "19.00", unit: "WIB", cat: "Penutup", title: "Closing & Farewell", icon: "sunset",
        desc: "Penutupan acara dan ucapan terima kasih atas kehadiran serta doa restu para tamu.",
      },
    ],
  },

  // --- LOKASI ---
  // lat/lng = titik pin di peta (dipakai juga untuk link "Open in Maps").
  // Cara dapat koordinat yang persis: buka Google Maps -> klik kanan lokasi ->
  // salin angka pertama (latitude) & kedua (longitude).
  // Kalau lat/lng dihapus, peta akan mencari lewat nama alamat (ada panel putih Google).
  venue: {
    name: "The Grand Ballroom",
    hotel: "Mercure Jakarta Gatot Subroto",
    address: "Jalan Gatot Subroto Kav. 1, Kuningan Barat, Jakarta Selatan",
    lat: -6.2395,
    lng: 106.8306,
    mapsUrl: "https://maps.google.com/?q=-6.2395,106.8306",
  },

  // --- FOTO (gantilah path ini dengan foto kamu) ---
  photos: {
    couple: "https://images.unsplash.com/photo-1629210881793-30f33acb2c6a?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb", // foto pasangan (hero)
    bride: "assets/images/wedding-moment.jpg",
    groom: "assets/images/couple-story.jpg",
    greeting: "assets/images/greeting-framed.png",
    greetingFull: "assets/images/greeting-framed-full.png", // versi rapat untuk lightbox
    gallery: [
      "assets/images/wedding-ceremony.jpg",
      "assets/images/wedding-details.jpg",
      "assets/images/wedding-venue.jpg",
      "assets/images/couple-story.jpg",
    ],
  },

  // --- MUSIK (gantilah path ini dengan lagu kamu) ---
  music: {
    youtubeId: "BJT5PSlZ63A",
    title: "Jincheng Zhang - Chart",
    artist: "Background Music",
    autoplay: true,
    volume: 0.5, // 0.0 - 1.0
  },

  // --- KATA SAMBUTAN ---
  greeting: {
    title: "The Wedding of",
    subtitle: "We solemnly invite you to share our happiness",
    bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    salam: "Assalamu’alaikum warahmatullahi wabarakatuh",
    message:
      "Dengan memohon rahmat dan ridha Allah SWT, serta penuh rasa syukur, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dan menjadi bagian dari hari yang istimewa kami, dalam memulai perjalanan baru sebagai pasangan suami istri.",
    message2:
      "Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu bagi pernikahan kami.",
    duaa: "وَبَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    duaaMeaning:
      "Semoga Allah memberkahi kalian berdua, melimpahkan keberkahan atas kalian, dan menyatukan kalian berdua dalam kebaikan.",
    wassalam: "Wassalamu’alaikum warahmatullahi wabarakatuh",
  },

  // --- TAUTAN LIVE (di bawah peta) ---
  live: {
    youtube: "",      // link live streaming (isi nanti, live belum ada)
    youtubeId: "",    // id video YouTube untuk thumbnail
    instagram: "",    // akun Instagram
    hint: "Siaran langsung akan dimulai 10 menit sebelum acara",
    title: "Hadir dari Mana Saja",
    subtitle: "Siaran Langsung",
    label: "Wedding Reception",
    desc: "Tidak bisa hadir secara langsung? Ikuti momen berharga kami lewat live streaming.",
    note: "Kami akan mengirim pengingat 1 jam sebelum acara dimulai",
    calendar: true,
  },

  // --- TAMU (RSVP & Wishes) ---
  guest: {
    whatsapp: "6281234567890", // nomor WhatsApp penerima, kode negara tanpa "+"
    subtitle: "Konfirmasi kehadiran dan ucapan doa dari tamu",
    intro: "Sampaikan konfirmasi kehadiran dan doa Anda kepada kami.",
    note: "Atau konfirmasi langsung kepada kami kapan saja.",
  },

  // --- COUNTDOWN TARGET ---
  countdownTarget: "2026-11-28T08:00:00",
};