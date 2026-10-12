# CONTENT GUIDE — FixIT Student UX Writing System

## 1. Định Vị Thương Hiệu & Giọng Văn (Voice & Tone)

### 1.1. Brand Persona: “Người Bạn IT Cùng Khóa”
* **Ai là FixIT?** Một người bạn sinh viên IT cùng trường: hiểu bạn đang vướng ở đâu, nói tiếng Việt bình dị, giải thích nguyên nhân rõ ràng và có trách nhiệm với chiếc máy tính bạn gửi gắm.
* **Không phải là:** Một công ty công nghệ đa quốc gia, một trung tâm sửa chữa lớn hay một ứng dụng tự xưng “AI thông minh nhân tạo”.

### 1.2. Nguyên Tắc Viết (Writing Principles)
1. **Xưng hô nhất quán:** Dùng **“bạn”** và **“tụi mình”** (hoặc “chúng mình” trong ngữ cảnh học thuật).
2. **Cụ thể hơn trừu tượng:** Nêu rõ tên công cụ, câu lệnh kiểm tra và kết quả nhìn thấy được (ví dụ: *“Chạy thử file `main.py` không báo lỗi”* thay vì *“triển khai giải pháp toàn diện”*).
3. **Trung thực về năng lực:** Không hứa giải quyết mọi lỗi, không cam kết thời gian “lấy liền trong tích tắc”, không phóng đại tỷ lệ thành công.
4. **Không viết hoa toàn bộ tiêu đề (No ALL-CAPS):** Viết hoa chữ cái đầu câu theo quy chuẩn tiếng Việt, giữ sự điềm tĩnh và tôn trọng người đọc.
5. **Hạn chế emoji và dấu chấm than:** Chỉ dùng emoji khi có chức năng chỉ dẫn (icon trực quan), không dùng trang trí tràn lan.

---

## 2. Bảng Đối Chiếu Thuật Ngữ (Term Dictionary)

| Cụm từ cần tránh (Marketing Cliché) | Cụm từ thay thế (Student Tech Tone) | Lý do |
|:---|:---|:---|
| LỖI CÔNG NGHỆ? ĐỂ FIXIT LO. | Máy tính gặp lỗi? Để tụi mình xem giúp. | Khiêm tốn, gần gũi, không hứa trước khi thấy máy |
| NỖI ÁM ẢNH CÔNG NGHỆ CỦA SINH VIÊN | Mấy lỗi thường gặp khi học và làm bài | Tự nhiên, đúng ngữ cảnh sinh viên |
| QUY TRÌNH TINH GỌN | Tụi mình hỗ trợ như thế nào? | Trực tiếp trả lời câu hỏi của bạn |
| 8 DỊCH VỤ CÔNG NGHỆ CHUYÊN BIỆT | Chọn việc bạn cần hỗ trợ | Hướng tới hành động của người dùng |
| GÓI COMBO ĐẶC QUYỀN | Cần cài nhiều thứ cùng lúc? | Gợi mở nhu cầu thực tế |
| HỆ THỐNG CHẨN ĐOÁN THÔNG MINH / AI Engine Ready | Trợ lý tìm lỗi theo câu hỏi | Đúng bản chất rule-based decision tree |
| ĐỪNG ĐỂ LỖI VẶT LÀM CHẬM TIẾN ĐỘ ĐỒ ÁN! | Có lỗi chưa xử lý được? Gửi tụi mình xem thử. | Điềm tĩnh, không tạo áp lực hoảng sợ |
| Giải pháp toàn diện / Đột phá / Ưu việt | Bộ công cụ / Cách xử lý phù hợp | Tránh sáo rỗng |
| Sửa lại 100% miễn phí / An tâm 100% | Hỗ trợ kiểm tra lại trong 7 ngày | Cam kết minh bạch, có điều kiện rõ ràng |

---

## 3. Tiêu Chuẩn Nút Bấm & Lời Kêu Gọi Hành Động (CTA Standards)

* **Nút chính (Primary CTA):**
  * `Mô tả lỗi của bạn` (điều hướng đến Find Your Fix)
  * `Xem 8 dịch vụ & bảng giá` (điều hướng đến Services)
  * `Thêm vào giỏ` / `Đặt lịch hẹn thử nghiệm` (rõ hành động)
* **Nút phụ (Secondary CTA):**
  * `← Quay lại bước trước` (trong cây câu hỏi)
  * `Xem chi tiết cách xử lý →` (trên thẻ dịch vụ)
  * `Làm lại từ đầu` (khi cần reset bộ lọc)

---

## 4. Microcopy & Trạng Thái Giao Diện (States & Feedback)

* **Trạng thái rỗng (Empty state):**
  * *Tìm kiếm không ra kết quả:* “Không tìm thấy dịch vụ nào khớp với từ khóa của bạn. Thử tìm bằng tên công cụ (Python, Git, Windows, VS Code) hoặc mô tả lỗi qua công cụ tìm lỗi nhé.”
  * *Giỏ hàng trống:* “Giỏ hàng của bạn đang trống. Chọn một dịch vụ bạn cần hỗ trợ để tiếp tục.”
* **Trạng thái cảnh báo an toàn dữ liệu:**
  * *Cài lại Windows / Format ổ đĩa:* “⚠️ Lưu ý quan trọng: Vui lòng sao lưu bài tập và dữ liệu quan trọng trước khi cài lại hệ điều hành. Kỹ thuật viên sẽ kiểm tra cùng bạn trước khi thao tác.”
* **Trạng thái demo đồ án:**
  * “Đây là sản phẩm học tập mô phỏng trong học phần Đồ án 1 (CSC00006). Toàn bộ dữ liệu giỏ hàng và đặt lịch là thử nghiệm phục vụ báo cáo môn học.”
