# REDESIGN CHANGELOG — FIXIT STUDENT

Tài liệu ghi nhận toàn bộ quá trình tái thiết kế sản phẩm số FixIT Student theo các tiêu chuẩn trong `FIXIT_STUDENT_REDESIGN_AGENT.md`.

---

## 1. Tổng quan mục tiêu tái thiết kế

- **Chuyển dịch định vị thương hiệu:** Từ phong cách startup AI hào nhoáng, phóng đại sang sản phẩm hỗ trợ kỹ thuật sinh viên chân thực, đáng tin cậy ("Người bạn IT cùng khóa").
- **Loại bỏ nội dung không trung thực:**
  - Gỡ bỏ 100% đánh giá giả (reviews ảo với 5 sao tự bịa).
  - Gỡ bỏ số liệu thống kê vô căn cứ (`~4.5h`, `78%`, `70%`).
  - Gỡ bỏ cam kết tuyệt đối viển vông (`100% miễn phí`, `an tâm 100%`, `bao trọn cả học kỳ`).
  - Xóa bỏ các placeholder tạm bợ (`TODO: điền tên thật`, `Thành viên A..E`).
- **Nâng cấp trải nghiệm & Giao diện:**
  - Chuẩn hóa hệ thống tiêu đề, typography tiếng Việt tự nhiên, không lệch lề.
  - Tích hợp tên dịch vụ song ngữ (Tiếng Việt kèm thuật ngữ tiếng Anh gốc).
  - Thay thế khối review ảo bằng case study tình huống thực tế (Hiện tượng → Xử lý → Bàn giao nghiệm thu).
  - Tối ưu hóa giỏ hàng và đặt lịch hẹn giả lập, minh bạch phạm vi demo đồ án môn học.

---

## 2. Chi tiết thay đổi theo từng thành phần

### Phase 1: Kiến trúc dữ liệu & Cấu hình (`hugo.toml`, Content Markdown)
- **`hugo.toml`:**
  - Cập nhật khẩu hiệu chính: *"Máy tính gặp lỗi? Để tụi mình xem giúp."*
  - Điều chỉnh menu điều hướng sang tiếng Việt chuẩn: `Trang chủ`, `Dịch vụ & Bảng giá`, `Tìm lỗi máy tính`, `Student Pack`, `Giới thiệu`, `Liên hệ`.
  - Cập nhật thời gian hỗ trợ: `17:00 – 21:00 (Thứ 2 – Thứ 7)`.
- **`content/services/*.md` (8 dịch vụ):**
  - Đồng bộ tiêu đề tiếng Việt tự nhiên kèm `name_en` kỹ thuật:
    - `windows-rescue.md`: *Cài đặt / sửa lỗi Windows* (`Windows Rescue`)
    - `python-setup.md`: *Cài Python & môi trường chạy code* (`Python Environment Setup`)
    - `cpp-setup.md`: *Cài C/C++ trên VS Code* (`C/C++ Development Setup`)
    - `git-github.md`: *Cài Git & kết nối GitHub* (`Git & GitHub Setup`)
    - `vscode-setup.md`: *Thiết lập VS Code* (`VS Code Setup`)
    - `laptop-health.md`: *Kiểm tra tình trạng laptop* (`Laptop Health Check`)
    - `data-backup.md`: *Sao lưu dữ liệu học tập* (`Data Backup`)
    - `tech-consultation.md`: *Tư vấn công cụ / cấu hình học tập* (`Tech Consultation`)
  - Bổ sung cấu trúc `cases:` (tình huống thực tế) thay cho `reviews:`.
  - Làm rõ phạm vi bàn giao kỹ thuật cụ thể và ranh giới dịch vụ (không nhận sửa chữa phần cứng trên bo mạch tại trường).
- **`content/student-pack.md`:**
  - Định nghĩa rõ phạm vi 6 dịch vụ đính kèm.
  - Quy định giới hạn số buổi thực hiện: Tối đa 2 buổi hẹn trong kỳ, tránh hiểu nhầm "hỗ trợ không giới hạn".
- **`content/about.md`:**
  - Thay thế `Thành viên A..E` và `TODO` bằng 5 vị trí trách nhiệm chuyên môn dự án: Trưởng nhóm Kỹ thuật, Thiết kế Giao diện, Phát triển Logic, Phát triển Giỏ hàng, Nội dung & Kiểm định.
  - Minh bạch các khâu ứng dụng AI trong quá trình làm đồ án.
- **`content/find-your-fix.md`:**
  - Đổi tiêu đề thành *Tìm lỗi máy tính*, điều chỉnh mô tả gần gũi với sinh viên.

### Phase 2: Trang chủ (`layouts/index.html`)
- **Hero:**
  - Đổi tiêu đề H1 thành: *Máy tính gặp lỗi? Để tụi mình xem giúp.*
  - Thay badge "Startup công nghệ" thành *Dự án hỗ trợ kỹ thuật bởi sinh viên*.
  - Sửa lead: Đồng bộ giá sàn từ 9.000đ.
  - Sửa 3 trust pills: *⚡ Báo giá trước khi làm*, *🛡️ Hỗ trợ kiểm tra lại 7 ngày*, *☕ Gặp trực tiếp tại sảnh trường*.
- **Terminal Glass:**
  - Thêm chú thích minh bạch: *"💡 Mô phỏng tình huống lỗi thiếu thư viện Python phổ biến khi làm đồ án."*
- **Khối vấn đề sinh viên:**
  - Loại bỏ các số liệu thống kê vô căn cứ (`4.5 giờ`, `78%`, `70%`).
  - Chuyển thành 3 nỗi băn khoăn chân thực: Kẹt hàng giờ vì môi trường code, không biết lỗi tên gì để tra cứu, và ngại mang máy ra tiệm bên ngoài.
- **Pipeline 4 bước:**
  - Sửa thành: 1. Mô tả tình trạng → 2. Tư vấn & báo giá → 3. Gặp tại sảnh trường → 4. Tự test & nghiệm thu.
- **Student Pack Teaser & Final CTA:**
  - Cập nhật thông điệp giá trị thực tế, loại bỏ lời hứa suông "an tâm 100%".

### Phase 3: Chi tiết dịch vụ (`layouts/services/single.html` & `service-card.html`)
- Hiển thị song ngữ: Render `.Params.name_en` dạng technical badge dưới tiêu đề.
- Thẻ dịch vụ `service-card.html`: Tích hợp `data-name` kết hợp cả tên Việt và Anh giúp tìm kiếm nhạy bén.
- Thay thế hoàn toàn khối đánh giá 5 sao bằng khối **Trường hợp xử lý thực tế** (`case-card`).
- Điều chỉnh cam kết: *Báo giá trước khi làm*, *Hỗ trợ kiểm tra lại 7 ngày*, *Hẹn gặp trực tiếp tại sảnh*.

### Phase 4: Trợ lý tìm lỗi (`layouts/_default/fix.html`, `fix.js`, `fix-tree.json`)
- Thay thế nhãn "AI Engine Ready" thành *Trợ lý tìm lỗi theo câu hỏi (Rule-based)*.
- Tinh chỉnh câu chữ trong quiz kiểm tra sức khỏe laptop sang hướng tư vấn khách quan, cảnh báo sao lưu dữ liệu trước khi xử lý.

### Phase 5: Student Pack (`layouts/_default/pack.html`)
- Sửa badge và nội dung so sánh chi phí: Tiết kiệm 55.000đ (149k vs 204k mua lẻ).
- Giới hạn rõ phạm vi thực hiện tối đa 2 buổi hẹn trong kỳ học.

### Phase 6: Giới thiệu & Liên hệ (`about.html`, `contact.html`, `cart.html`, `cart.js`)
- **`about.html`:** Trình bày 5 vai trò kỹ thuật nghiêm túc, minh bạch đồ án môn học AI.
- **`contact.html`:**
  - Bổ sung banner thông báo bản demo đồ án môn học.
  - Bổ sung **Checklist an toàn dữ liệu & quyền riêng tư** (khách hàng ngồi cạnh, tự nhập mật khẩu, sao lưu trước khi cài lại Win).
- **`cart.html` & `cart.js`:**
  - Đổi tên thành *Danh sách dịch vụ & Hẹn lịch*.
  - Giữ nguyên cơ chế demo với mã đơn `FIX-XXXX` trong `localStorage`, cho phép theo dõi tại `/track/`.
  - Cập nhật điều khoản thanh toán: Kiểm tra máy chạy tốt mới gửi phí sinh viên, hỗ trợ kiểm tra lại 7 ngày.

### Phase 7: Hoàn thiện CSS (`static/css/main.css`)
- Bổ sung styling cho `.detail-technical-tag`, `.cases-section`, `.case-card`, `.term-note`, `.safety-list`.
- Đảm bảo độ tương phản cao, hỗ trợ cả Dark mode và Light mode, responsive trên điện thoại di động (max-width: 768px, 480px).

---

## 3. Kết quả kiểm thử & Build

- **Lệnh thực hiện:** `& "d:\fixit_student\.venv\Scripts\hugo.exe" --minify`
- **Kết quả:** Build thành công 100% trong 88ms với **0 lỗi, 0 cảnh báo**.
- **Tổng số trang tạo ra:** 21 trang tĩnh HTML hoàn chỉnh.

---

## 4. Các tài liệu bàn giao đi kèm

1. `CURRENT_AUDIT.md`: Bảng kiểm định toàn bộ các trang, vấn đề phát hiện và mức độ ưu tiên.
2. `CONTENT_GUIDE.md`: Cẩm nang văn phong, từ điển thuật ngữ, nguyên tắc CTA và microcopy.
3. `CONTENT_TO_VERIFY.md`: Danh mục các vấn đề kinh doanh, pháp lý, giá cả cần nhóm chốt trước khi triển khai thực tế.
4. `REDESIGN_CHANGELOG.md`: Nhật ký thay đổi chi tiết này.
