# Wonderful Aceh – Project Structure

```
wonderful-aceh-v2/
├── index.html          ← Beranda (with loading screen, first visit only)
├── login.html          ← Halaman login
├── about.html          ← Tentang kami
├── destinasi.html      ← Destinasi wisata
├── budaya.html         ← Budaya Aceh
├── kuliner.html        ← Kuliner khas
├── landmark.html       ← Landmark bersejarah
├── assets/
│   ├── css/style.css   ← Semua styling
│   └── js/script.js    ← JavaScript (auth, hero, etc.)
└── image/              ← ⬅ TARUH SEMUA GAMBAR DI SINI
    ├── hero1.png       ← Slide hero 1
    ├── hero2.png       ← Slide hero 2
    ├── hero3.png       ← Slide hero 3
    ├── hero4.png       ← Slide hero 4
    ├── logo1.png       ← Logo utama (navbar & login card kiri)
    ├── logo2.png       ← Logo kedua (login card kanan)
    └── profile.png     ← Foto profil Ridhatul Jannati (about page)
```

## Cara Mengganti Gambar

Semua gambar diambil dari folder `image/`. Cukup ganti file di folder tersebut,
nama file harus sama persis. Format PNG atau JPG keduanya didukung.

## Login

Sistem login menggunakan sessionStorage (browser session saja).
Username dan password apapun bisa digunakan selama tidak kosong.
Setelah login, tombol Login di navbar berubah menjadi nama user + avatar inisial.
Klik avatar → menu → Keluar untuk logout.

## Loading Screen

Hanya muncul di halaman `index.html` (Beranda), dan hanya sekali per sesi browser.
Navigasi ke halaman lain TIDAK akan memunculkan loading screen.
