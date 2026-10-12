---
title: "Cài Git & kết nối GitHub"
name_en: "Git & GitHub Setup"
id: "git-github"
weight: 4
category: "development"
price: 19000
duration: "20–30 phút"
image: "/img/git-github.svg"
icon: "🌿"
short: "Cấu hình Git, kết nối SSH với GitHub và hướng dẫn các thao tác làm việc nhóm cơ bản."
tags: ["git", "github", "ssh", "commit", "push", "branch", "pull request", "git setup"]
inpack: true
cases:
  - symptom: "Gõ git push thì báo lỗi 'Permission to ... denied to user' hoặc yêu cầu mật khẩu liên tục"
    action: "Tạo cặp SSH Key ed25519, thêm Public Key vào tài khoản GitHub và kiểm tra kết nối qua terminal"
    result: "Kết nối thành công bằng lệnh ssh -T git@github.com, đẩy code mượt mà không cần gõ lại mật khẩu"
  - symptom: "Mới vào nhóm đồ án, không biết cách lấy code về và tạo branch riêng"
    action: "Hướng dẫn thực hành các lệnh git clone, git checkout -b, commit và tạo Pull Request đầu tiên"
    result: "Nắm vững quy trình làm việc nhóm an toàn, tránh đè code hay gây xung đột (conflict)"
---

### Trường hợp phù hợp
- Lần đầu học môn Công nghệ phần mềm, Đồ án cơ sở hoặc làm việc nhóm qua GitHub.
- Gặp lỗi xác thực tài khoản khi push code (`Permission denied`, `fatal: Authentication failed`).
- Chưa biết cách thiết lập SSH Key hoặc Personal Access Token trên máy tính cá nhân.
- Muốn hiểu rõ quy trình làm việc nhóm an toàn để không vô tình ghi đè bài của bạn bè.

### Kết quả nghiệm thu cụ thể
- Git được cài đặt và cấu hình đúng tên (`user.name`) và email trường (`user.email`).
- Kết nối bảo mật thành công với GitHub bằng SSH Key (hoặc GitHub Desktop / VS Code Auth).
- Thực hiện thành công chuỗi thao tác: tạo repo mẫu → `git commit` → `git push` lên GitHub cá nhân của bạn.
- Nhận bảng tóm tắt 8 câu lệnh Git thiết yếu nhất để bạn tra cứu khi làm đồ án.

### Bảo mật tài khoản
- Bạn tự đăng nhập tài khoản GitHub trên trình duyệt của bạn; kỹ thuật viên không bao giờ hỏi mật khẩu tài khoản.
- **Hỗ trợ 7 ngày:** Giải đáp và hỗ trợ xử lý lại nếu phát sinh lỗi quyền truy cập hoặc đẩy code trong tuần đầu.
