/**
 * @file dialogueBank.ts
 * @description Kho dữ liệu câu thoại phong phú, dí dỏm và chuyên sâu của Ban Lãnh Đạo C-Suite
 * (COO Bác Nam, CFO Bác Thắng, CRO Bác Hoàng) với hơn 40 năm kinh nghiệm F&B & Xuất Nhập Khẩu.
 * Tách biệt rõ ràng:
 * 1. Tin tức thị trường F&B, Logistics và Xuất Nhập Khẩu xác thực (Được phép lặp lại).
 * 2. Câu thoại dí dỏm kinh nghiệm 40 năm thương trường (Cơ chế chống lặp trong ngày).
 * 3. Chuỗi trao đổi công việc nhiệt tình của 3 Giám đốc.
 * 4. Sinh hoạt đời thường: Pha cà phê, cho mèo GitCat ăn, giải lao restroom.
 */

export interface AmbientQuote {
  agentId?: 'agent_coo' | 'agent_cfo' | 'agent_cro' | string;
  icon: string;
  thought: string;
  chatMessage: string;
  category?: 'meme' | 'verified_news' | 'work' | 'routine';
}

/**
 * 📰 TIN TỨC THỊ TRƯỜNG F&B & XUẤT NHẬP KHẨU XÁC THỰC (Được phép lặp lại nhiều lần)
 */
export const VERIFIED_TECH_NEWS: AmbientQuote[] = [
  {
    agentId: 'agent_coo', // Bác Nam - COO
    icon: '🚢',
    thought: 'Cước vận tải biển tuyến Á - Mỹ & Chỉ số Freightos...',
    chatMessage: 'Bản tin Logistics: Giá cước container lạnh 40ft tuyến Cát Lái - Los Angeles hiện dao động quanh mốc $3,200/FEU, thời gian transit chuẩn 21-24 ngày.',
    category: 'verified_news'
  },
  {
    agentId: 'agent_cfo', // Bác Thắng - CFO
    icon: '💹',
    thought: 'Tỷ giá USD/VND liên ngân hàng & Biểu phí L/C...',
    chatMessage: 'Bản tin Tài chính: Tỷ giá trung tâm USD/VND giữ quanh vùng 25,450. Các doanh nghiệp F&B xuất khẩu tận dụng tốt kỳ hạn Forward hợp đồng tương lai phòng hộ rủi ro FX.',
    category: 'verified_news'
  },
  {
    agentId: 'agent_cro', // Bác Hoàng - CRO
    icon: '🛡️',
    thought: 'Quy chuẩn kiểm dịch FDA & Cảnh báo an toàn RASFF...',
    chatMessage: 'Bản tin Pháp lý XNK: Liên minh Châu Âu EU vừa cập nhật tiêu chuẩn dư lượng thuốc BVTV đối với mặt hàng nông sản xuất khẩu theo hiệp định EVFTA.',
    category: 'verified_news'
  },
  {
    agentId: 'agent_coo', // Bác Nam - COO
    icon: '❄️',
    thought: 'Dung tích kho lạnh ngoại quan tại Long An & Hải Phòng...',
    chatMessage: 'Bản tin Vận hành: Hệ thống kho lạnh tự động ASRS chuẩn -25°C tại khu vực Cái Mép - Thị Vải đạt tỷ lệ lấp đầy 88%, đảm bảo kiểm soát chất lượng hải sản xuất khẩu.',
    category: 'verified_news'
  },
  {
    agentId: 'agent_cfo', // Bác Thắng - CFO
    icon: '📊',
    thought: 'Biên lợi nhuận ròng EBITDA ngành chuỗi nhà hàng...',
    chatMessage: 'Báo cáo F&B: Biên lợi nhuận gộp ngành F&B chuỗi đạt trung bình 62-65%, trong khi chi phí giá vốn COGS nguyên vật liệu biến động nhẹ trong quý này.',
    category: 'verified_news'
  },
  {
    agentId: 'agent_cro', // Bác Hoàng - CRO
    icon: '⚖️',
    thought: 'Cập nhật Incoterms 2020 & Bảo hiểm ICC (A)...',
    chatMessage: 'Khuyến cáo Rủi ro: Doanh nghiệp xuất khẩu F&B nên ưu tiên điều kiện CIF kèm điều khoản bảo hiểm tổn thất mọi rủi ro ICC loại A để tránh tranh chấp hải trình.',
    category: 'verified_news'
  }
];

/**
 * ☕ CÂU THOẠI HÀI HƯỚC & KINH NGHIỆM 40 NĂM THƯƠNG TRƯỜNG (Lọc chống lặp trong ngày)
 */
export const DEV_MEME_QUOTES: AmbientQuote[] = [
  {
    agentId: 'agent_coo', // Bác Nam
    icon: '⚓',
    thought: '40 năm ăn sóng nói gió ở các cảng biển...',
    chatMessage: 'Bác Nam 40 năm lăn lộn từ cảng Sài Gòn tới Rotterdam, container lạnh chỉ cần đứt điện 2 tiếng là bác ngửi mùi biết ngay!',
    category: 'meme'
  },
  {
    agentId: 'agent_cfo', // Bác Thắng
    icon: '💼',
    thought: 'Dòng tiền dương là vua, lợi nhuận chỉ là ảo ảnh...',
    chatMessage: 'Bác Thắng 40 năm tài chính nghiệm ra: Doanh nghiệp không chết vì lỗ, doanh nghiệp chỉ chết vì cạn dòng tiền mặt thanh toán L/C thôi!',
    category: 'meme'
  },
  {
    agentId: 'agent_cro', // Bác Hoàng
    icon: '🧐',
    thought: 'Nhìn đâu cũng thấy rủi ro tiềm ẩn...',
    chatMessage: 'Bác Hoàng 40 năm soi hợp đồng ngoại thương: Đối tác mà hứa hẹn "bao trọn gói thủ tục bên kia" là 99% ăn quả phạt lưu bãi Demurrage!',
    category: 'meme'
  },
  {
    agentId: 'agent_coo', // Bác Nam
    icon: '☕',
    thought: 'Làm ly cà phê phin đậm đặc lấy sức chiến tiếp...',
    chatMessage: 'Uống ly cà phê phin đậm đặc, mắt sáng rực để rà soát lại từng seal container chuẩn bị xuất qua Nhật!',
    category: 'meme'
  },
  {
    agentId: 'agent_cfo', // Bác Thắng
    icon: '🧾',
    thought: 'Biên lợi nhuận ròng phải đạt tối thiểu 15%...',
    chatMessage: 'Thương vụ nào mà biên lợi nhuận ròng dưới 12% thì thôi, để tiền gửi tiết kiệm còn ngủ ngon hơn cày ngày cày đêm!',
    category: 'meme'
  },
  {
    agentId: 'agent_cro', // Bác Hoàng
    icon: '📜',
    thought: 'HACCP và ISO 22000 là kim bài miễn tử...',
    chatMessage: 'Chưa có chứng nhận HACCP và kiểm định xuất xứ C/O Form D/E mà đòi book tàu đi châu Âu là cầm chắc vé quay đầu xe!',
    category: 'meme'
  },
  {
    icon: '🐱',
    thought: 'GitCat lại đòi ăn cá ngừ đại dương...',
    chatMessage: 'Mèo GitCat hôm nay chê pate thường, đòi ăn cá ngừ ngâm dầu chuẩn xuất khẩu Nhật Bản mới chịu phơi bụng!',
    category: 'meme'
  }
];

/**
 * 💼 CHUỖI ĐỐI THOẠI TRAO ĐỔI CÔNG VIỆC NHIỆT TÌNH CỦA BAN GIÁM ĐỐC
 */
export const WORK_COLLABORATION_DIALOGUES = [
  {
    speaker: 'agent_coo', // Bác Nam - COO
    text: 'Ban Giám Đốc chú ý! Có bài toán chiến lược F&B & XNK mới. Tôi đã chuẩn bị dữ liệu chuỗi cung ứng và kho lạnh!',
    icon: '🚢'
  },
  {
    speaker: 'agent_cfo', // Bác Thắng - CFO
    text: 'Tôi đã mở sẵn bảng cân đối dòng tiền, dự toán COGS và phương án thanh toán L/C đối ứng. Sẵn sàng bảo vệ ngân sách!',
    icon: '💼'
  },
  {
    speaker: 'agent_cro', // Bác Hoàng - CRO
    text: 'Hồ sơ pháp lý kiểm dịch, rào cản kỹ thuật TBT và rủi ro điều khoản Incoterms đã sẵn sàng trên bàn làm việc!',
    icon: '⚖️'
  }
];

/**
 * ☕ SINH HOẠT VĂN PHÒNG ĐỜI THƯỜNG
 */
export const OFFICE_ROUTINE_SCRIPTS = {
  coffee: {
    startThought: 'Cần nạp ly cà phê phin đậm đà lấy lại sự tỉnh táo...',
    startSpeech: 'Để bác ghé quầy pha ly Americano nạp caffeine lấy tinh thần rà soát hợp đồng!',
    endThought: 'Cà phê thơm nức mũi, đầu óc minh mẫn hẳn!',
    endSpeech: 'Cà phê hảo hạng! Tinh thần sảng khoái, về bàn họp chiến đấu tiếp cùng anh em!'
  },
  cat: {
    startThought: 'Tới giờ cho GitCat ăn súp thưởng rồi!',
    startSpeech: 'GitCat ơi ra đây bác thưởng cho gói súp thưởng cá hồi Nauy nè cưng! 🐱',
    endThought: 'Mèo ăn sạch bát, ngoan ghê!',
    endSpeech: 'GitCat ăn no nê rồi lăn ra phơi bụng, trông đáng yêu thật!'
  },
  restroom: {
    startThought: 'Ghé restroom rửa mặt giải lao một chút...',
    startSpeech: 'Xin phép hai bác tôi ghé restroom rửa mặt giải lao 30 giây nha!',
    endThought: 'Rửa mặt nước mát, tỉnh táo hơn nhiều!',
    endSpeech: 'Đã rửa mặt refresh tinh thần cực kỳ sảng khoái, quay lại vị trí tiếp tục họp bàn!'
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
  const pickNews = Math.random() < 0.65;

  if (pickNews) {
    let pool = VERIFIED_TECH_NEWS;
    if (specificAgentId) {
      const filtered = pool.filter((q) => !q.agentId || q.agentId === specificAgentId);
      if (filtered.length > 0) pool = filtered;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Chọn câu meme hài hước kèm chống lặp
  let availableIndexes: number[] = [];
  DEV_MEME_QUOTES.forEach((_, idx) => {
    if (!seenMemeIndexes.has(idx)) availableIndexes.push(idx);
  });

  if (availableIndexes.length === 0) {
    seenMemeIndexes.clear();
    availableIndexes = DEV_MEME_QUOTES.map((_, i) => i);
  }

  const chosenIdx = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
  seenMemeIndexes.add(chosenIdx);
  return DEV_MEME_QUOTES[chosenIdx];
}

/**
 * Thoại hài hước từ Tượng Phật
 */
export const BUDDHA_MEME_QUOTES = [
  'Tha thứ cho ngươi là việc của Phật, nhưng tiễn ngươi về gặp Phật là việc của ta! 🙏⚡',
  'Nam Mô A Di Đà Phật, bần tăng khuyên thí chủ nên xuất hàng đúng chuẩn kiểm dịch! 🌸',
  'Phật tại tâm, bug tại tay, cấm có cãi! 📿',
  'Cầu xin Phật ban cho 0% Bug, 100% Green Test và container thông quan trong 1 nốt nhạc! 🌟',
  'Thí chủ gõ mã có tâm, ắt hải quan sẽ mở luồng xanh! 🚢'
];

/**
 * Thoại hài hước từ Thánh Giá
 */
export const CHRISTIAN_MEME_QUOTES = [
  'Người nào xứng đáng, ta sẽ ban Đinh! 🔨',
  'Nhân danh Chúa, ta ban phước lành thanh toán L/C không trễ hạn! ✝️',
  'Đứa nào ký hợp đồng mà không rà soát điều khoản phạt, chuẩn bị lên giá đóng đinh! 🪵',
  'Phúc cho ai không thấy mà tin, nhưng họa cho ai xuất khẩu mà không mua bảo hiểm hàng hải! 📖',
  'Ta đã tha thứ cho mọi lỗi lầm, nhưng hợp đồng ngoại thương thì tuyệt đối KHÔNG! ⚡'
];

/**
 * Phản ứng thảng thốt của từng Agent khi né tránh đinh và tràng hạt
 */
export const DODGE_REACTIONS: Record<string, string[]> = {
  agent_coo: [
    'Bác Nam 40 năm kinh nghiệm vượt bão Cát Lái, mấy cái đinh này tuổi gì làm khó bác! 🏃💨',
    'Tràng hạt Phật giáng thế! Bác Nam cúi rạp người né chuẩn xác từng centimet! 🙈',
    'Chúa ban đinh thiệt kìa! Bác Nam lướt nhẹ qua như thuyền rẽ sóng! 😱'
  ],
  agent_cfo: [
    'Chúa ban đinh thiệt kìa trời ơi! Né đinh nhưng tay vẫn giữ chặt tập báo cáo dòng tiền! 💼😱',
    'Đinh xé gió bay vèo! Bác Thắng bảo toàn 100% vốn liếng và biên lợi nhuận! ⚡',
    'May quá né kịp! Lệch 2cm là rách luôn bộ vest ký hợp đồng ngoại thương! 😂'
  ],
  agent_cro: [
    'Bác Hoàng quản trị rủi ro 40 năm, kịch bản đinh bay này đã tính toán từ trước rồi! 😂',
    'May quá cúi người né đẹp, đúng theo quy trình phòng ngừa rủi ro cấp 1! 🛡️',
    'Tràng hạt bay xoáy kinh vậy! Bác Hoàng né thoát hiểm ngoạn mục trong gang tấc! 📿'
  ],
  // Legacy mappings for safety
  agent_1: ['Bác Nam né đinh nhanh như chớp! 🏃💨'],
  agent_2: ['Bác Thắng cúi đầu né đạn đạo an toàn! ⚡'],
  agent_3: ['Bác Hoàng né rủi ro chuyên nghiệp! 🛡️'],
  agent_4: ['Né trong gang tấc! 🚀']
};

export function getRandomBuddhaMeme(): string {
  return BUDDHA_MEME_QUOTES[Math.floor(Math.random() * BUDDHA_MEME_QUOTES.length)];
}

export function getRandomChristianMeme(): string {
  return CHRISTIAN_MEME_QUOTES[Math.floor(Math.random() * CHRISTIAN_MEME_QUOTES.length)];
}

export function getRandomDodgeReaction(agentId: string): string {
  const list = DODGE_REACTIONS[agentId] || DODGE_REACTIONS.agent_coo;
  return list[Math.floor(Math.random() * list.length)];
}

export const GITCAT_REACTIONS = [
  '😻 *Meow meow... purr purr!* GitCat dụi đầu vào tay bạn làm nũng, chúc phiên họp thành công đại thắng!',
  '🐾 *Meo~* GitCat phe phẩy cái đuôi cam, nằm lăn tròn phơi bụng đòi gãi cằm!',
  '✨ *Purrrr...* GitCat trao cho bạn ánh mắt lấp lánh: "Đã truyền buff may mắn cho cả Ban Giám Đốc rồi nhé!"',
  '🐟 *Meo meo!* "Cảm ơn bạn đã vuốt ve, nhớ nhập khẩu thêm cá ngừ đại dương cho tớ nha!"',
  '🐱 *Khò khò...* GitCat lim dim đôi mắt, liếm nhẹ mu bàn tay bạn đầy âu yếm.'
];

export function getRandomGitCatReaction(): string {
  return GITCAT_REACTIONS[Math.floor(Math.random() * GITCAT_REACTIONS.length)];
}
