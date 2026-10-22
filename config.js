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
  // weddingDate = tanggal akad & resepsi (format YYYY-MM-DD)
  // jam live diambil dari reception.events[0].time (contoh "15.30" = 15.30 WIB)
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
    title: "Join Us From Anywhere",
    subtitle: "Live Streaming",
    label: "Wedding Reception",
    desc: "Tidak bisa hadir secara langsung? Ikuti momen berharga kami lewat live streaming.",
    note: "Kami akan mengirim pengingat 1 jam sebelum acara dimulai",
    calendar: true,
  },

  // --- KADO & UCAPAN (transfer bank / dompet digital) ---
  // Ganti nomor rekening & nomor DANA di sini, section otomatis ikut berubah.
  // "display" (opsional): teks yang dilihat tamu, berbeda dari nilai yang disalin.
  gift: {
    title: "Gifts & Wishes",
    subtitle:
      "Kehadiran Anda adalah kado terindah bagi kami. Jika berkenan memberikan hadiah, kami menyediakan opsi berikut:",
    accounts: [
      {
        kind: "Transfer Bank",
        title: "Bank Mandiri",
        image: "assets/images/mandiri-card.jpg",
        label: "Nomor Rekening",
        number: "123000555777999",
        holder: "a.n. Romeo Pratama",
        copyLabel: "Salin nomor rekening",
      },
      {
        kind: "Dompet Digital",
        title: "DANA",
        image: "assets/images/dana-card.svg",
        label: "Nomor DANA",
        number: "081234567890",
        display: "0812 3456 7890",
        holder: "a.n. Romeo Pratama",
        copyLabel: "Salin nomor DANA",
      },
    ],
  },

  // --- TAMU (RSVP & Wishes) ---
  guest: {
    whatsapp: "6281234567890", // nomor WhatsApp penerima, kode negara tanpa "+"
    subtitle: "Konfirmasi kehadiran dan ucapan doa dari tamu",
    intro: "Sampaikan konfirmasi kehadiran dan doa Anda kepada kami.",
    note: "Atau konfirmasi langsung kepada kami kapan saja.",
  },

  // --- TEKS UI ---
  // Semua teks statis (judul section, label tombol, placeholder) ada di sini,
  // jadi tinggal ubah file ini kalau mau mengganti kata-katanya.
  ui: {
    loaderText: "Opening our story…",
    coverTopline: "The Wedding Invitation",
    openButton: "Buka Undangan",
    scrollHint: "Scroll Down",
    greetingCaption: "Together with our beloved families",
    brideFamilyLabel: "Putri tercinta dari",
    groomFamilyLabel: "Putra tercinta dari",
    galleryTitle: "Our Story in Frames",
    galleryCaption: "Our Moment",
    countdownTitle: "Counting Down to Forever",
    countdownUnits: { days: "Days", hours: "Hours", mins: "Mins", secs: "Secs" },
    venueTitle: "Find Us",
    venueMapLabel: "Peta",
    liveCalendar: "Simpan ke Kalender",
    liveYoutube: "YouTube Live",
    liveInstagram: "Instagram Live",
    guestTitle: "Répondez s’il vous plaît",
    guestYes: "Hadir",
    guestNo: "Tidak hadir",
    guestNamePlaceholder: "Nama Anda",
    guestMsgPlaceholder: "Ucapan & Doa",
    guestSend: "Kirim WhatsApp",
    rsvpLabel: "With Blessings",
    rsvpSub: "Thank you for being a part of our love story.",
    footerNote: "Made with love",
  },

  // --- COUNTDOWN ---
  // Default: countdown memakai tanggal (weddingDate) + jam live pertama
  // di timeline (reception.events[0].time). Jadi cukup ganti weddingDate
  // + jam live, semuanya ikut berubah.
  // Kalau mau countdown ke waktu lain, isi (opsional), contoh:
  // countdownTarget: "2026-10-23T08:00:00+07:00",
  countdownTarget: "",
};