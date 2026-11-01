/**
 * @file dialogueBank.ts
 * @description Kho dữ liệu câu thoại phong phú, dí dỏm và tự nhiên của đội ngũ AI Agent.
 * Bao gồm các chủ đề: Hài hước nghề Dev, Dự báo thời tiết Meme, Tin tức công nghệ hot 2026,
 * Tán gẫu cùng mèo GitCat và Xin vía an lạc tại Đài Sen Bái Phật.
 */

export interface AmbientQuote {
  agentId?: 'agent_1' | 'agent_2' | 'agent_3' | 'agent_4'; // Nova, Axel, Vesper, Kip
  icon: string;
  thought: string;
  chatMessage: string;
}

/**
 * Danh sách câu thoại chung ngẫu nhiên cho toàn văn phòng
 */
export const AMBIENT_QUOTES: AmbientQuote[] = [
  // 🌤️ Thời tiết & Môi trường văn phòng
  {
    icon: '🌤️',
    thought: 'Trời 27°C mát dịu, chill chill gõ phím...',
    chatMessage: 'Dự báo hôm nay trời trong xanh 27°C, rất thích hợp để ngồi máy lạnh húp cà phê ngắm bug bay!'
  },
  {
    icon: '🌧️',
    thought: 'Mưa rơi lất phất ngoài hiên...',
    chatMessage: 'Ngoài trời bắt đầu đổ mưa rồi, ai phơi quần áo thì nhớ rút, còn ai đang code thì... cứ code tiếp đi!'
  },
  {
    icon: '⚡',
    thought: 'Trời sắp giông gió, lưu file ngay!',
    chatMessage: 'Nghe tiếng sấm chớp đùng đùng kìa, anh em bấm Ctrl+S lia lịa kẻo cúp điện hối không kịp!'
  },
  {
    icon: '🍃',
    thought: 'Gió thu se lạnh, khoác thêm áo nào!',
    chatMessage: 'Gió mùa về se lạnh, phòng làm việc ấm cúng thế này chỉ muốn ngồi code tới sáng mai!'
  },

  // 📰 Tin tức công nghệ & Xu hướng 2026
  {
    agentId: 'agent_1', // Nova
    icon: '🤖',
    thought: 'Vừa quét được bài báo AI siêu hot!',
    chatMessage: 'Vừa đọc bài báo quốc tế: AI đã giải được thuật toán thiên niên kỷ nhưng vẫn chào thua khi người dùng bảo "đổi màu logo cho hợp phong thủy"!'
  },
  {
    agentId: 'agent_1', // Nova
    icon: '📈',
    thought: 'Giá cà phê Arabica hôm nay tăng nhẹ...',
    chatMessage: 'Tin vắn tài chính: Giá cà phê tăng 5%, hèn chi sáng nay ngụm cà phê của Axel đắng đót lạ thường!'
  },
  {
    agentId: 'agent_4', // Kip
    icon: '🚀',
    thought: 'Cloud node chạy mượt như lụa!',
    chatMessage: 'Breaking News: Cụm server node-01 vừa đạt kỷ lục 99.999% uptime mà không cần khởi động lại. Bí quyết là nhờ đặt gần tượng Phật!'
  },
  {
    agentId: 'agent_3', // Vesper
    icon: '🛡️',
    thought: 'Tỉ lệ bug hôm nay đạt ngưỡng 0%!',
    chatMessage: 'Báo cáo kiểm toán chất lượng: Tỉ lệ an toàn bảo mật đạt 100%, không phát hiện lỗ hổng SQL Injection nào, công đức vô lượng!'
  },

  // 💻 Hài hước nghề Dev & Đời sống văn phòng
  {
    agentId: 'agent_2', // Axel
    icon: '💻',
    thought: 'Tính năng này không phải lỗi đâu nha!',
    chatMessage: 'Tính năng này trên máy mình chạy ngon ơ, sang máy production mà lỗi thì chắc chắn là do... yếu tố tâm linh!'
  },
  {
    agentId: 'agent_2', // Axel
    icon: '⌨️',
    thought: 'Switch Blue gõ nghe đã tai ghê!',
    chatMessage: 'Bàn phím cơ gõ tanh tách như pháo nổ, nghe giai điệu này là biết chuẩn bị có commit triệu view!'
  },
  {
    agentId: 'agent_3', // Vesper
    icon: '🔍',
    thought: 'Ai lại đặt tên biến là `data_final_final2` thế?',
    chatMessage: 'Vừa review xong một Pull Request: ai đặt tên biến `temp_dung_xoa_nha_123` thì tự giác bước ra thú tội nhận phạt ly trà sữa!'
  },
  {
    agentId: 'agent_4', // Kip
    icon: '☕',
    thought: 'Thèm một ly Americano đá không đường!',
    chatMessage: 'Uống ly cà phê đen đá vào người, cảm giác nhịp tim đồng bộ chuẩn xác với xung nhịp CPU 4.8GHz!'
  },
  {
    icon: '🧋',
    thought: 'Trà sữa 50% đường, 100% bug-free!',
    chatMessage: 'Quán trà sữa đầu ngõ vừa có voucher giảm giá 40%, ai ké đơn trà sữa nướng trân châu hoàng kim hông?'
  },
  {
    icon: '🍕',
    thought: 'Hôm nay tăng ca có ai bao pizza không?',
    chatMessage: 'Nghe đồn mùi bánh pizza phô mai thơm lừng sắp xuất hiện tại phòng pantry, có động lực code tiếp rồi!'
  },
  {
    agentId: 'agent_2', // Axel
    icon: '🚀',
    thought: 'Git push force và quay lưng bước đi...',
    chatMessage: 'Gõ `git push --force` rồi quay lưng đi lấy nước, phong thái điềm tĩnh như siêu điệp viên không nhìn vụ nổ đằng sau!'
  },

  // 🙏 Xin vía an lạc tại Đài Sen Bái Phật
  {
    icon: '🙏',
    thought: 'Tâm bất biến giữa dòng đời vạn bug!',
    chatMessage: 'Đứng trước kim thân Đức Phật thắp nén hương trầm, tự nhiên thấy lòng thanh thản, mọi conflict merge tự động tiêu tan!'
  },
  {
    icon: '✨',
    thought: 'Linh cảm quẻ xăm đại cát đại lợi!',
    chatMessage: 'Sáng nay xin quẻ xăm đầu ngày: "Công danh tấn tới, Pull Request không vướng conflict nào, sếp duyệt ngay tắp lự"!'
  },
  {
    icon: '🧘',
    thought: 'Hít vào bình an, thở ra giải tỏa stress...',
    chatMessage: 'Hít vào tâm tĩnh lặng, thở ra miệng mỉm cười. Code nhiều bug cũng là cơ duyên để rèn luyện đức tính kiên nhẫn!'
  },

  // 🐱 Tán gẫu cùng mèo GitCat
  {
    icon: '🐾',
    thought: 'GitCat lại nằm ngủ quên lối về...',
    chatMessage: 'GitCat vừa trèo lên nóc thùng máy chủ nằm sưởi ấm, ngủ ngáy khò khò trông cưng xỉu!'
  },
  {
    icon: '😻',
    thought: 'Cho mèo ăn súp thưởng thôi!',
    chatMessage: 'Đề nghị cấp kinh phí mua thêm 5 gói súp thưởng cá ngừ cho GitCat vì thành tích tuần tra văn phòng nghiêm túc!'
  },
  {
    icon: '📦',
    thought: 'Mèo chê nệm êm, chỉ thích thùng giấy!',
    chatMessage: 'Mua cái nệm sofa nhung xịn xò 500k, kết quả con mèo GitCat nó nhảy tọt vào cái thùng các-tông đựng vỏ bàn phím nằm ngủ!'
  }
];

/**
 * Lời thoại ngẫu nhiên của GitCat khi được người dùng vuốt ve
 */
export const GITCAT_REACTIONS = [
  '😻 *Meow meow... purr purr!* GitCat dụi đầu vào tay bạn làm nũng, chúc bạn một ngày code không lỗi lầm!',
  '🐾 *Meo~* GitCat phe phẩy cái đuôi cam, nằm lăn tròn phơi bụng đòi gãi cằm!',
  '✨ *Purrrr...* GitCat trao cho bạn ánh mắt lấp lánh: "Đã truyền buff may mắn cho bạn rồi nhé, deploy đi!"',
  '🐟 *Meo meo!* "Cảm ơn bạn đã vuốt ve, nhưng lát nữa nhớ chia cho tớ miếng cá ngừ trong pantry nha!"',
  '🐱 *Khò khò...* GitCat lim dim đôi mắt, liếm nhẹ mu bàn tay bạn đầy âu yếm.'
];

/**
 * Lấy ngẫu nhiên một câu thoại hài hước
 */
export function getRandomAmbientQuote(specificAgentId?: string): AmbientQuote {
  let pool = AMBIENT_QUOTES;
  if (specificAgentId) {
    const matched = AMBIENT_QUOTES.filter((q) => !q.agentId || q.agentId === specificAgentId);
    if (matched.length > 0) pool = matched;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Lấy ngẫu nhiên phản ứng vuốt ve của GitCat
 */
export function getRandomGitCatReaction(): string {
  return GITCAT_REACTIONS[Math.floor(Math.random() * GITCAT_REACTIONS.length)];
}

