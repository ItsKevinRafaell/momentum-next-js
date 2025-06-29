# Project: Momentum - Frontend (Next.js)

Antarmuka pengguna (UI) yang modern, responsif, dan interaktif untuk aplikasi Project Momentum. Dibangun menggunakan Next.js, TypeScript, dan Tailwind CSS.

---

### Tentang Proyek (About The Project)

Ini adalah sisi klien dari aplikasi AI Productivity Coach, Project Momentum. Frontend ini dirancang untuk memberikan pengalaman pengguna yang mulus dan menyenangkan, memungkinkan pengguna untuk berinteraksi dengan jadwal harian mereka, menetapkan tujuan jangka panjang, dan menerima feedback dari AI. Aplikasi ini terhubung ke [Backend API Go](https://github.com/link-ke-repo-backend-anda) yang berjalan secara terpisah.

### Tampilan (Screenshots)

_Tempelkan screenshot aplikasi Anda di sini untuk membuatnya lebih menarik._

|                 Halaman Login                  |                Dashboard Utama                 |              Halaman Roadmap               |
| :--------------------------------------------: | :--------------------------------------------: | :----------------------------------------: |
| ![Halaman Login](link/ke/screenshot_login.png) | ![Dashboard](link/ke/screenshot_dashboard.png) | ![Roadmap](link/ke/screenshot_roadmap.png) |

### Fitur Utama (Core Features)

- **Alur Autentikasi Lengkap:** Halaman registrasi, login, dan fungsionalitas logout yang aman menggunakan `httpOnly` cookie.
- **Rute Terproteksi:** Pengguna yang belum login akan secara otomatis diarahkan ke halaman login.
- **Dashboard Tugas Dinamis:** Menampilkan jadwal tugas harian yang diambil secara _real-time_ dari backend, lengkap dengan status _loading_ yang elegan.
- **Manajemen Tugas Lengkap (CRUD):**
  - Menambah tugas manual baru melalui _dialog popup_.
  - Mengubah status tugas (selesai/pending) dengan _checkbox_.
  - Menghapus tugas dengan dialog konfirmasi yang aman.
- **Onboarding Pengguna:** Alur intuitif bagi pengguna baru untuk menetapkan tujuan utama mereka jika belum ada.
- **Manajemen Tujuan:** Menampilkan tujuan utama dan langkah-langkah roadmap yang dihasilkan AI.
- **Pengaturan Pengguna:** Termasuk fungsionalitas ganti tema (Light/Dark Mode) dan form untuk mengubah password.

### Teknologi & Pustaka Utama (Tech Stack)

- **Framework:** Next.js 14+ (dengan App Router)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS v4
- **Pustaka Komponen:** Shadcn/UI
- **Manajemen Data Server:** TanStack Query (React Query) v5
- **Notifikasi:** React Hot Toast
- **Ikon:** Lucide React

---

### Instalasi & Menjalankan Lokal

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut.

**1. Prasyarat**

- Node.js (versi 18 atau lebih baru)
- NPM atau Yarn

**2. Setup Proyek**

1.  **Clone repositori:**

    ```bash
    git clone [https://github.com/username/project-momentum-frontend.git](https://github.com/username/project-momentum-frontend.git)
    cd project-momentum-frontend
    ```

2.  **Instalasi Dependencies:**

    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variable:**
    Buat file `.env.local` di root proyek dengan menyalin dari contoh.

    ```bash
    cp .env.local.example .env.local
    ```

    _Buat file `.env.local.example` terlebih dahulu dengan isi sebagai berikut:_

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080
    ```

    Isi file `.env.local` Anda. Untuk development, nilainya adalah alamat backend lokal Anda.

4.  **Jalankan Backend Server Lokal:**
    Pastikan server backend Go Anda berjalan di terminal terpisah di `http://localhost:8080`.

5.  **Jalankan Frontend Server Development:**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### Menghubungkan ke Backend

Untuk mengubah alamat API tujuan (antara lokal dan produksi), cukup ubah nilai `NEXT_PUBLIC_API_URL` di file `.env.local` Anda tanpa perlu mengubah kode JavaScript/TypeScript.

- **Untuk Development:** `NEXT_PUBLIC_API_URL=http://localhost:8080`
- **Untuk Produksi:** `NEXT_PUBLIC_API_URL=https://alamat-api-fly-io-anda.fly.dev`

---

## Berkontribusi (Contributing)

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Lisensi (License)

[MIT](https://choosealicense.com/licenses/mit/)
