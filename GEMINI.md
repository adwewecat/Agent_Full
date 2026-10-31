# 📑 GEMINI.MD — TÀI LIỆU TRUNG TÂM & QUY TẮC BẤT DI BẤT DỊCH (PROJECT BIBLE)

> **LƯU Ý QUAN TRỌNG CHO TẤT CẢ A.I (GEMINI, CLAUDE, GPT...) VÀ DEVELOPER:**
> File này là **Bộ não và Nguồn chân lý duy nhất (Single Source of Truth)** của dự án `Agent_Full`.
> Bất cứ khi nào bắt đầu một phiên làm việc mới, hoặc sau khi cài lại Windows/chuyển máy, BẮT BUỘC phải đọc file này đầu tiên để nắm toàn bộ bối cảnh, quy tắc và việc cần làm tiếp theo.

---

## 🎯 1. Mục Đích Của File Này

1. **Lưu trữ toàn diện trạng thái dự án**:
   - Ghi lại kiến trúc, công nghệ, lịch sử thay đổi và hiện trạng của toàn bộ codebase.
   - Đảm bảo khi **cài lại Windows**, đổi máy, hoặc một Dev/AI mới tiếp quản thì chỉ cần đọc file này là nắm bắt 100% dự án trong vài phút và biết ngay **phải làm gì tiếp theo** mà không cần hỏi lại.

2. **Ghi nhật ký trước và sau khi làm (Bắt buộc)**:
   - **Trước khi làm**: Note lại tính năng sắp làm hoặc lỗi sắp sửa vào bảng tiến độ/nhật ký.
   - **Sau khi làm**: Cập nhật lại kết quả, trạng thái hoàn thành và giải pháp đã thực hiện.

---

## ⚖️ 2. Các Quy Tắc Bất Di Bất Dịch (Immutable Rules)

Mọi Developer và AI tham gia phát triển dự án này **bắt buộc phải tuân thủ nghiêm ngặt 6 quy tắc sau**:

1. **Quy tắc 1: Đọc tất cả các file `.md` trước khi làm**
   - Trước khi phân tích hay viết bất kỳ dòng code nào, phải quét và đọc toàn bộ các file `.md` trong dự án (`GEMINI.md`, `README.md`, specs, tài liệu trong `.agents/skills/`, v.v.) để nắm đúng ngữ cảnh và yêu cầu.

2. **Quy tắc 2: Note lại kế hoạch trước khi làm và cập nhật sau khi xong**
   - Trước khi code: Xác định rõ mục tiêu, ghi vào mục *Roadmap & Tiến độ* hoặc *Nhật ký công việc*.
   - Sau khi code: Đánh dấu hoàn thành, cập nhật trạng thái chi tiết.

3. **Quy tắc 3: Build code hoàn toàn sạch sẽ (Clean Code) & Loại bỏ code dư thừa**
   - Tuyệt đối không để lại code thừa, code chết (dead code), biến không sử dụng, module/thư viện import dư thừa.
   - Không để lại các câu lệnh log debug tạm bợ.
   - Tuân thủ nguyên tắc DRY (Don't Repeat Yourself), YAGNI (You Aren't Gonna Need It) và Separation of Concerns.

4. **Quy tắc 4: Ghi chú (Comment) rõ ràng tính năng trong mã nguồn**
   - Mọi hàm, phương thức, module, biến logic phức tạp đều phải có comment giải thích rõ: *Hàm này làm gì? Tham số đầu vào là gì? Giá trị trả về là gì? Tại sao lại xử lý theo cách này?*
   - Code phải dễ đọc, dễ hiểu để người khác đọc lại hiểu ngay lập tức.

5. **Quy tắc 5: Đẩy code ngay lên GitHub bất kỳ lúc nào thêm tính năng hoặc chỉnh sửa**
   - Bất kỳ khi nào hoàn thành hoặc thay đổi một tính năng/sửa lỗi, phải thực hiện `git add`, `git commit` với thông điệp rõ ràng và `git push` ngay lập tức lên remote repository (`origin/main`).
   - Không được dồn việc hoặc để code nằm lại local mà không đẩy lên GitHub.

6. **Quy tắc 6: Vận hành theo hệ thống Superpowers & Engineering Skills**
   - Dự án đã tích hợp đầy đủ bộ kỹ năng chuyên nghiệp từ `obra/superpowers` và `mattpocock/skills`.
   - Áp dụng các quy trình chuẩn:
     - Làm rõ yêu cầu & động não: `brainstorming`, `grill-me`.
     - Lập kế hoạch: `writing-plans`, `to-spec`.
     - Thực thi có kiểm thử: `test-driven-development` (TDD), `subagent-driven-development`.
     - Gỡ lỗi có hệ thống: `systematic-debugging`.
     - Đánh giá chất lượng: `code-review`, `verification-before-completion`.

---

## 🧭 3. Tổng Quan & Kiến Trúc Dự Án (Project Architecture)

- **Tên dự án**: `Agent_Full`
- **Mục tiêu cốt lõi**: Xây dựng **1 con Agent hoàn chỉnh để thực hiện các tác vụ tự động hóa trực tiếp trên máy tính của người dùng (User Machine)**.
- **Remote Repository**: `https://github.com/adwewecat/Agent_Full.git` (Branch: `main`)
- **Tác giả / Maintainer**: `adwewecat`
- **Vị trí làm việc trên máy**: `d:\LAPTRINH\Agent_Full`

### Cấu Trúc Thư Mục Dự Án
```text
Agent_Full/
├── .agents/                    # Hệ thống cấu hình Agent & Customizations
│   └── skills/                 # 42 Skills đã tích hợp sẵn (Superpowers + Matt Pocock)
│       ├── ask-matt/
│       ├── brainstorming/
│       ├── executing-plans/
│       ├── systematic-debugging/
│       ├── test-driven-development/
│       ├── ... (42 skills chuyên sâu)
├── .gitignore                  # Cấu hình bỏ qua các file rác/tạm
├── README.md                   # Giới thiệu tổng quan dự án cho người dùng/Dev
├── GEMINI.md                   # BỘ NÃO DỰ ÁN - Quy tắc, nhật ký & tiến độ (File này)
└── (Các module mã nguồn của Agent sẽ được triển khai tại đây)
```

### Bộ Skills Đã Tích Hợp (42 Skills)
Dự án được trang bị 2 bộ kỹ năng tiêu chuẩn hàng đầu:
1. **`obra/superpowers` (15 skills)**:
   - `brainstorming`, `diagnosing-superpowers`, `dispatching-parallel-agents`, `executing-plans`, `finishing-a-development-branch`, `receiving-code-review`, `requesting-code-review`, `subagent-driven-development`, `systematic-debugging`, `test-driven-development`, `using-git-worktrees`, `using-superpowers`, `verification-before-completion`, `writing-plans`, `writing-skills`.
2. **`mattpocock/skills` (27 skills)**:
   - *Engineering*: `ask-matt`, `code-review`, `codebase-design`, `diagnosing-bugs`, `domain-modeling`, `grill-with-docs`, `implement`, `implement-spec`, `improve-codebase-architecture`, `pr`, `prototype`, `research`, `retro`, `setup-matt-pocock-skills`, `tdd`, `to-spec`, `to-tickets`, `triage`, `wayfinder`, `wizard`.
   - *Productivity*: `grill-me`, `grilling`, `handoff`, `teach`, `to-questionnaire`, `wait-what`, `writing-for-agents`.

---

## 🛠️ 4. Hướng Dẫn Phục Hồi Khi Cài Lại Win (Fresh OS Runbook)

Khi bạn vừa cài lại Windows hoặc chuyển sang máy tính mới:
1. **Cài đặt Git & Clone dự án**:
   ```powershell
   git clone https://github.com/adwewecat/Agent_Full.git "d:\LAPTRINH\Agent_Full"
   cd "d:\LAPTRINH\Agent_Full"
   ```
2. **Cấu hình Git User**:
   ```powershell
   git config user.name "adwewecat"
   git config user.email "adwewecat@users.noreply.github.com"
   ```
3. **Kích hoạt Skills**:
   - Thư mục `.agents/skills/` đã có sẵn toàn bộ 42 skills trong repository.
   - Để cài đặt plugins ở cấp độ toàn cục (global) cho Antigravity CLI (nếu có dùng):
     ```powershell
     agy plugin install https://github.com/obra/superpowers
     agy plugin install https://github.com/mattpocock/skills
     ```
4. **Mở file `GEMINI.md`**: Đọc phần **Mục 5: Lộ Trình & Tiến Độ Tính Năng** để biết chính xác công việc tiếp theo cần làm.

---

## 📊 5. Lộ Trình & Tiến Độ Tính Năng (Roadmap & Status)

| ID | Module / Tính năng | Mô tả chi tiết | Trạng thái |
| :---: | :--- | :--- | :---: |
| **F01** | **Khởi tạo nền tảng** | Khởi tạo Git repo, cấu hình remote GitHub `adwewecat/Agent_Full`, tạo `.gitignore`. | ✅ Đã hoàn thành |
| **F02** | **Bộ quy tắc & Single Source of Truth** | Thiết lập file `GEMINI.md` (chuẩn quy tắc, audit log, runbook) và cập nhật `README.md`. | ✅ Đã hoàn thành |
| **F03** | **Tích hợp Skills** | Tích hợp 42 skills từ `obra/superpowers` và `mattpocock/skills` vào `.agents/skills/` và Antigravity. | ✅ Đã hoàn thành |
| **F04** | **Thiết kế Kiến trúc Agent_Full Core** | Phân tích và thiết kế kiến trúc của Agent thực hiện tác vụ trên máy tính user (Execution Engine, OS Integration, Task Dispatcher). | ⏳ Chờ thực hiện |
| **F05** | **Triển khai Core Engine** | Xây dựng các module thực thi tác vụ: đọc/ghi file, tương tác hệ thống, tự động hóa script, logging an toàn. | ⏳ Chờ thực hiện |
| **F06** | **Giao diện / CLI điều khiển Agent** | Xây dựng CLI hoặc UI để người dùng ra lệnh và tương tác với Agent. | ⏳ Chờ thực hiện |
| **F07** | **3D Office Dashboard (God View / Isometric)** | Xây dựng giao diện web 3D Isometric / Top-down giám sát và điều khiển đội ngũ AI Agent (React Three Fiber, Drei, Three.js, Click-to-Move, GLTF & Animations, Backend Agent State). | ✅ Đã hoàn thành |
| **F08** | **Bộ script khởi chạy tự động (Start Scripts)** | Tạo file `start.bat` và `start.ps1` tự động kiểm tra môi trường, cài đặt dependencies và mở trình duyệt chạy 3D Dashboard chỉ với 1 cú click. | ✅ Đã hoàn thành |

### 🚀 Việc Phải Làm Tiếp Theo (Next Steps)
> 👉 **BƯỚC TIẾP THEO CHO DEV HOẶC AI:**
> 1. Thảo luận với người dùng về kiến trúc công nghệ mong muốn cho `Agent_Full` (chọn Python, Node.js/TypeScript, Go hay ngôn ngữ/framework cụ thể nào).
> 2. Phân tích các loại tác vụ mà người dùng muốn Agent thực hiện trên máy (ví dụ: tự động hóa văn phòng, quản lý file, điều khiển trình duyệt, chạy tool dev, v.v.).
> 3. Tiến hành bước `brainstorming` và `writing-plans` theo đúng kỹ năng Superpowers trước khi code!

---

## 📝 6. Nhật Ký Công Việc (Audit / Work Log)

| Thời Điểm | Tác Vụ Thực Hiện | Chi Tiết Kỹ Thuật | Người / AI Thực Hiện |
| :--- | :--- | :--- | :--- |
| **2026-11-01** | Thiết lập ban đầu & Chuẩn hóa dự án | - Kiểm tra repo, pull `README.md` từ GitHub `adwewecat/Agent_Full`.<br>- Tích hợp 42 skills từ `obra/superpowers` và `mattpocock/skills` vào `.agents/skills/`.<br>- Cài đặt plugin global trong Antigravity CLI.<br>- Tạo `GEMINI.md` làm bộ não quy tắc và nhật ký.<br>- Tạo `.gitignore` chuẩn.<br>- Cập nhật `README.md` chi tiết.<br>- Đẩy commit ban đầu lên GitHub. | Antigravity AI (Gemini) |
| **2026-11-01** | Bắt đầu & Hoàn thành F07: 3D Office Dashboard | - Khởi tạo dự án Vite + React + Three.js + @react-three/fiber + @react-three/drei.<br>- Sao chép model GLB vào `public/models/agent.glb`.<br>- Xây dựng Scene Isometric God-view với OrbitControls giới hạn góc, ánh sáng đổ bóng nhẹ.<br>- Xây dựng Component `<Agent />` với `useGLTF`, `useAnimations`, raycaster Click-to-Move, nội suy vị trí lerp & slerp rotation trong `useFrame`.<br>- Tích hợp hook `useAgentStore` quản lý trạng thái Backend Agent State, tự động đổi animation khi backend cập nhật.<br>- Build production test thành công 100% (`tsc && vite build`). | Antigravity AI (Gemini) |
| **2026-11-01** | Hoàn thành F08: Tạo Start Scripts | - Tạo `start.bat` cho Windows Command Prompt / Double-click trực tiếp từ File Explorer.<br>- Tạo `start.ps1` cho Windows PowerShell.<br>- Tự động kiểm tra cài đặt Node.js và thư mục `node_modules`, tự động kích hoạt `npm run dev` tại cổng `http://localhost:3000`. | Antigravity AI (Gemini) |

