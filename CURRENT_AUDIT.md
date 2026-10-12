# CURRENT AUDIT — FixIT Student Website
**Ngày thực hiện:** 12/10/2026  
**Người thực hiện:** Senior Product Designer & Frontend Engineer  
**Mục tiêu:** Rà soát toàn bộ các trang, nội dung, luồng tương tác và mã nguồn theo tiêu chuẩn *FIXIT_STUDENT_REDESIGN_AGENT.md*.

---

## Bảng Tổng Hợp Lỗi & Điểm Cần Cải Thiện

| STT | URL / Trang | Vấn đề phát hiện | Bằng chứng từ Code / Giao diện | Độ ưu tiên | Giải pháp khắc phục | Trạng thái |
|:---:|:---|:---|:---|:---:|:---|:---:|
| 1 | `/` (Trang chủ) | Hero tuyên bố sai giá khởi điểm ("giá từ 30.000đ" trong khi dịch vụ rẻ nhất là 9.000đ) | `layouts/index.html` dòng 29: `giá sinh viên từ 30.000đ` | **P0 (Cao)** | Sửa thành `mức giá sinh viên chỉ từ 9.000đ` đồng bộ với catalog | Đang xử lý |
| 2 | `/` (Trang chủ) | Tiêu đề giật gân, viết hoa toàn bộ và ngôn ngữ quảng cáo AI khuôn mẫu | `LỖI CÔNG NGHỆ? ĐỂ FIXIT LO.`, `NỖI ÁM ẢNH CÔNG NGHỆ...` | **P1 (Cao)** | Đổi sang giọng văn tự nhiên: `Máy tính gặp lỗi? Để tụi mình xem giúp.` | Đang xử lý |
| 3 | `/` (Trang chủ) | Dùng số liệu thống kê không có nguồn/phương pháp khảo sát | `layouts/index.html` dòng 117, 129, 141: `~4.5 giờ lãng phí`, `78% sinh viên bế tắc`, `Tiết kiệm 70%` | **P0 (Cao)** | Xóa bỏ các con số vô căn cứ; thay bằng mô tả trải nghiệm thực tế | Đang xử lý |
| 4 | `/` (Trang chủ) | Tuyên bố cam kết tuyệt đối thiếu điều kiện áp dụng | `Xử lý trong ngày`, `Sửa lại 100% miễn phí`, `An tâm 100%` | **P1 (Cao)** | Chuyển thành cam kết có trách nhiệm: quy trình kiểm tra tại chỗ, điều kiện hỗ trợ 7 ngày | Đang xử lý |
| 5 | `/services/` | Tên dịch vụ toàn tiếng Anh, khó hiểu với sinh viên không học IT | `Windows Rescue`, `C/C++ Development Setup`, `Tech Consultation` | **P0 (Cao)** | Đổi nhãn chính sang tiếng Việt dễ hiểu (`Cài đặt / sửa lỗi Windows`, `Cài C/C++...`), tên tiếng Anh để phụ bên dưới | Đang xử lý |
| 6 | `/services/*` | Front matter chứa đánh giá giả lập (Fake testimonials) | `content/services/*.md`: `Bạn A, năm 1`, `Bạn B, năm 2` | **P0 (Cao)** | Xóa bỏ đánh giá bịa đặt; thay bằng tình huống xử lý mẫu (Case study / lỗi mẫu) | Đang xử lý |
| 7 | `/find-your-fix/` | Gắn mác "AI Engine Ready" dù thực chất là cây quyết định tĩnh (Rule-based) | `layouts/_default/fix.html` dòng 17: `AI Engine Ready` | **P0 (Cao)** | Đổi thành `Trợ lý tìm lỗi theo câu hỏi (Rule-based assistant)`; bổ sung hướng dẫn tự kiểm tra | Đang xử lý |
| 8 | `/student-pack/` | Khẳng định chưa xác thực ("bao trọn cả học kỳ", "dùng bất kỳ khi nào") | `layouts/_default/pack.html` dòng 118, 131: `Bao trọn cả 6 dịch vụ... trong suốt học kỳ` | **P1 (Cao)** | Nêu rõ phạm vi: hỗ trợ combo 6 dịch vụ trong buổi hẹn trực tiếp, tiết kiệm 55.000đ (27%) | Đang xử lý |
| 9 | `/about/` | Xuất hiện placeholder `Thành viên A-E` và `TODO: điền tên thật` ngoài public | `content/about.md` dòng 5-9: `TODO: điền tên thật và 1 câu giới thiệu.` | **P0 (Cao)** | Xóa placeholder; thay bằng phân công 5 mảng chuyên trách trong đồ án môn học | Đang xử lý |
| 10 | `/contact/` | Khẳng định đặt lịch thành công trong khi form chưa có backend | `layouts/_default/contact.html` dòng 160: `Đã ghi nhận yêu cầu hỗ trợ!` | **P1 (Cao)** | Nêu rõ thông báo demo đồ án, handoff trực tiếp sang nhắn tin Zalo/Email | Đang xử lý |
| 11 | `/cart/` | Mô phỏng thanh toán trực tuyến dễ gây hiểu nhầm | Mã QR ngân hàng và MoMo vẽ giả lập | **P1 (Cao)** | Làm rõ thông báo giả lập phục vụ báo cáo đồ án, nhắc nhở an toàn dữ liệu và quyền riêng tư | Đang xử lý |
| 12 | Toàn trang | Thiết kế giao diện cần tinh chỉnh theo phong cách "Student Tech Studio" | Tránh lạm dụng gradient tím xanh hay hiệu ứng kính mờ quá nặng | **P2 (Vừa)** | Tinh chỉnh visual tokens: tương phản cao, typography phân cấp rõ, thân thiện với mobile | Đang xử lý |
