---
title: "Cài C/C++ trên VS Code"
name_en: "C/C++ Development Setup"
id: "cpp-setup"
weight: 3
category: "development"
price: 39000
duration: "45–60 phút"
image: "/img/cpp-setup.svg"
icon: "⚙️"
short: "Cài trình biên dịch GCC/G++, cấu hình VS Code và biên dịch chương trình đầu tiên."
tags: ["c", "c++", "gcc", "g++", "compiler", "mingw", "vscode", "cpp setup"]
inpack: true
cases:
  - symptom: "Terminal báo lỗi 'g++ is not recognized as an internal or external command'"
    action: "Cài đặt bộ công cụ MinGW-w64 và thêm đường dẫn thư mục bin vào biến môi trường hệ thống"
    result: "Lệnh g++ --version và gcc --version thực thi thành công từ bất kỳ thư mục nào"
  - symptom: "Bấm nút Run trong VS Code nhưng file code C++ không chạy được"
    action: "Cài extension C/C++ của Microsoft, cấu hình tasks.json và launch.json cho project"
    result: "Biên dịch và chạy file hello.cpp chỉ với 1 phím tắt, terminal hiển thị kết quả chuẩn"
---

### Trường hợp phù hợp
- Sinh viên năm nhất hoặc mới bắt đầu môn Nhập môn lập trình, Kỹ thuật lập trình.
- Terminal báo lỗi `g++ is not recognized` hoặc không tìm thấy trình biên dịch.
- VS Code không thể build, chạy hoặc đặt breakpoint debug code C/C++.
- Gặp lỗi font tiếng Việt khi in chuỗi ra console Windows.

### Kết quả nghiệm thu cụ thể
- Trình biên dịch `gcc` và `g++` được cài đặt đầy đủ và thêm vào biến môi trường PATH.
- Cài đặt extension C/C++ chính thức trên VS Code.
- Cấu hình file build (`tasks.json`) giúp biên dịch nhanh bằng phím tắt.
- Biên dịch và chạy thành công một file `hello.cpp` mẫu trực tiếp trong terminal VS Code.

### Lưu ý & Phạm vi
- Dịch vụ thiết lập môi trường chuẩn trên Windows / macOS. Tụi mình không giải bài tập thay bạn, nhưng sẽ đảm bảo chiếc máy của bạn sẵn sàng để học và làm bài tập nộp cho giảng viên.
- **Hỗ trợ 7 ngày:** Kiểm tra lại miễn phí nếu phát sinh lỗi compiler trong 7 ngày sau khi cài.
