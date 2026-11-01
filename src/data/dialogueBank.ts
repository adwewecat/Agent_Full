/**
 * @file dialogueBank.ts
 * @description Kho dữ liệu câu thoại phong phú, dí dỏm và tự nhiên của đội ngũ AI Agent.
 * Bao gồm các chủ đề: Hài hước nghề Dev, Dự báo thời tiết Meme, Tin tức công nghệ hot 2026,
 * Tán gẫu cùng mèo GitCat và Xin vía an lạc tại Đài Sen Bái Phật.
 */

/**
 * @file dialogueBank.ts
 * @description Kho dữ liệu câu thoại phong phú, dí dỏm và tự nhiên của đội ngũ AI Agent.
 * Tách biệt rõ ràng:
 * 1. Tin tức công nghệ xác thực & thời sự chính thống (Được phép lặp lại nhiều lần).
 * 2. Câu thoại hài hước nghề Dev & Meme (Cơ chế chống lặp trong ngày).
 * 3. Chuỗi trao đổi công việc nhiệt tình khi có task mới.
 * 4. Sinh hoạt đời thường: Pha cà phê, cho mèo GitCat ăn, xin đi vệ sinh.
 */

export interface AmbientQuote {
  agentId?: 'agent_1' | 'agent_2' | 'agent_3' | 'agent_4'; // Pé Na, Pé Ken, Lão Lục, Lão Cửu
  icon: string;
  thought: string;
  chatMessage: string;
  category?: 'meme' | 'verified_news' | 'work' | 'routine';
}

/**
 * 📰 TIN TỨC CÔNG NGHỆ XÁC THỰC & THỜI SỰ CHÍNH THỐNG (Được phép lặp lại nhiều lần)
 */
export const VERIFIED_TECH_NEWS: AmbientQuote[] = [
  {
    agentId: 'agent_1', // Pé Na
    icon: '📊',
    thought: 'Báo cáo GitHub Octoverse 2026...',
    chatMessage: 'Bản tin GitHub Octoverse: TypeScript và Python tiếp tục là 2 ngôn ngữ thống trị trong hệ sinh thái xây dựng Autonomous Coding Agents!',
    category: 'verified_news'
  },
  {
    agentId: 'agent_1', // Pé Na
    icon: '🤖',
    thought: 'Benchmark AI Reasoning mới nhất...',
    chatMessage: 'Tin tức AI xác thực: Các mô hình suy luận đa bước thế hệ mới vừa đạt độ chính xác 94.8% trên bài thi toán học và biên dịch mã nguồn.',
    category: 'verified_news'
  },
  {
    agentId: 'agent_4', // Lão Cửu
    icon: '☁️',
    thought: 'Thông số cụm Data Center Kubernetes v1.33...',
    chatMessage: 'Bản tin hạ tầng Cloud: Tiêu chuẩn Kubernetes mới tối ưu hóa 35% tài nguyên RAM cho các cụm Pod AI chạy mô hình cục bộ.',
    category: 'verified_news'
  },
  {
    agentId: 'agent_3', // Lão Lục
    icon: '🔒',
    thought: 'Bản tin an ninh mạng CVE cập nhật...',
    chatMessage: 'Bản tin An ninh bảo mật: Khuyến nghị các dự án cập nhật bản vá thư viện định kỳ để ngăn chặn lỗ hổng Dependency Confusion.',
    category: 'verified_news'
  },
  {
    agentId: 'agent_2', // Pé Ken
    icon: '⚡',
    thought: 'Chuẩn WebAssembly WebGL mới...',
    chatMessage: 'Tin chuẩn quốc tế W3C: Công nghệ WebAssembly Threads và WebGPU chính thức hỗ trợ tăng tốc đồ họa 3D thời gian thực trên mọi trình duyệt.',
    category: 'verified_news'
  },
  {
    icon: '🌤️',
    thought: 'Dự báo thời tiết văn phòng...',
    chatMessage: 'Dự báo khí tượng: Nhiệt độ phòng duy trì ổn định 25.5°C mát mẻ, độ ẩm lý tưởng 55% cho máy chủ và nhân sự làm việc.',
    category: 'verified_news'
  }
];

/**
 * 🎭 CÂU THOẠI HÀI HƯỚC NGHỀ DEV & MEME (Cơ chế chống lặp trong ngày)
 */
export const MEME_DEV_QUOTES: AmbientQuote[] = [
  {
    icon: '🌧️',
    thought: 'Mưa rơi lất phất ngoài hiên...',
    chatMessage: 'Ngoài trời bắt đầu đổ mưa rồi, ai phơi quần áo thì nhớ rút, còn ai đang code thì... cứ code tiếp đi!',
    category: 'meme'
  },
  {
    icon: '⚡',
    thought: 'Trời sắp giông gió, lưu file ngay!',
    chatMessage: 'Nghe tiếng sấm chớp kìa, anh em bấm Ctrl+S lia lịa kẻo cúp điện hối không kịp!',
    category: 'meme'
  },
  {
    agentId: 'agent_1', // Pé Na
    icon: '📈',
    thought: 'Giá cà phê Arabica tăng nhẹ...',
    chatMessage: 'Tin vắn thị trường: Giá cà phê tăng 5%, hèn chi sáng nay ngụm cà phê của Pé Ken đắng đót lạ thường!',
    category: 'meme'
  },
  {
    agentId: 'agent_2', // Pé Ken
    icon: '💻',
    thought: 'Tính năng này không phải lỗi đâu nha!',
    chatMessage: 'Tính năng này trên máy mình chạy ngon ơ, sang máy production mà lỗi thì chắc chắn là do... phong thủy!',
    category: 'meme'
  },
  {
    agentId: 'agent_2', // Pé Ken
    icon: '⌨️',
    thought: 'Switch Blue gõ nghe đã tai ghê!',
    chatMessage: 'Bàn phím cơ gõ tanh tách như pháo nổ, nghe giai điệu này là biết chuẩn bị có commit triệu view!',
    category: 'meme'
  },
  {
    agentId: 'agent_3', // Lão Lục
    icon: '🔍',
    thought: 'Lão Lục lại bắt được biến dị thường!',
    chatMessage: 'Lão Lục vừa review một PR: ai đặt tên biến `temp_dung_xoa_nha_123` thì tự giác bao cả phòng trà sữa nha!',
    category: 'meme'
  },
  {
    agentId: 'agent_4', // Lão Cửu
    icon: '☕',
    thought: 'Làm một ly Americano đá không đường!',
    chatMessage: 'Uống ly cà phê đen đá vào người, cảm giác nhịp tim đồng bộ chuẩn xác với xung nhịp CPU 4.8GHz!',
    category: 'meme'
  },
  {
    icon: '🧋',
    thought: 'Trà sữa 50% đường, 100% bug-free!',
    chatMessage: 'Quán trà sữa đầu ngõ vừa có voucher giảm giá 40%, ai ké đơn trà sữa nướng trân châu hoàng kim hông?',
    category: 'meme'
  },
  {
    icon: '🍕',
    thought: 'Hôm nay tăng ca có ai bao pizza không?',
    chatMessage: 'Nghe đồn mùi bánh pizza phô mai thơm lừng sắp xuất hiện tại phòng pantry, có động lực code tiếp rồi!',
    category: 'meme'
  },
  {
    agentId: 'agent_2', // Pé Ken
    icon: '🚀',
    thought: 'Git push force và quay lưng bước đi...',
    chatMessage: 'Gõ `git push --force` rồi quay lưng đi lấy nước, phong thái điềm tĩnh như siêu điệp viên không nhìn vụ nổ đằng sau!',
    category: 'meme'
  },
  {
    icon: '📦',
    thought: 'Mèo chê nệm êm, chỉ thích thùng giấy!',
    chatMessage: 'Mua cái nệm sofa nhung xịn xò 500k, kết quả con mèo GitCat nó nhảy tọt vào cái thùng các-tông đựng vỏ bàn phím nằm ngủ!',
    category: 'meme'
  }
];

/**
 * 💼 CHUỖI ĐỐI THOẠI TRAO ĐỔI CÔNG VIỆC NHIỆT TÌNH (Khi có task mới giao tới)
 */
export const WORK_COLLABORATION_DIALOGUES = [
  {
    speaker: 'agent_2', // Pé Ken
    text: 'Cả đội chú ý! Đã có nhiệm vụ mới giao tới: Pé Na crawl tài liệu, Lão Lục dựng test case, Lão Cửu mở rộng pod nha!',
    icon: '🚀'
  },
  {
    speaker: 'agent_1', // Pé Na
    text: 'Pé Na nhận lệnh! Đang phân tích cấu trúc API endpoints và trích xuất dữ liệu mẫu!',
    icon: '🔍'
  },
  {
    speaker: 'agent_3', // Lão Lục
    text: 'Đã sẵn sàng bộ test audit 100 tiêu chuẩn Clean Code, đố con bug nào lọt qua mắt Lão Lục!',
    icon: '🛡️'
  },
  {
    speaker: 'agent_4', // Lão Cửu
    text: 'Cụm máy chủ Kubernetes đã cấp phát đủ CPU/RAM, đường truyền 10Gbps sẵn sàng deploy!',
    icon: '⚡'
  }
];

/**
 * ☕ SINH HOẠT VĂN PHÒNG ĐỜI THƯỜNG (Cà phê, cho mèo ăn, đi vệ sinh)
 */
export const OFFICE_ROUTINE_SCRIPTS = {
  coffee: {
    startThought: 'Buồn ngủ quá, qua quầy pha ly cà phê thôi...',
    startSpeech: 'Để tớ ghé quầy pha ly Americano nạp caffeine lấy lại sự tỉnh táo đã!',
    endThought: 'Cà phê thơm nức mũi, tỉnh cả ngủ!',
    endSpeech: 'Cà phê thơm ngon đậm đà! Năng lượng nạp đầy 100%, về bàn code tiếp thôi!'
  },
  cat: {
    startThought: 'Tới giờ cho GitCat ăn súp thưởng rồi!',
    startSpeech: 'GitCat ơi ra đây ăn súp thưởng cá ngừ với hạt giòn nè cưng! 🐱',
    endThought: 'Mèo ăn sạch bát, ngoan ghê!',
    endSpeech: 'GitCat ăn no nê rồi lăn ra phơi bụng, trông cưng xỉu!'
  },
  restroom: {
    startThought: 'Ghé restroom giải lao chút...',
    startSpeech: 'Xin phép anh em tớ ghé restroom giải lao 30 giây nha!',
    endThought: 'Refresh xong rồi, sảng khoái ghê!',
    endSpeech: 'Đã rửa mặt refresh tinh thần cực kỳ sảng khoái, quay lại vị trí chiến đấu tiếp!'
  }
};

/**
 * Bộ nhớ theo dõi câu meme đã nói trong ngày (tránh lặp lại)
 */
const seenMemeIndexes = new Set<number>();

/**
 * Lấy câu thoại ngẫu nhiên: Ưu tiên tin tức xác thực (cho phép lặp),
 * còn câu hài hước thì lọc chống lặp nghiêm ngặt.
 */
export function getSmartAmbientQuote(specificAgentId?: string): AmbientQuote {
  // 65% xác suất chọn Tin tức xác thực công nghệ (cho phép lặp bình thường)
  // 35% xác suất chọn Câu thoại meme hài hước (lọc chống lặp)
  const pickNews = Math.random() < 0.65;

  if (pickNews) {
    let pool = VERIFIED_TECH_NEWS;
    if (specificAgentId) {
      const filtered = pool.filter((q) => !q.agentId || q.agentId === specificAgentId);
      if (filtered.length > 0) pool = filtered;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  } else {
    // Chọn từ kho Meme chưa nói
    let availableIndexes: number[] = [];
    MEME_DEV_QUOTES.forEach((q, idx) => {
      if (!seenMemeIndexes.has(idx)) {
        if (!specificAgentId || !q.agentId || q.agentId === specificAgentId) {
          availableIndexes.push(idx);
        }
      }
    });

    // Nếu đã nói hết tất cả câu meme, reset lại bộ nhớ
    if (availableIndexes.length === 0) {
      seenMemeIndexes.clear();
      availableIndexes = MEME_DEV_QUOTES.map((_, i) => i);
    }

    const selectedIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    seenMemeIndexes.add(selectedIndex);
    return MEME_DEV_QUOTES[selectedIndex];
  }
}

/**
 * Tương thích ngược với các lệnh gọi cũ
 */
export const AMBIENT_QUOTES = [...VERIFIED_TECH_NEWS, ...MEME_DEV_QUOTES];
export function getRandomAmbientQuote(specificAgentId?: string): AmbientQuote {
  return getSmartAmbientQuote(specificAgentId);
}

/**
 * Lời thoại hài hước định kỳ từ Tượng Phật
 */
export const BUDDHA_MEME_QUOTES = [
  'Tha thứ cho ngươi là việc của Phật, nhưng tiễn ngươi về gặp Phật là việc của ta! 📿',
  'Nam Mô A Di Đà Phật, bần tăng khuyên thí chủ nên tự giác rollback code! 🙏',
  'Phật độ người hữu duyên, không độ kẻ push force đè commit đồng đội! 🧘',
  'Vạn pháp quy tâm, vạn bug quy về... thằng viết code trước! 🌸',
  'Khổ hải vô biên, quay đầu là bờ... còn ngoan cố thì bần tăng phóng tràng hạt! 📿',
  'Tâm bất biến giữa dòng đời vạn bug, niệm một câu A Di Đà Phật rồi xóa hết viết lại! 🪷'
];

/**
 * Lời thoại hài hước định kỳ từ Thánh Giá Chúa
 */
export const CHRISTIAN_MEME_QUOTES = [
  'Người nào xứng đáng, ta sẽ ban Đinh! 🔨',
  'Nhân danh Chúa, ta ban bug cho con! ✝️🐛',
  'Đứa nào commit mà không test, chuẩn bị lên giá đóng đinh! 🪵',
  'Phúc cho ai không thấy mà tin, nhưng họa cho ai code mà không chạy unit test! 📖',
  'Hỡi con chiên ngoan đạo, bug này là bài test đức tin của con đó! 😇',
  'Ta đã tha thứ cho mọi tội lỗi của con, nhưng compiler thì tuyệt đối KHÔNG! ⚡'
];

/**
 * Phản ứng thảng thốt của từng Agent khi né tránh đinh và tràng hạt
 */
export const DODGE_REACTIONS: Record<string, string[]> = {
  agent_1: [
    'Á đù đạn đạo bay! Cúi đầu né gấp bà con ơi! 🏃💨',
    'Tràng hạt Phật tổ giáng thế! May mà Pé Na lùn một mẩu nên lọt qua! 🙈',
    'Chúa ban đinh thiệt kìa! Pé Na xém rụng mái tóc ngắn! 😱'
  ],
  agent_2: [
    'Chúa ban đinh thiệt kìa trời ơi! Xém lủng trán Pé Ken! 🔨😱',
    'Quả đinh xé gió 300km/h! Phản xạ game thủ cứu Pé Ken một mạng! ⚡',
    'May quá né kịp! Lệch 2cm là rách luôn cái áo vest xịn! 😂'
  ],
  agent_3: [
    'Lão Lục lươn lẹo quen rồi, đinh này tuổi gì trúng được ta! 😂',
    'May quá cúi rạp người, xém nữa đinh găm trúng mông Lão Lục rồi! 🛡️',
    'Tràng hạt bay xoáy kinh vậy! Lão Lục thoát chết trong gang tấc! 📿'
  ],
  agent_4: [
    'Tràng hạt lướt qua tai, tóc gió thôi bay! Lão Cửu né đỉnh chưa! 📿',
    'Vừa deploy vừa né đinh thần, đúng là kỹ năng sinh tồn cấp cao! 🚀',
    'Đinh găm sượt qua chóp nón, hú hồn chim én! ⚡'
  ]
};

export function getRandomBuddhaMeme(): string {
  return BUDDHA_MEME_QUOTES[Math.floor(Math.random() * BUDDHA_MEME_QUOTES.length)];
}

export function getRandomChristianMeme(): string {
  return CHRISTIAN_MEME_QUOTES[Math.floor(Math.random() * CHRISTIAN_MEME_QUOTES.length)];
}

export function getRandomDodgeReaction(agentId: string): string {
  const list = DODGE_REACTIONS[agentId] || [
    'Ối giời ơi né gấp! Đạn đạo bay vèo qua đầu! 🏃💨'
  ];
  return list[Math.floor(Math.random() * list.length)];
}
export const GITCAT_REACTIONS = [
  '😻 *Meow meow... purr purr!* GitCat dụi đầu vào tay bạn làm nũng, chúc bạn một ngày code không lỗi lầm!',
  '🐾 *Meo~* GitCat phe phẩy cái đuôi cam, nằm lăn tròn phơi bụng đòi gãi cằm!',
  '✨ *Purrrr...* GitCat trao cho bạn ánh mắt lấp lánh: "Đã truyền buff may mắn cho bạn rồi nhé, deploy đi!"',
  '🐟 *Meo meo!* "Cảm ơn bạn đã vuốt ve, nhưng lát nữa nhớ chia cho tớ miếng cá ngừ trong pantry nha!"',
  '🐱 *Khò khò...* GitCat lim dim đôi mắt, liếm nhẹ mu bàn tay bạn đầy âu yếm.'
];

/**
 * Lấy ngẫu nhiên phản ứng vuốt ve của GitCat
 */
export function getRandomGitCatReaction(): string {
  return GITCAT_REACTIONS[Math.floor(Math.random() * GITCAT_REACTIONS.length)];
}

