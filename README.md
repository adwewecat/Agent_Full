# Agent_Full 🤖

> **1 con Agent hoàn chỉnh để thực hiện các tác vụ tự động hóa trực tiếp trên máy của người dùng (User Machine)**

[![Skills](https://img.shields.io/badge/Skills-42%20Integrated-blue)](.agents/skills)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-adwewecat%2FAgent__Full-black)](https://github.com/adwewecat/Agent_Full)

---

## 📖 Giới Thiệu Tổng Quan

`Agent_Full` là dự án xây dựng một AI Agent thông minh, an toàn và đa năng, hoạt động trực tiếp trên máy tính của người dùng nhằm:
- Thực hiện và tự động hóa các tác vụ hệ thống (quản lý tệp tin, xử lý dữ liệu, chạy kịch bản, cấu hình môi trường).
- Hỗ trợ lập trình viên và người dùng giải quyết công việc hàng ngày một cách tự động, chính xác và có kiểm soát.
- Vận hành theo các chuẩn mực kỹ thuật cao nhất (Clean Code, TDD, quy trình gỡ lỗi và kiểm tra nghiêm ngặt).

---

## ⚡ Các Quy Tắc Bất Di Bất Dịch (Immutable Rules)

Dự án tuân thủ nghiêm ngặt các quy tắc phát triển sau (xem chi tiết tại [`GEMINI.md`](./GEMINI.md)):
1. **Đọc tất cả file `.md` trước khi làm**: Nắm vững ngữ cảnh toàn diện trước khi thực hiện bất kỳ thay đổi nào.
2. **Note lại trước khi làm & cập nhật sau khi xong**: Ghi chép mọi hành động vào `GEMINI.md` để đảm bảo khi cài lại Windows hoặc đổi máy, bất kỳ AI hoặc Dev nào đọc vào cũng tiếp quản ngay lập tức.
3. **Clean Code & Không code dư thừa**: Code hoàn toàn sạch sẽ, loại bỏ triệt để code chết và biến/import không sử dụng.
4. **Comment rõ ràng trong code**: Mọi chức năng, logic phức tạp đều phải được chú thích dễ hiểu.
5. **Đẩy code lên GitHub ngay lập tức**: Bất kỳ khi nào hoàn thành hoặc sửa đổi tính năng, phải commit và push ngay lên GitHub.
6. **Tuân thủ quy trình Superpowers**: Lập kế hoạch trước khi code, áp dụng TDD, review trước khi hoàn thành.

---

## 🧰 Bộ Skills Đã Tích Hợp (42 Skills)

Dự án được trang bị sẵn 42 kỹ năng chuyên sâu được đặt tại [`.agents/skills/`](./.agents/skills) kết hợp từ:

### 1. [obra/superpowers](https://github.com/obra/superpowers) (15 Skills)
- `brainstorming`: Động não và làm rõ ý tưởng trước khi code.
- `executing-plans`: Thực thi kế hoạch từng bước có kiểm soát.
- `subagent-driven-development`: Điều phối các subagents thực hiện tác vụ độc lập.
- `systematic-debugging`: Gỡ lỗi có hệ thống, truy vết nguyên nhân gốc rễ.
- `test-driven-development`: Phát triển hướng kiểm thử (TDD).
- `verification-before-completion`: Kiểm tra và xác minh kết quả trước khi kết thúc tác vụ.
- ... và nhiều kỹ năng quản lý nhánh git, code review khác.

### 2. [mattpocock/skills](https://github.com/mattpocock/skills) (27 Skills)
- *Engineering*: `ask-matt`, `code-review`, `codebase-design`, `diagnosing-bugs`, `domain-modeling`, `grill-with-docs`, `implement`, `implement-spec`, `improve-codebase-architecture`, `pr`, `prototype`, `research`, `retro`, `setup-matt-pocock-skills`, `tdd`, `to-spec`, `to-tickets`, `triage`, `wayfinder`, `wizard`.
- *Productivity*: `grill-me`, `grilling`, `handoff`, `teach`, `to-questionnaire`, `wait-what`, `writing-for-agents`.

---

## 🚀 Hướng Dẫn Cài Đặt & Sử Dụng Khi Mới Cài Lại Máy

Khi vừa cài lại Windows hoặc clone sang máy tính mới:

1. **Clone repository về máy**:
   ```powershell
   git clone https://github.com/adwewecat/Agent_Full.git "d:\LAPTRINH\Agent_Full"
   cd "d:\LAPTRINH\Agent_Full"
   ```

2. **Cấu hình Git User**:
   ```powershell
   git config user.name "adwewecat"
   git config user.email "adwewecat@users.noreply.github.com"
   ```

3. **Cài đặt plugin global trong Antigravity CLI (Tùy chọn)**:
   ```powershell
   agy plugin install https://github.com/obra/superpowers
   agy plugin install https://github.com/mattpocock/skills
   ```

4. **Đọc tài liệu trung tâm**:
   - Mở và đọc file [`GEMINI.md`](./GEMINI.md) để xem tiến độ hiện tại và danh sách các việc cần làm tiếp theo.

---

## 🗺️ Cấu Trúc Dự Án

```text
Agent_Full/
├── .agents/                    # Workspace customizations & skills
│   └── skills/                 # 42 skills chuyên sâu
├── .gitignore                  # File cấu hình lọc rác Git
├── README.md                   # Tài liệu hướng dẫn tổng quan (File này)
├── GEMINI.md                   # Nguồn chân lý dự án, quy tắc và nhật ký tiến độ
└── ...
```

---

## 📄 Bản Quyền & Giấy Phép

Phát triển bởi **adwewecat**. Mọi quyền được bảo lưu.
