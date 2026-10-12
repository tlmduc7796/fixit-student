---
title: "Cài Python & môi trường chạy code"
name_en: "Python Environment Setup"
id: "python-setup"
weight: 2
category: "development"
price: 29000
duration: "30–45 phút"
image: "/img/python-setup.svg"
icon: "🐍"
short: "Cài đặt Python, pip, môi trường ảo venv và cấu hình chạy code trong VS Code."
tags: ["python", "pip", "venv", "vscode", "môi trường", "python setup", "interpreter"]
inpack: true
cases:
  - symptom: "Gõ lệnh python trong terminal thì Windows tự mở Microsoft Store"
    action: "Tắt App Execution Alias, cài đặt Python chính thức và thiết lập biến môi trường PATH"
    result: "Chạy được python --version và pip --version trực tiếp từ PowerShell / CMD"
  - symptom: "VS Code báo 'No module named numpy' dù bạn đã gõ pip install trước đó"
    action: "Tạo môi trường ảo venv cho dự án và chọn đúng Python Interpreter trong VS Code"
    result: "Chạy file main.py chứa import numpy thành công, code gợi ý cú pháp đầy đủ"
---

### Trường hợp phù hợp
- Bạn gõ `python` trong terminal nhưng máy báo lệnh không tồn tại hoặc tự mở Microsoft Store.
- Cài đặt thư viện qua `pip install` gặp lỗi quyền, lỗi PATH hoặc báo xung đột phiên bản.
- VS Code không nhận diện được Python Interpreter, không chạy được file `.py`.
- Cần tạo môi trường ảo (`venv`) tách biệt cho từng môn học hoặc bài tập lớn.

### Kết quả nghiệm thu cụ thể
- Lệnh `python --version` và `pip --version` phản hồi đúng trong terminal.
- VS Code nhận diện chính xác Python Interpreter và cho phép chạy code bằng phím tắt hoặc nút Play.
- Tạo sẵn một virtual environment mẫu (`.venv`) kèm hướng dẫn kích hoạt.
- Chạy thử một file `.py` mẫu (in output và import package) hoạt động bình thường trên máy bạn.

### Chuẩn bị trước khi gặp
- Mang theo laptop và sạc pin.
- Nếu có danh sách thư viện cụ thể môn học yêu cầu (ví dụ: `numpy`, `pandas`, `matplotlib`), hãy chuẩn bị sẵn để tụi mình cài đặt và kiểm tra cùng bạn.
- **Hỗ trợ 7 ngày:** Giải đáp và hỗ trợ cấu hình lại nếu môi trường Python gặp trục trặc trong vòng 7 ngày sau buổi hẹn.
