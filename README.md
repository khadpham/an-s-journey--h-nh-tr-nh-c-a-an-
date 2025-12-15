# Hành Trình Của An (An's Journey) - Web App Edition 🕰️

> **Version:** 58.0.0
> **Status:** Stable / Production Ready

## 📖 Giới Thiệu

**Hành Trình Của An** là một ứng dụng web game giải đố nhập vai (Puzzle Logic RPG) được chuyển đổi từ phiên bản HTML5 nguyên khối sang kiến trúc **React + TypeScript** hiện đại.

Trò chơi đưa người chơi vào vai An, một thợ đồng hồ trẻ tuổi, trên hành trình giải cứu cha khỏi Hắc Pháp Sư Muội Than. Người chơi phải vượt qua 8 thử thách logic kinh điển (Toán học, Đồ thị, Xác suất, Tối ưu hóa) để thu thập các "Bánh Răng Thời Gian".

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

Dự án được xây dựng dựa trên các tiêu chuẩn web hiện đại, tối ưu cho hiệu năng và khả năng bảo trì:

*   **Core:** [React 18](https://react.dev/) - Thư viện UI.
*   **Language:** [TypeScript](https://www.typescriptlang.org/) - Đảm bảo tính chặt chẽ của dữ liệu (Type Safety).
*   **Build Tool:** [Vite](https://vitejs.dev/) - Tốc độ build và dev server cực nhanh.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework giúp thiết kế giao diện nhanh chóng.
*   **Deployment:** [Firebase Hosting](https://firebase.google.com/) - Nền tảng hosting tốc độ cao của Google.
*   **State Management:** React Context API (Quản lý trạng thái game toàn cục).
*   **PWA:** Hỗ trợ cài đặt như ứng dụng (Service Worker + Manifest).

## 📂 Cấu Trúc Dự Án

Dự án được tổ chức theo mô hình **Feature-based**, giúp dễ dàng mở rộng và quản lý code:

```
/
├── public/                 # Tài sản tĩnh (Manifest, Icons, sw.js)
├── components/             # Các thành phần UI dùng chung
│   └── layout/             # Layout chính (Sidebar, HeaderMobile)
├── config/                 # Cấu hình tĩnh (Cốt truyện, Items, Rules)
├── context/                # Quản lý State (GameContext)
├── features/               # Logic chính của các màn chơi
│   └── games/
│       ├── balls/          # Chương 8: Cân Bóng (Decision Tree)
│       ├── cat/            # Chương 5: Mèo lượng tử (Parity Check)
│       ├── graph/          # Chương 3: Đồ thị Euler
│       ├── horses/         # Chương 7: Đua Ngựa (Transitive Property)
│       ├── jugs/           # Chương 2: Đong Nước (Math)
│       ├── river/          # Chương 4: Qua Sông (Optimization)
│       ├── spider/         # Chương 6: Bắt Nhện (Graph Theory)
│       └── switches/       # Chương 1: Công tắc điện (Physics/Logic)
├── types/                  # Định nghĩa TypeScript Interface
├── App.tsx                 # Entry point của ứng dụng
├── index.html              # HTML gốc
└── ...config files         # (vite.config.ts, tailwind.config.js, etc.)
```

## 🎮 Tính Năng Nổi Bật

1.  **Hệ Thống Lưu Trữ (Save System):** Tự động lưu tiến trình, vật phẩm và trạng thái vào `localStorage`. Người chơi không mất dữ liệu khi tải lại trang.
2.  **Responsive Design:** Tối ưu hóa hoàn hảo cho cả Desktop (Sidebar) và Mobile (Header rút gọn, Layout dọc/ngang).
3.  **Hệ Thống Gợi Ý (Companion System):**
    *   🐕 **Chó Vàng:** Gợi ý dựa trên trực giác/mùi (Cơ bản).
    *   🐻 **Giáo Sư Gấu:** Gợi ý về chiến thuật/logic (Nâng cao).
    *   🤖 **Robo Tin-Tin:** Tính toán xác suất và số liệu (Toán học).
4.  **Kho Đồ (Inventory):** Thu thập và sử dụng vật phẩm (Kính lúp, Nam châm) để tác động vào game.

## 🛠️ Cài Đặt & Chạy Local

Để chạy dự án trên máy cá nhân, bạn cần cài đặt [Node.js](https://nodejs.org/).

1.  **Clone dự án:**
    ```bash
    git clone https://github.com/username/ans-journey.git
    cd ans-journey
    ```

2.  **Cài đặt thư viện:**
    ```bash
    npm install
    ```

3.  **Chạy môi trường phát triển (Dev):**
    ```bash
    npm run dev
    ```
    Truy cập `http://localhost:5173` để xem ứng dụng.

## 📦 Build & Deploy (Firebase)

Dự án đã được cấu hình sẵn cho Firebase Hosting.

1.  **Build production:**
    Lệnh này sẽ biên dịch TypeScript và tạo thư mục `dist`.
    ```bash
    npm run build
    ```

2.  **Deploy lên Firebase:**
    Đảm bảo bạn đã cài đặt Firebase CLI (`npm install -g firebase-tools`) và đã đăng nhập (`firebase login`).
    ```bash
    npm run deploy
    # Hoặc: firebase deploy
    ```

## 🧩 Danh Sách Mini-Games & Logic

| Chương | Tên Game | Loại Logic | Mô tả |
| :--- | :--- | :--- | :--- |
| **1** | Switches | Vật lý/Logic | Tìm bóng đèn tương ứng dựa trên nhiệt độ. |
| **2** | Jugs | Toán học | Đong chính xác 4L nước từ bình 8L, 5L, 3L. |
| **3** | Graph | Đồ thị Euler | Vẽ một nét đi qua tất cả các cạnh đồ thị. |
| **4** | River | Tối ưu hóa | Đưa 5 người qua cầu với thời gian tối ưu. |
| **5** | Cat | Tính Chẵn/Lẻ | Tìm vị trí ẩn nấp dựa trên quy luật di chuyển. |
| **6** | Spider | Lý thuyết Đồ thị | Vây bắt mục tiêu trên mạng lưới các điểm nút. |
| **7** | Horses | Tính bắc cầu | Tìm Top 3 nhanh nhất không cần đồng hồ bấm giờ. |
| **8** | Balls | Cây quyết định | Tìm bóng giả trong 12 quả chỉ với 3 lần cân. |

## 👨‍💻 Tác Giả

*   **Concept & Logic:** Dan (Data Scientist)
*   **Development:** AI Assistant & Dan
*   **Design Style:** Dark Mode / Minimalist / Inter & Merriweather Fonts.

---
*Dự án được phát triển với mục đích giáo dục và giải trí, rèn luyện tư duy logic.*
