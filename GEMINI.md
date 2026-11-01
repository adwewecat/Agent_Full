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
| **F09** | **Nâng cấp Đồ Họa Nghệ Thuật & Nhân Vật Pixel-Agents** | Nâng cấp toàn diện phong cách đồ họa (nhân vật đa sắc màu, tai nghe/kính/phụ kiện, bong bóng suy nghĩ hoạt hình, linh vật văn phòng GitCat, nội thất bàn làm việc ấm cúng phong cách Cozy Pixel-Art). | ✅ Đã hoàn thành |
| **F10** | **Tối ưu Tọa Độ Ngồi & Tương Tác Vật Dụng (Seating & Alignment)** | Xây dựng hệ tọa độ chuẩn (Seating Anchor Points & Interaction Offsets) cho bàn ghế, sofa, server, arcade. Khắc phục triệt để lỗi chìm sàn, ngồi dưới gầm ghế hoặc đứng xuyên qua bàn; mở rộng bố cục văn phòng thông thoáng. | ✅ Đã hoàn thành |
| **F11** | **Tượng Phật Trang Nghiêm & Nghi Thức Bái Phật Trước Khi Làm Việc (Buddha Shrine & Blessing Ritual)** | Xây dựng bàn thờ / tượng Phật mạ vàng trang nghiêm, đài sen, bát hương nghi ngút khói và đèn dầu ấm áp. Tích hợp quy trình: mọi Agent trước khi vào vị trí làm việc đều tự động tới trước tượng Phật chắp tay vái lạy cầu bình an không bug, nhận buff phước lành; hỗ trợ nút "Toàn Đội Bái Phật" trên HUD. | ✅ Đã hoàn thành |
| **F12** | **Tinh Gọn Nhãn Tên & Thiết Kế Hộp Thoại Hình Chữ Nhật (Compact Name Tag & Rectangular Speech Box)** | Tinh gọn tối đa nhãn trên đầu nhân vật (chỉ giữ lại tên nhỏ gọn và chấm trạng thái, bỏ toàn bộ vai trò/mô tả dài gây rối mắt). Tái thiết kế bong bóng suy nghĩ thành hộp thoại hình chữ nhật, thu gọn chiều rộng (width ngắn lại) và tăng chiều cao (height cao hơn, tự động xuống 2-3 dòng đẹp mắt). | ✅ Đã hoàn thành |
| **F13** | **Triệt Tiêu Rối Mắt & Giải Phóng Tầm Nhìn 3D (Zen Clean UI & De-cluttering)** | Giải quyết triệt để vấn đề chữ che kín màn hình: Loại bỏ các bảng tên trạm làm việc cố định (chuyển sang hover); loại bỏ bảng chữ to trước tượng Phật; chỉ hiển thị bong bóng thoại cho Agent đang được chọn (isSelected) hoặc khi đang bái Phật, giúp không gian 3D thoáng đãng, nghệ thuật và không còn bị rối mắt. | ✅ Đã hoàn thành |
| **F14** | **Hệ Thống Hội Thoại Tự Nhiên & Tin Tức Hài Hước (Humorous & Spontaneous Dialogue Engine)** | Xây dựng kho dữ liệu câu thoại phong phú, dí dỏm về cuộc sống dev, dự báo thời tiết meme, tin tức công nghệ hot và tán gẫu cùng mèo GitCat; tích hợp hệ thống phát sinh thoại ngẫu nhiên theo thời gian thực (Ambient Chatter) giúp văn phòng sống động và vui nhộn. | ✅ Đã hoàn thành |
| **F15** | **Gương Mặt Chibi Đáng Yêu & Tô Màu Trang Phục Sống Động (Expressive 3D Faces & Outfits)** | Thiết kế khuôn mặt Chibi sinh động (mắt to tròn long lanh anime, lông mày biểu cảm, mũi nhỏ xinh, nụ cười duyên và má hồng đào); gắn trực tiếp vào xương đầu (head bone) để chuyển động đồng bộ theo hoạt ảnh; tô màu da tự nhiên và trang phục sặc sỡ theo cá tính riêng của từng Agent, xóa bỏ hoàn toàn tượng trắng đơn điệu. | ✅ Đã hoàn thành |
| **F16** | **Nâng Cấp Văn Phòng & Nhân Vật Chân Thực (Realistic High-Tech Executive AI Office)** | Chuyển đổi toàn diện sang chuẩn văn phòng công nghệ cao chân thực theo phong cách tham chiếu Pinterest (NOVUS AI Command Center): Tường kính panorama ngắm thành phố, màn hình Hologram cong siêu lớn treo trần, bàn tương tác Hologram AI Core trung tâm, bàn ghế công thái học chân sao 5 cánh có bánh xe, nhân vật trang phục vest/blazer công sở hiện đại, gương mặt người thật tinh tế, ánh sáng kiến trúc sang trọng. | ✅ Đã hoàn thành |
| **F17** | **Tối Giản Mặt Sàn Liền Mạch & Giải Phóng Tầm Nhìn Trần (Seamless Floor & Clean Ceiling View)** | Loại bỏ hoàn toàn lưới ô vuông (gridHelper) dưới nền nhà và thảm; loại bỏ toàn bộ các thanh xà dầm ngang vắt ngang che khuất tầm mắt; mang lại mặt sàn bê tông mài bóng liền mạch sang trọng và không gian vòm trần thoáng đãng, không bị che chắn tầm nhìn. | ✅ Đã hoàn thành |
| **F18** | **Tái Thiết Kế Giao Diện Văn Phòng Điều Hành & Phòng Họp Sang Trọng (Executive Conference & Director Office)** | Thiết kế y chang theo ảnh tham chiếu Pinterest: Tường sơn 2 màu trắng và xanh dương Địa Trung Hải (Two-tone White & Sky Blue), sàn gạch sứ trắng ngà bóng loáng không tì vết, bàn họp gỗ sồi dài trung tâm kèm 8 ghế xoay da đen chân sao, bàn Giám đốc điều hành quyền uy, bảng xanh & biểu trưng vàng tường hậu, tủ tài liệu gỗ kính 2 bên, khu sofa tiếp khách bọc da màu kem taupe sang trọng và góc thờ Phật tôn nghiêm. | ✅ Đã hoàn thành |

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
| **2026-11-01** | Sửa lỗi start.bat tự tắt & Đổi cổng 5173 | - **Truy vết lỗi**: Dấu ngoặc đơn `(npm install)` trong khối `if (...)` của batch script bị CMD hiểu nhầm là đóng khối lệnh sớm, văng lỗi `... was unexpected at this time` và tắt cửa sổ ngay lập tức. Cổng 3000 bị Docker/WSL chiếm dụng.<br>- **Xử lý**: Loại bỏ ký tự xung đột cú pháp, bổ sung `cd /d "%~dp0"`, đổi cổng Vite sang `5173`, kiểm tra chạy thực tế CMD thành công 100%. | Antigravity AI (Gemini) |
| **2026-11-01** | Bắt đầu F09: Nâng cấp Đồ Họa Nghệ Thuật & Nhân Vật Màu Sắc | Nghiên cứu repository `pixel-agents-hq/pixel-agents`. Lên kế hoạch tái thiết kế diện mạo Agent đa sắc màu (outfits, headphones, goggles), bổ sung bong bóng suy nghĩ hoạt hình (Thought Bubbles), linh vật mèo GitCat, nội thất văn phòng ấm cúng phong cách Cozy Indie Studio kết hợp Cyber Neon. | Antigravity AI (Gemini) |
| **2026-11-01** | Hoàn thành F09: Nâng cấp Visual Art & Characters | - Bổ sung 4 Agent với codename riêng (Nova, Axel, Vesper, Kip) và phụ kiện 3D thủ công (Cyber Visor, Gaming Headphones, Cat Ears, Snapback Cap).<br>- Tích hợp Thought / Speech Bubbles hoạt họa bập bồng phong cách Pixel-Agents.<br>- Xây dựng linh vật mèo văn phòng GitCat 🐱 tự do tuần tra và tương tác vỗ về.<br>- Tái thiết kế sàn gỗ ấm áp, thảm hoa văn boho, đèn bàn vàng nắng ấm, màn hình kép hiển thị code màu mè, bảng Kanban giấy note và máy Arcade cổ điển.<br>- Tích hợp hộp thoại hội thoại trực tiếp (Dialogue Feed) trên HUD.<br>- Build production test thành công 100%. | Antigravity AI (Gemini) |
| **2026-11-01** | Bắt đầu F10: Sửa lỗi Tọa độ ngồi & Tương thích vật dụng | Phân tích ảnh thực tế: nhân vật ngồi dưới ghế, chìm vào sàn, clipping vào bàn server. Tính toán root translation animation (-0.15m), thiết lập Seating Anchor Points & Interaction Offsets chuẩn cho từng loại đồ đạc, nới rộng bố cục văn phòng. | Antigravity AI (Gemini) |
| **2026-11-01** | Hoàn thành F10: Tối ưu Tọa độ ngồi & Bố cục văn phòng | - Bổ sung hàm `getWorkstationSeatTransform` tính toán chính xác điểm ngồi/đứng theo ma trận xoay quanh trục Y của từng trạm.<br>- Bù trừ độ võng Y = -0.15m của clip animation `sit` (nâng Y lên 0.48m) để hông và đùi nhân vật tiếp xúc chuẩn xác trên mặt đệm ghế (Y = 0.35m).<br>- Tách biệt logic di chuyển (Y = 0 tiếp sàn) và ngồi làm việc (xoay mặt hướng vào màn hình, chuyển animation sit).<br>- Nới rộng khoảng cách các trạm làm việc trên diện tích 16x14m, loại bỏ tình trạng đè chồng nhãn và đồ đạc.<br>- Build test thành công 100%. | Antigravity AI (Gemini) |
| **2026-11-01** | Bắt đầu & Hoàn thành F11: Tượng Phật & Nghi thức Bái Phật Trước Khi Làm Việc | - Tạo component 3D `<BuddhaShrine />` với bàn thờ gỗ gụ, đài sen mạ vàng nhiều tầng, kim thân tượng Phật tọa thiền kiết già, vòng hào quang xoay xung nhịp, bát hương đồng 3 nén khói nghi ngút, đèn dầu sen và đồ cúng.<br>- Xây dựng quy trình tự động trong `useAgentStore`: Khi phân công nhiệm vụ mới cho Agent, Agent tự động ghé Đài Sen bái Phật 3 lạy (`emote-yes` + forward pitch tilt) cầu an và giải hạn bug trước khi di chuyển vào bàn làm việc.<br>- Tích hợp vòng hào quang hoa sen vàng dưới chân khi vái lạy và buff phước lành `🙏 0% Bug, 100% Green Test` trên nhãn Agent & HUD.<br>- Bổ sung nút "Toàn Đội Bái Phật" trên thanh Footer HUD và tương tác click trực tiếp vào đài sen trong 3D.<br>- Kiểm tra build `npm run build` thành công 100%. | Antigravity AI (Gemini) |
| **2026-11-01** | Bắt đầu & Hoàn thành F12: Tinh gọn nhãn tên & Hộp thoại chữ nhật | - Loại bỏ hoàn toàn chuỗi văn bản vai trò/mô tả dài dòng `({name} • {role})` và khung text cồng kềnh trên đầu Agent; chỉ giữ lại nhãn tên mini siêu nhỏ gọn (`codename`) kèm chấm trạng thái phát sáng và biểu tượng phước lành `🙏`.<br>- Tái cấu trúc CSS `.thought-bubble`: chuyển đổi từ thanh dẹt bo tròn dài thành hộp thoại hình chữ nhật chuẩn đẹp (`border-radius: 8px`, `width: 130px`, `min-height: 48px`, `white-space: normal`, tự động ngắt dòng 2-3 hàng), giúp giao diện thoáng đãng, không bị đè che các vật thể và bàn ghế khác.<br>- Kiểm tra build `npm run build` thành công 100%. | Antigravity AI (Gemini) |
| **2026-11-01** | Bắt đầu & Hoàn thành F13: Triệt tiêu rối mắt & Giải phóng tầm nhìn 3D | - **Khắc phục triệt để vấn đề chữ che kín màn hình**:<br>1. Ẩn toàn bộ 6 bảng tên trạm làm việc cố định (`Dev Terminal`, `QA Bench`...), chỉ hiển thị tooltip nhẹ nhàng khi người dùng rê chuột (hover) vào trạm.<br>2. Ẩn bảng chữ to phía trước tượng Phật, trả lại vẻ trang nghiêm tôn kính cho kim thân mạ vàng và đài sen (chỉ hiện tooltip khi hover hoặc khi Agent đang bái Phật).<br>3. Thay vì cả 4 Agent đều mở bong bóng thoại cùng lúc 24/7, hộp thoại chỉ hiển thị cho Agent đang được chọn (`isSelected`), khi rê chuột (`isHovered`), hoặc khi đang bái Phật (`status === 'praying'`).<br>- Giao diện văn phòng 3D trở nên cực kỳ thoáng đãng, nghệ thuật, êm dịu và không còn bị rối mắt.<br>- Build test `npm run build` thành công 100%. | Antigravity AI (Gemini) |
| **2026-11-01** | Bắt đầu & Hoàn thành F14: Hệ thống hội thoại tự nhiên & Tin tức hài hước | - Xây dựng module `src/data/dialogueBank.ts` chứa kho câu thoại phong phú: Dev memes (push force, conflict, bug lòi), dự báo thời tiết hài hước (27°C mát mẻ ngồi máy lạnh húp cà phê), tin tức công nghệ hot 2026 (AI thi bằng lái, GPU cloud, uptime 99.999%), và câu chuyện hài về mèo GitCat.<br>- Tích hợp bộ phát sinh hội thoại tự động theo thời gian thực (Ambient Chatter Interval 13s): ngẫu nhiên chọn Agent để cập nhật suy nghĩ dí dỏm và đẩy câu thoại vào feed Tiếng Nói Văn Phòng.<br>- Bổ sung phản ứng vuốt ve ngẫu nhiên hài hước cho GitCat (đòi súp thưởng, phơi bụng, purr purr).<br>- Build test `npm run build` thành công 100%. | Antigravity AI (Gemini) |
| **2026-11-01** | Bắt đầu & Hoàn thành F15: Gương mặt Chibi biểu cảm & Tô màu nhân vật | - Thiết kế module `src/components/AgentFace.ts`: tạo nhóm hình học 3D biểu cảm (đôi mắt anime to tròn 2 tầng phản quang, lông mày cá tính, mũi nhỏ xinh, nụ cười duyên và má hồng đào kawaii) gắn trực tiếp vào xương `head` để chuyển động đồng bộ 100% theo nhịp bước và cúi lạy.<br>- Thiết kế kiểu tóc 3D riêng biệt: Nova (tóc tém tím pastel), Axel (tóc vuốt dựng spiky), Vesper (tóc bồng bềnh hồng ruby), Kip (lọn tóc nâu dưới vành nón).<br>- Tùy biến chất liệu GLTF: tô màu da tự nhiên ấm áp (`head-mesh`) và màu trang phục rực rỡ cá tính (`body-mesh`), loại bỏ hoàn toàn tượng trắng đơn điệu.<br>- Tinh chỉnh phụ kiện cyber-visor nâng nhẹ lên trán để lộ rõ đôi mắt long lanh.<br>- Build test `npm run build` thành công 100%. | Antigravity AI (Gemini) |
| **2026-11-01** | Bắt đầu & Hoàn thành F16: Nâng cấp Văn phòng & Nhân vật Chân thực | - Chuyển đổi toàn diện sang chuẩn văn phòng điều hành AI cao cấp (NOVUS AI & Penthouse Executive Suite) theo ảnh tham chiếu Pinterest:<br>1. **Môi trường & Kiến trúc**: Sàn bê tông mài bóng ánh kim (`#cbd5e1`), vách kính Panorama kịch trần nhìn ra đường chân trời thành phố hoàng hôn 3D (18 tòa cao ốc có đèn cửa sổ lung linh, xe bay tương lai lướt qua), dầm trần thép công nghiệp và đèn LED tuyến tính thả trần.<br>2. **Màn hình cong & Bàn Hologram AI Core**: Màn hình Hologram cong siêu lớn treo trần hiển thị viễn cảnh kinh doanh & biểu đồ tăng trưởng cột cầu vồng ("NOVUS AI • BUSINESS METRICS & SCALING VISION"); Bàn tương tác Hologram AI trung tâm với quả địa cầu wireframe 3D xoay tròn, vòng radar dữ liệu và 6 thẻ icon Holographic lơ lửng.<br>3. **Nội thất bàn ghế chân thực**: Bàn làm việc vát cạnh mặt thạch anh, hộc tủ 3 ngăn có logo phát sáng dưới gầm bàn; Ghế xoay công thái học cao cấp (Herman Miller Aeron Style) với chân sao 5 cánh có bánh xe con lăn, đệm ngồi uốn cong, tựa lưng lưới thoáng khí có đệm đỡ thắt lưng (Lumbar Support) và tay vịn 3D; Màn hình cong kép không viền hiển thị code IDE và biểu đồ telemetry.<br>4. **Trang phục doanh nhân & Gương mặt người thật**: Module `AgentAttire.ts` gắn cổ áo sơ mi, ve áo vest (lapels), cà vạt lụa, thẻ ID chip nhân viên, thắt lưng da và smartwatch trên cổ tay; Module `AgentFace.ts` nâng cấp đôi mắt hạnh nhân tự nhiên có chiều sâu, sống mũi 3D, đôi môi mềm mại và kiểu tóc công sở sang trọng.<br>- Build test `npm run build` thành công 100%. | Antigravity AI (Gemini) |
| **2026-11-01** | Bắt đầu & Hoàn thành F17: Tối giản Mặt Sàn Liền Mạch & Giải Phóng Tầm Nhìn Trần | - **Xóa bỏ lưới ô vuông dưới đất**: Gỡ bỏ hoàn toàn `gridHelper` khỏi `ExecutiveFloor()`, trả lại bề mặt sàn bê tông mài bóng xám sáng liền mạch, sang trọng, không còn bị các đường ô vuông trắng cắt xé rối mắt.<br>- **Loại bỏ các thanh dầm xà ngang che tầm nhìn**: Gỡ bỏ hoàn toàn các thanh dầm chịu lực ngang màu than chì và máng đèn treo ngang khỏi `OfficeEnvironment()`, giải phóng 100% không gian vòm trần, giúp tầm nhìn từ trên cao nhìn xuống hoàn toàn thông thoáng, khoáng đạt và không bị bất kỳ thanh chắn nào cản trở.<br>- Build test `npm run build` thành công 100%. | Antigravity AI (Gemini) |
| **2026-11-01** | Bắt đầu & Hoàn thành F18: Tái thiết kế Giao diện Văn phòng Điều hành & Hội nghị | - Thiết kế y chang hình ảnh thực tế Pinterest (`media_1793521217785_b1699b7f.jpg`):<br>1. **Màu tường & Kiến trúc**: Tường sơn 2 tone màu phân tầng chuẩn mực (nửa dưới màu xanh dương Sky Blue `#0284c7`, nửa trên trắng tinh khôi `#ffffff` kèm nẹp chỉ gỗ chạy quanh tường). Lan can ban công tầng lửng Mezzanine viền xanh dương ở tiền cảnh tạo đúng góc chụp God-view từ trên cao.<br>2. **Mặt sàn**: Gạch men sứ trắng ngà siêu bóng cao cấp (`#fbfcfd`, roughness 0.12), phẳng mịn liền mạch 100%, không tì vết, phản chiếu ánh sáng tự nhiên.<br>3. **Nội thất chuẩn xác theo ảnh**: Bàn Giám đốc gỗ sồi ấm áp kèm ghế da đen cao cấp có tựa đầu phía sau; Bàn hội nghị gỗ sồi dài trung tâm (3.6m x 1.55m) kèm 8 ghế xoay da đen chân sao mạ chrome; Bảng xanh nẹp gỗ trung tâm tường hậu & biểu trưng mặt trời vàng quyền uy; 2 Tủ sách gỗ đứng mặt kính 2 bên đựng tài liệu hồ sơ; Cụm sofa tiếp khách VIP bọc da kem Taupe êm ái kèm bàn trà hai bên phòng.<br>4. **Vị trí thờ Phật tôn nghiêm**: Đài Sen Bái Phật mạ vàng trang nghiêm tích hợp tại góc tường hậu bên trái (`[-2.4, 0, -4.8]`), hài hòa tuyệt đối với biểu trưng vàng và không gian phòng họp.<br>5. **Ánh sáng tự nhiên**: Hệ thống chiếu sáng ban ngày ngập tràn qua các khung cửa sổ kính trắng lớn bên trái phòng.<br>- Build test `npm run build` thành công 100%. | Antigravity AI (Gemini) |

