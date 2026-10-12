# FIXIT STUDENT — COMPLETE PRODUCT & CONTENT REDESIGN BRIEF

> **Vai trò:** Bạn là Senior Product Designer, UX Writer, Frontend Engineer và QA Lead. Nhiệm vụ là **audit và cải tiến trực tiếp repository hiện tại** của FixIT Student, không xây dựng một demo rời rạc. Website tham chiếu: https://fixit-student.pages.dev/. Đây là website dịch vụ công nghệ hướng tới sinh viên, đồng thời là đồ án môn học. Tôn trọng stack hiện có (trang About ghi Hugo), nội dung và các luồng đang hoạt động.
>
> **Mục tiêu quan trọng nhất:** Chuyển từ một trang bán hàng có ngôn ngữ AI/marketing khuôn mẫu sang một **dịch vụ sinh viên thật: rõ ràng, đáng tin, thân thiện, thiết kế đẹp và dùng được**. Không tối ưu vẻ ngoài bằng cách hi sinh tính trung thực.

## 0. CÁCH LÀM VIỆC BẮT BUỘC

Trước khi code, khám phá toàn bộ repository, xác định cấu trúc Hugo, template/partials, CSS, JS, data files, cấu hình Cloudflare Pages, các trang và hành vi hiện hữu. Lập bảng audit `CURRENT_AUDIT.md` ghi rõ **URL → vấn đề → bằng chứng từ code hoặc browser → độ ưu tiên → cách sửa → trạng thái**. Dùng browser có khả năng render JavaScript để xem và thử nghiệm nếu môi trường cho phép; nếu không có browser, đọc code và kiểm tra bằng static build, tuyệt đối không khẳng định đã test những gì chưa test. Chụp ảnh desktop/mobile trước và sau nếu có công cụ.

Triển khai theo từng nhóm thay đổi nhỏ, có thể review và rollback. **Không xóa chức năng, sửa giá, thay đổi bảo hành, bịa thông tin liên hệ hoặc tự ý biến đồ án thành dịch vụ đang hoạt động.** Các cam kết thương mại chưa xác thực phải được đưa vào `CONTENT_TO_VERIFY.md` và hiển thị theo chính sách được nhóm phê duyệt. Giữ khả năng bảo trì để thành viên nhóm có thể sửa text, giá, dịch vụ, hình ảnh mà không đụng sâu tới UI.

## 1. NHỮNG PHÁT HIỆN CỤ THỂ TỪ WEBSITE LIVE (12/10/2026)

1. Home đang có hero **“LỖI CÔNG NGHỆ? ĐỂ FIXIT LO.”**, lời giới thiệu dài và terminal mockup `ModuleNotFoundError: No module named 'numpy'`. Terminal là nét riêng tốt, nên giữ nhưng tinh giản để không biến thành một hiệu ứng trang trí rối mắt.
2. Trang chủ hiện có quá nhiều header section kiểu quảng cáo và viết hoa: **“NỖI ÁM ẢNH CÔNG NGHỆ CỦA SINH VIÊN”**, **“4 BƯỚC KHẮC PHỤC NHANH CHÓNG”**, **“GÓI COMBO ĐẶC QUYỀN”**, **“TRỌN BỘ 6 GIẢI PHÁP THIẾT YẾU”**. Hãy thay bằng ngôn ngữ đời thường.
3. Mục vấn đề dùng các con số **“~4.5 giờ lãng phí mỗi đồ án”**, **“78% sinh viên bế tắc”**, **“tiết kiệm tới 70%”** mà chưa trình bày bằng chứng. **Xóa hoặc chỉ khôi phục khi có nguồn số liệu, phạm vi khảo sát và phương pháp đo.**
4. Hero nêu “giá từ 30.000đ”, nhưng danh mục có dịch vụ 9.000đ; danh mục lại nói “giá từ 9.000đ”. Đồng bộ tất cả giá khởi điểm từ cùng dữ liệu; không hardcode nhiều nơi.
5. FAQ ghi có hỗ trợ trực tiếp và từ xa, trong khi một số nội dung mang tính tuyệt đối như “lấy liền”, “không giữ máy”, “xử lý trong ngày”, “bảo hành 7 ngày”, “sửa lại 100% miễn phí”, “an tâm 100%”. Cần định nghĩa **điều kiện áp dụng** và các ngoại lệ.
6. Trang Services hiện có **8 dịch vụ**, nhưng nhiều tên tiếng Anh khó hiểu với người không học IT. Hiển thị tên tiếng Việt dễ hiểu trước; tên kỹ thuật tiếng Anh có thể đặt bên dưới.
7. Trang Find Your Fix có flow **3 bước** theo phần HTML đọc được, nhưng hành vi JavaScript chưa được xác minh. Phải test tương tác thật; đừng quảng cáo là “AI Engine” nếu thực tế chỉ là một rule-based decision tree.
8. Student Pack hiện là **149.000đ**, tổng giá lẻ **204.000đ**, tiết kiệm **55.000đ ≈ 27%** (đúng phép tính tại thời điểm audit). Tuy nhiên, có câu “bao trọn ... trong suốt học kỳ” và “đặt lịch từng dịch vụ khi cần”; cần làm rõ là **mỗi dịch vụ một lần hay sử dụng không giới hạn**. Chưa xác thực thì không được tự quyết.
9. About tự giới thiệu là đồ án môn **Giới thiệu ngành Trí tuệ Nhân tạo (CSC00006)** tại HCMUS; phần đội ngũ hiển thị **Thành viên A–E** và **TODO: điền tên thật**. Phải xóa placeholder khỏi trang public, hoặc chỉ xuất bản hồ sơ sau khi nhận đủ thông tin và sự đồng ý của thành viên.
10. Trang contact, giỏ hàng, biểu mẫu, điều hướng responsive, hình ảnh và performance cần kiểm thử bổ sung trong trình duyệt. Không suy đoán chúng đang hoạt động hay bị lỗi chỉ từ HTML crawl.

## 2. ĐỊNH VỊ THƯƠNG HIỆU & GIỌNG VĂN

**Brand idea:** “Bạn gặp lỗi máy tính. Có người cùng trường giúp bạn xử lý.” FixIT nên mang tính cách **một bạn sinh viên IT hiểu vấn đề, giải thích rõ ràng, làm việc có trách nhiệm**, không phải tập đoàn công nghệ hoặc dịch vụ sửa chữa thần tốc.

**Tone of voice:** tự nhiên, gần gũi, có năng lực, hơi trẻ trung nhưng không suồng sã. Dùng “bạn” và “tụi mình/chúng mình” nhất quán sau khi chọn một cách xưng hô cho toàn site. Ưu tiên tên lỗi và kết quả có thể kiểm chứng: “Cài Python và chạy thử một file `.py`” tốt hơn “triển khai giải pháp lập trình toàn diện”. Không viết hoa toàn bộ tiêu đề trừ logo/acronym. Hạn chế dấu chấm than, emoji và tính từ cường điệu.

**Các kiểu diễn đạt phải loại bỏ:** “giải pháp toàn diện”, “nâng tầm trải nghiệm”, “đồng hành cùng hành trình”, “sứ mệnh”, “đột phá”, “ưu việt”, “tối ưu nhất”, “đặc quyền”, “không bao giờ”, “100%”, “chẩn đoán chuẩn xác”, “nhanh chóng - tiện lợi - chuyên nghiệp” nếu chỉ là khẩu hiệu. Không thay chúng bằng một bộ cliché khác. Không bịa feedback, ảnh khách hàng, lượt sử dụng hoặc tỷ lệ thành công.

**Phương pháp viết lại:** Với mỗi đoạn text, tự hỏi: người xem đang mắc vấn đề gì? Họ muốn làm gì tiếp theo? Mình có thể cam kết chính xác điều gì? Hãy viết một phiên bản ngắn, một phiên bản tự nhiên, sau đó chọn câu dễ hiểu nhất khi đọc thành tiếng. Tên button phải mô tả hành động thật, tránh CTA trừu tượng.

### Bảng thay thế copy ưu tiên

| Hiện tại | Đề xuất | Lý do |
|---|---|---|
| LỖI CÔNG NGHỆ? ĐỂ FIXIT LO. | **Máy tính gặp lỗi? Để tụi mình xem giúp.** | Gần gũi hơn, không hứa giải quyết mọi lỗi |
| Không cần biết lỗi tên gì... chẩn đoán và khắc phục tận tay | **Không biết máy bị gì cũng không sao. Bạn mô tả tình trạng, tụi mình kiểm tra và báo cách xử lý trước.** | Diễn đạt quy trình có trách nhiệm |
| NỖI ÁM ẢNH CÔNG NGHỆ CỦA SINH VIÊN | **Mấy lỗi thường gặp khi học và làm bài** | Tự nhiên, đúng ngữ cảnh |
| Kẹt Hàng Giờ Cài Môi Trường | **Cài Python mãi vẫn lỗi?** | Nêu tình huống cụ thể |
| Không Biết Lỗi Tên Gì Để Tra | **Máy báo lỗi mà không biết bắt đầu từ đâu** | Dễ đồng cảm, không cường điệu |
| Tiệm Ngoài Tính Giá Quá Cao | **Muốn biết chi phí trước khi sửa** | Không công kích bên thứ ba hoặc bịa giá thị trường |
| QUY TRÌNH TINH GỌN | **Tụi mình hỗ trợ như thế nào?** | Trả lời câu hỏi thực |
| 8 DỊCH VỤ CÔNG NGHỆ CHUYÊN BIỆT | **Chọn việc bạn cần hỗ trợ** | Action-oriented |
| GÓI COMBO ĐẶC QUYỀN | **Cần cài nhiều thứ một lúc?** | Giới thiệu combo hợp ngữ cảnh |
| Sứ mệnh của FixIT | **Vì sao tụi mình làm FixIT?** | Giọng người thật |
| HỆ THỐNG CHẨN ĐOÁN THÔNG MINH / AI Engine Ready | **Không biết chọn dịch vụ nào?** | Không giả định có AI thực |
| Nghiệm thu & Bảo hành | **Kiểm tra lại trước khi bàn giao** | Ngôn ngữ đời thường |
| ĐỪNG ĐỂ LỖI VẶT LÀM CHẬM TIẾN ĐỘ ĐỒ ÁN! | **Có lỗi chưa xử lý được? Gửi tụi mình xem thử.** | CTA rõ ràng, không giật gân |

### Copy mẫu cho hero (được điều chỉnh theo chính sách thật)

Eyebrow: `FIXIT STUDENT · HỖ TRỢ CÔNG NGHỆ CHO SINH VIÊN`

H1: `Máy tính gặp lỗi? Để tụi mình xem giúp.`

Body: `Cài Python không chạy, VS Code báo lỗi hay laptop hoạt động bất thường? Bạn cứ gửi tình trạng đang gặp. Tụi mình sẽ xem lỗi, trao đổi cách xử lý và báo giá trước khi làm.`

Primary CTA: `Mô tả lỗi của bạn`

Secondary CTA: `Xem dịch vụ & bảng giá`

Trust microcopy: `Hỗ trợ tại trường hoặc từ xa, tùy loại sự cố và lịch hẹn.` **Chỉ hiển thị nếu nhóm xác nhận đang cung cấp đúng hai hình thức này.**

### Copy mẫu cho About

`FixIT bắt đầu từ một chuyện rất quen thuộc: cài môi trường để làm bài nhưng mất cả buổi chỉ vì một lỗi nhỏ. Tụi mình là nhóm sinh viên thực hiện dự án trong môn học tại Trường ĐH Khoa học Tự nhiên. Bọn mình muốn tạo một nơi để sinh viên mô tả vấn đề, biết trước cách hỗ trợ và chi phí dự kiến. Đây là dự án môn học; tình trạng nhận yêu cầu thực tế và phạm vi phục vụ phải được ghi rõ trên website.`

Nếu chỉ là demo học phần, dùng badge rõ ràng `Dự án học phần · Chưa nhận đặt lịch thực tế` và đổi button đặt lịch thành `Xem cách hoạt động`. Nếu đã vận hành, dùng thông tin liên hệ, khung giờ và người phụ trách đã xác minh. **Không được nhập nhằng giữa demo và dịch vụ thật.**

## 3. DESIGN DIRECTION — “STUDENT TECH STUDIO”

Tạo ấn tượng của một **indie tech service / creative developer studio**: sạch, sắc nét, có cá tính công nghệ vừa đủ, không phải template SaaS với gradient tím-xanh, bóng kính và hàng loạt thẻ giống nhau. Dùng hệ thống visual có phân cấp rõ: tiêu đề chắc khỏe, body dễ đọc, price nổi bật, công cụ chẩn đoán là điểm nhấn tương tác. Giữ logo/nhận diện hiện có nếu có giá trị, không đổi thương hiệu tùy tiện.

**Đề xuất visual tokens (điều chỉnh theo brand đang có):** nền sáng ấm `#F7F7F2`, bề mặt `#FFFFFF`, chữ `#17201D`, chữ phụ `#58615C`, viền `#DEE3DD`, màu nhấn xanh `#256B4D` hoặc màu hiện hữu nếu tương thích. Chỉ một accent chính và tối đa một màu phụ cho thông tin đặc biệt. Font body hỗ trợ tiếng Việt đầy đủ, chẳng hạn `Be Vietnam Pro` hoặc `Inter`; font mono cho terminal/code như `JetBrains Mono`. Không cần nhập 3–4 họ font.

**Không đồng nhất tất cả section:** Hero có bố cục editorial 2 cột, service area là catalog, How It Works có đường dẫn đơn giản, case studies là card thực tế, FAQ dùng accordion gọn. Tránh “12 cards rounded-3xl shadow-lg” trải kín trang. Sử dụng khoảng trắng có chủ đích, nhịp điệu layout bất đối xứng nhẹ, ảnh screenshot thật khi có. Không lấy stock photo người dùng giả làm nhóm/khách hàng.

**Micro-interactions:** hover thể hiện chức năng, transition ~150–250ms, loading/error/success states, accordion có keyboard access, sticky navbar nhẹ, reveal animation cực kỳ tiết chế. `prefers-reduced-motion` phải được tôn trọng. Chỉ tạo hiệu ứng code terminal khi không làm chậm tải trang và có nội dung ý nghĩa. Không dùng parallax nặng, cursor giả, scroll-jacking hoặc autoplay âm thanh.

**Responsive:** thiết kế mobile-first 360/390/430px rồi lên tablet và desktop 1280/1440px. Không ép 2 cột trên màn nhỏ. Button chính rộng và dễ nhấn, drawer menu có focus management, navigation hợp lý khi JS tắt trong khả năng của Hugo.

## 4. THIẾT KẾ LẠI TỪNG TRANG

### 4.1 HOME — trang bán dịch vụ, không phải brochure 10 chương

Thứ tự đề xuất: header → hero → nhóm vấn đề thường gặp → dịch vụ phổ biến → quy trình 3 bước → ví dụ lỗi cụ thể → Student Pack (nếu áp dụng) → niềm tin/chính sách → FAQ ngắn → CTA cuối/footer. Gộp các phần trùng lặp, giảm đoạn giải thích dài, không cần liệt kê lại toàn bộ 8 dịch vụ nếu Services có catalog đầy đủ.

Hero desktop chia 55/45. Trái: eyebrow nhỏ, H1 một ý, mô tả 2 câu, 2 CTA. Phải: **mini visual có chức năng** mô phỏng một lỗi thường gặp như terminal Python thiếu module. Ví dụ chuyển trạng thái `Lỗi đang gặp → Kiểm tra → Cách khắc phục → Chạy lại thành công`; giải thích rằng đây chỉ là minh họa, không giả lập máy đã được chẩn đoán thật. Tránh animation vô hạn và tiếng gõ chữ kéo dài.

Nhóm vấn đề có 3 entry point: `Cài công cụ lập trình`, `Máy tính hoạt động bất thường`, `Không rõ lỗi gì`. Mỗi thẻ đi đến filter hay bước chẩn đoán đúng chủ đề. Nếu có dữ liệu thật, bổ sung 1–2 case study với lỗi đầu vào, cách xử lý, kết quả kiểm tra và thời gian thực tế; không bịa review.

### 4.2 SERVICES — catalog thân thiện

Giữ 8 dịch vụ và giá hiện tại trừ khi nhóm đã phê duyệt sửa. Đổi nhãn chính thành tiếng Việt, nhãn kỹ thuật là subtitle:

- `Cài đặt / sửa lỗi Windows` — Windows Rescue — 79.000đ
- `Cài Python & môi trường chạy code` — Python Environment Setup — 29.000đ
- `Cài C/C++ trên VS Code` — C/C++ Development Setup — 39.000đ
- `Cài Git & kết nối GitHub` — Git & GitHub Setup — 19.000đ
- `Thiết lập VS Code` — VS Code Setup — 9.000đ
- `Kiểm tra tình trạng laptop` — Laptop Health Check — 49.000đ
- `Sao lưu dữ liệu học tập` — Data Backup — 59.000đ
- `Tư vấn công cụ / cấu hình học tập` — Tech Consultation — 99.000đ

Mỗi card cần: tên, một vấn đề được giải quyết, 2–3 đầu ra cụ thể, giá, thời lượng **tham khảo** nếu đã xác minh, CTA `Xem chi tiết` và `Chọn dịch vụ`. Bộ lọc theo việc sinh viên đang cần làm thay vì chỉ phân loại `Software/Development/Hardware`; có ô tìm theo `Python`, `PATH`, `compiler`, `máy chậm` với trạng thái không có kết quả và nút xóa bộ lọc. Giỏ hàng phải phản ánh đúng giá khi kết hợp dịch vụ.

**Hạn chế phạm vi:** Không khẳng định sửa phần cứng nếu thực chất chỉ kiểm tra phần mềm/hiệu năng. Không hứa cứu dữ liệu tuyệt đối, nhất là ổ hỏng. Nêu yêu cầu backup và phương án xử lý trước can thiệp có rủi ro.

### 4.3 SERVICE DETAIL — giúp người xem quyết định

Mỗi trang dịch vụ trình bày theo thứ tự: trường hợp phù hợp; FixIT sẽ làm gì; kết quả nghiệm thu cụ thể; giá và phụ phí (nếu có); thời gian ước lượng; trường hợp không nhận xử lý; chuẩn bị trước khi gặp; điều kiện bảo hành; CTA. Với Python: thành công khi `python --version`, `pip --version`, import package mẫu và chạy một file `.py` hoạt động trong môi trường mục tiêu. Với C/C++: biên dịch/chạy thành công project mẫu. Không nói `chạy được mọi project`.

### 4.4 FIND YOUR FIX — flagship interactive feature

Giữ flow ba bước nhưng làm thành công cụ hỏi đáp **rule-based troubleshooting assistant** minh bạch. Bước 1 chọn vấn đề (`Cài môi trường`, `Windows/máy chậm`, `Git/GitHub`, `Không rõ`). Bước 2 hỏi 1–3 câu tùy nhánh, có ví dụ mô tả lỗi và nút `Quay lại`. Bước 3 trả về `Có thể bạn cần...`, mức độ phù hợp, **lý do gợi ý** và các bước tự kiểm tra miễn phí. Không tuyên bố chẩn đoán chính xác hoặc dùng AI thật nếu không tích hợp model.

Các trạng thái bắt buộc: chưa chọn, đang chọn, back/next, không khớp rule, thiếu dữ liệu, lỗi không hỗ trợ, có đề xuất 1 dịch vụ, nhiều đề xuất, người dùng có thể sửa câu trả lời, reset, thêm vào giỏ, liên hệ thủ công. Persist state qua reload nếu hợp lý; không thu thập nội dung nhạy cảm ngoài nhu cầu. Lưu rule và services trong data file, không hardcode trong component.

**Luồng thử nghiệm:** `VS Code báo không tìm thấy Python interpreter` → nhánh Python → hỏi Python đã cài chưa → `Chưa chắc` → gợi ý kiểm tra `python --version` và dịch vụ cài Python. `git push` báo permission denied → Git/GitHub → gợi ý kiểm tra remote/SSH → dịch vụ Git. `Máy không lên nguồn` → không hứa sửa ngay; chuyển hướng `cần kiểm tra trực tiếp/đơn vị chuyên môn`.

### 4.5 STUDENT PACK — clarity trước conversion

Hiển thị rõ sáu dịch vụ đang được gộp (29k + 39k + 19k + 9k + 49k + 59k = 204k), giá combo 149k và tiết kiệm 55k **nếu tất cả giá còn chính xác**. Xóa các khẳng định chưa xác thực như `bao trọn cả học kỳ`, `đặt lịch bất kỳ khi nào`, `không giới hạn` cho đến khi có điều khoản cụ thể. Nêu phạm vi sử dụng: số lần, thời gian, địa điểm, đầu ra, có cần đặt lịch, trường hợp không áp dụng. Dùng một bảng so sánh tối giản thay vì nhiều ribbon/sticker giảm giá.

### 4.6 ABOUT — minh bạch và thật

Giữ câu chuyện xuất phát từ vấn đề cài môi trường, nhưng rút còn 1–2 đoạn. Thông báo rõ dự án học phần hay hoạt động thương mại thực tế. Không dùng các hồ sơ `Thành viên A...E`/`TODO` ngoài public. Nếu có tên thật, vai trò và ảnh đã được đồng ý, thiết kế cards vừa đủ. Nếu chưa, thay bằng sơ đồ đóng góp nhóm không nêu tên/ảnh và ghi rõ thông tin đang cập nhật hoặc ẩn hẳn section. Không làm avatar AI giả người thật.

### 4.7 CONTACT & CART / BOOKING — làm cho luồng thực sự hoàn chỉnh

Trên Contact hiển thị kênh liên hệ đã được xác minh (Zalo/email/mạng xã hội), lịch hỗ trợ thực, điểm hẹn thực và lưu ý bảo vệ dữ liệu. Nếu link liên hệ chưa có, tuyệt đối không tạo số điện thoại, địa chỉ hay tài khoản giả. Form ngắn: tên gọi, cách liên hệ, loại vấn đề, mô tả, thời gian mong muốn (nếu dịch vụ thật). Không bắt nhập mật khẩu, OTP hoặc thông tin tài khoản. Nếu form chưa có backend, không hiện `Đã đặt lịch thành công`; thay bằng handoff thực sự hoặc thông báo chưa hỗ trợ.

Giỏ hàng cần tính toán nhất quán, xóa/sửa được, trạng thái rỗng hữu ích, tổng tạm tính rõ, xác nhận dịch vụ và chính sách trước bước đặt lịch. **Không xử lý thanh toán online giả hoặc tạo đơn hàng thành công khi không lưu được đơn.** Kiểm tra combo và dịch vụ trùng để không thu hai lần cho cùng một quyền lợi mà không giải thích.

## 5. NIỀM TIN & AN TOÀN DỮ LIỆU

Đây là website sửa/cài máy, nên trust phải xuất phát từ quy trình thật, không phải badge trang trí. Đưa chính sách rõ ràng: kỹ thuật viên chỉ truy cập vùng cần thiết, khách hàng tự nhập mật khẩu, không yêu cầu chia sẻ OTP, xin phép trước khi xóa/cài lại hoặc thay đổi dữ liệu, nhắc backup trước thao tác rủi ro, xác nhận kết quả và tình trạng máy khi trả. **Không cam kết dữ liệu an toàn tuyệt đối.**

Bảo hành 7 ngày phải xác định: bảo hành lỗi nào, bắt đầu khi nào, phương thức liên hệ, trường hợp không áp dụng (ví dụ người dùng tự xóa/thay cấu hình; lỗi phần cứng ngoài phạm vi) và ai chịu trách nhiệm. Nếu chính sách chưa duyệt, chỉ dùng bản nháp nội bộ, không biến thành lời hứa public.

## 6. IMPLEMENTATION PLAN

**Phase 1 — Audit & content truth:** inventory routes/assets/JS; xác định source of truth cho services và prices; kiểm tra nội dung sai, placeholder, CTA chết; tạo `CURRENT_AUDIT.md`, `CONTENT_TO_VERIFY.md`. Chưa refactor toàn bộ.

**Phase 2 — UX writing & IA:** thay copy cho Home/Services/Find Your Fix/Pack/About/Contact, đặt tên tiếng Việt, thống nhất giá/chính sách; viết `CONTENT_GUIDE.md` gồm voice principles, term dictionary, button copy, microcopy/error states. Không dùng lorem ipsum hoặc testimonial giả.

**Phase 3 — Design system:** tạo/điều chỉnh tokens màu, typography, grid, spacing, radii, button, field, card, badge và focus ring; chọn light/dark nếu đang có nhưng test contrast cả hai. Giữ nhất quán giữa mọi route.

**Phase 4 — Page implementation:** lần lượt Home → Services/Detail → Find Your Fix → Student Pack → About → Contact/Cart. Mỗi trang phải có states empty/error/success thích hợp; tránh các component chỉ đẹp trên desktop.

**Phase 5 — Performance, accessibility & SEO:** semantic HTML, một H1 mỗi trang, alt text đúng nghĩa, keyboard navigation, focus visible, `aria-expanded`, nhãn form, error text gắn input, tương phản WCAG 2.2 AA, giảm motion. Tối ưu ảnh, font subset/vietnamese, tránh JS bundle không cần thiết, lazyload ảnh ngoài viewport, không lazyload hero quan trọng, cân nhắc preload LCP image/font có kiểm chứng. Metadata/title/description riêng cho mỗi route, canonical, sitemap và OpenGraph đúng, không keyword stuffing.

**Phase 6 — QA & delivery:** chạy lệnh build/test thực tế từ repo; kiểm tra ở 360/390/768/1280/1440px, light/dark, keyboard, slow connection nếu có, browser console, broken links và cart persistence. Báo cáo `REDESIGN_CHANGELOG.md` (file thay đổi, trước/sau, kiểm thử, giới hạn, quyết định còn chờ nhóm xác nhận). Không báo đã xong nếu build hoặc flow quan trọng lỗi.

## 7. ACCEPTANCE CRITERIA (ĐỦ MỚI GỌI LÀ HOÀN THÀNH)

- [ ] Tất cả nội dung public không còn `TODO`, `Thành viên A/B/C`, lorem ipsum, phần trăm không có nguồn, review giả và lời hứa tuyệt đối không được duyệt.
- [ ] Giá mở đầu, giá từng dịch vụ, giỏ hàng, so sánh Student Pack đều đọc từ dữ liệu chuẩn và thống nhất.
- [ ] Một người chưa học IT đọc tên dịch vụ và biết mình nên chọn gì; CTA đúng chức năng.
- [ ] Find Your Fix không tự nhận là AI nếu chỉ dùng rules; tất cả nhánh có fallback và hướng dẫn rõ.
- [ ] Không có booking giả thành công, lỗi console nghiêm trọng, broken links hoặc trang trắng khi tương tác.
- [ ] Hero có thông điệp rõ, visual minh họa có chủ đích; không lạm dụng scroll animation và gradient.
- [ ] Mobile dùng tốt, không overflow ngang, form và giỏ hàng thao tác bằng bàn phím được.
- [ ] Đảm bảo privacy: không yêu cầu passwords/OTP; thao tác cài lại Windows/backup có cảnh báo phù hợp.
- [ ] Mục tiêu đo trên thiết bị thực tế ở p75: LCP <=2.5s, INP <=200ms, CLS <=0.1; nếu chưa đo được phải ghi `not measured` thay vì ghi `pass`.
- [ ] Có bằng chứng chạy build và checklist QA; giữ cấu trúc Hugo/deploy đang hoạt động, không tự ý thay stack.

## 8. THAM KHẢO NGHIÊN CỨU & CẢM HỨNG

Đọc **nguyên tắc**, không sao chép nguyên giao diện hoặc copy:

1. Nielsen Norman Group — Product-Specific GenAI Needs to Write for the Web: https://www.nngroup.com/articles/genai-write-for-the-web/ — viết ngắn, có cấu trúc, không gây khó hiểu.
2. Nielsen Norman Group — Applying Writing Guidelines to Web Pages: https://www.nngroup.com/articles/applying-writing-guidelines-web-pages/ — tránh giọng văn quảng cáo thiếu khách quan.
3. Nielsen Norman Group — AI for Tone: Avoid Sounding Like a Robot: https://www.nngroup.com/videos/ai-for-tone/ — dùng tone guide và ví dụ thật để sửa văn phong.
4. Baymard — Ecommerce UX Audit: https://baymard.com/blog/ecommerce-ux-audit — kiểm tra luồng từ tìm dịch vụ đến quyết định mua.
5. Baymard — Checkout UX Guide: https://baymard.com/blog/checkout-flow-ux-optimization — chi phí rõ ràng, checkout ít ma sát.
6. Google web.dev — Web Vitals: https://web.dev/articles/vitals — đo hiệu năng thay vì đoán.
7. Gibbon Studio — The Campus Connect: https://gibbondesignstudio.com/the-campus-connect-2/ — ví dụ xây thương hiệu marketplace sinh viên có cá tính và tạo tin tưởng, chỉ tham khảo định hướng.

## 9. OUTPUT CỦA AGENT

Bắt đầu bằng audit, sau đó **sửa mã nguồn trong repo hiện tại và kiểm thử**; không dừng lại ở việc tạo mockup, đề xuất hoặc chỉ viết một `PLAN.md`. Tạo các tài liệu `CURRENT_AUDIT.md`, `CONTENT_GUIDE.md`, `CONTENT_TO_VERIFY.md`, `REDESIGN_CHANGELOG.md`. Kết thúc bằng bản tổng kết ngắn nêu: đã sửa những trang nào, luồng nào đã chạy kiểm chứng, thay đổi lớn nhất về copy/layout, điều gì chưa thể xác minh, chính sách nào nhóm phải quyết định trước khi public và kết quả build/test.

**Quy tắc cuối:** Nếu phải chọn giữa trang trông hào nhoáng và trang sinh viên thật sự tin dùng, luôn chọn trang đáng tin. **Một câu đơn giản nhưng đúng hơn mười khẩu hiệu đẹp.**
