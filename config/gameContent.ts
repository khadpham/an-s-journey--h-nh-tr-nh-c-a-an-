import { StoryPart, InventoryItem } from '../types/index';

export const STORY: StoryPart[] = [
    { id: 'intro', type: 'text', part: 'MỞ ĐẦU', title: 'Lời Nhắn Từ Quá Khứ', text: 'An, con trai yêu quý của ta. Nếu con đọc được những dòng này, có lẽ ta đã không còn ở bên con. Hắc Pháp Sư Muội Than - kẻ thù truyền kiếp của Hoàng Gia - đã trỗi dậy và bắt cóc ta để chiếm đoạt bí mật về Thời Gian. Ta đã kịp giấu Cây Đèn Chân Lý vào gói bưu phẩm này. Nó không chỉ là một công cụ, mà là người dẫn đường. Hãy lắng nghe tiếng nói của ánh sáng, nó sẽ chỉ cho con con đường cứu ta và cả Vương Quốc Logic. Hãy dũng cảm lên, con trai!', rules: undefined },
    
    { 
        id: 'c1', 
        type: 'game', 
        game: 'switches', 
        part: 'PHẦN 1: KHỞI ĐẦU', 
        title: 'Chương 1: Căn Nhà Gỗ', 
        text: 'Theo chỉ dẫn của ngọn đèn, An tìm đến căn nhà gỗ bìa rừng nơi người bạn trung thành của cha - Chú Chó Vàng - đang bị giam giữ. Căn phòng tối om, chỉ có một lồng năng lượng nhiệt đang nhốt Chú Chó. Để phá lồng, An cần tìm đúng công tắc kích hoạt trong 4 công tắc trên tường. Ngọn đèn thì thầm: "Ánh sáng không phải là tất cả, hãy cảm nhận hơi ấm còn vương lại..."', 
        hint: 'Bóng đèn dây tóc không chỉ phát ra ánh sáng, nó còn tỏa nhiệt. Trạng thái "Tắt" chỉ có nghĩa là hiện tại không có điện, không có nghĩa là nó chưa từng hoạt động.', 
        hint2: 'Gâu! Cánh cửa phòng lạnh ngắt, nhưng tớ ngửi thấy mùi khét của hơi nóng từ bên trong...', 
        guide: 'Đừng vội mở cửa. Hãy tận dụng thời gian chờ bên ngoài để tạo ra sự khác biệt giữa các bóng đèn, ngay cả khi chúng đã bị tắt.', 
        math: 'Biến số ẩn: Nhiệt độ (T). Ta có 4 trạng thái cần phân biệt (Đèn 1, 2, 3, 4) nhưng chỉ có 1 lần quan sát. Cần kết hợp trạng thái nhị phân (On/Off) với biến thiên nhiệt độ (Hot/Cold).', 
        rules: '<p>1. Có 4 công tắc (A, B, C, D) <strong>bên ngoài</strong> và 4 bóng đèn (1, 2, 3, 4) <strong>bên trong phòng kín</strong>.</p><p>2. Bạn có thể BẬT/TẮT các công tắc bên ngoài tùy ý.</p><p>3. Nhấn nút "⏱️ Chờ 10 phút" để mô phỏng việc chờ các đèn đang BẬT nóng lên.</p><p>4. <strong>QUAN TRỌNG:</strong> Bạn chỉ được phép mở cửa "🚪 Vào Phòng" <strong>ĐÚNG 1 LẦN</strong>. Một khi đã vào, bạn không thể quay ra chỉnh lại công tắc.</p><p>5. <strong>Nhiệm vụ:</strong> Khi vào phòng, hãy quan sát trạng thái (Sáng/Tối) và nhiệt độ (Nóng/Lạnh) để tìm ra công tắc nào nối với đèn nào.</p>' 
    },
    
    { 
        id: 'c2', 
        type: 'game', 
        game: 'jugs', 
        part: 'PHẦN 1: KHỞI ĐẦU', 
        title: 'Chương 2: Suối Dầu Cạn', 
        text: 'Giải cứu thành công, Chú Chó Vàng dẫn An đến một suối dầu cạn. Tại đó, Robo Tin-Tin - hộ vệ khổng lồ của cha - đang nằm bất động vì cạn kiệt năng lượng. Lõi năng lượng của Tin-Tin yêu cầu nạp chính xác 4 Lít dầu để tái khởi động. An chỉ tìm thấy 3 chiếc bình rỗng với dung tích 8L, 5L và 3L. Một giọt cũng không được sai!', 
        hint: 'Quan sát dung tích các bình: 8, 5, và 3. Làm sao để tạo ra sự chênh lệch? Chú ý rằng 5 trừ 3 bằng 2.', 
        hint2: 'Gâu! Nếu đổ đầy bình này rồi rót sang bình kia, phần thừa lại trong bình cũ chính là con số mới!', 
        guide: 'Đừng cố tạo ra số 4 ngay lập tức. Hãy thử tạo ra số 2 trước từ sự chênh lệch giữa bình 5L và 3L.', 
        math: 'Bài toán Đong Nước (Water Pouring Puzzle). Trạng thái đích là 4L. Số học: 4 có thể được biểu diễn thành 2 + 2 hoặc 5 - 1. Hãy tìm cách tạo ra các số hạng đó.', 
        rules: '<p>1. Bạn có 3 bình chứa với dung tích tối đa là 8L, 5L và 3L. Ban đầu bình 8L đầy, 2 bình kia rỗng.</p><p>2. <strong>Cách chơi:</strong> Nhấn vào một bình để chọn làm nguồn, sau đó nhấn vào bình khác để đổ dầu sang.</p><p>3. Dầu sẽ được đổ cho đến khi bình nguồn cạn HOẶC bình đích đầy.</p><p>4. <strong>Nhiệm vụ:</strong> Tạo ra chính xác 4 Lít dầu trong bất kỳ bình nào.</p>' 
    },
    
    { 
        id: 'c3', 
        type: 'game', 
        game: 'graph', 
        part: 'PHẦN 1: KHỞI ĐẦU', 
        title: 'Chương 3: Cổng Đá Cổ Đại', 
        text: 'Với sự gia nhập của Tin-Tin, cả nhóm tiến sâu vào rừng và bị chặn lại bởi một Cổng Đá Cổ Đại khổng lồ. Giáo Sư Gấu - nhà nghiên cứu cổ ngữ - đang loay hoay trước cổng. "Cổng này phong ấn bằng một hình vẽ sao," Giáo Sư nói, "Để mở nó, ta phải dùng năng lượng của đèn vẽ lại toàn bộ hình ngôi sao này bằng một nét bút liền mạch, không được nhấc tay và không được vẽ lại đường đã đi."', 
        hint: 'Hãy đếm số đường nối tại mỗi điểm nút. Có những điểm nối với số lượng đường chẵn (2, 4...), nhưng có những điểm nối với số lượng đường lẻ (3, 5...).', 
        hint2: 'Gâu! Tớ thử bắt đầu chạy từ mấy điểm ở giữa nhưng toàn bị kẹt đường cụt. Hay là mình thử bắt đầu từ mấy điểm dưới cùng xem sao?', 
        guide: 'Quy tắc "Vào và Ra": Nếu bạn đi vào một điểm, bạn cần một đường khác để đi ra. Điểm nào có số đường lẻ thì sẽ là ngoại lệ (Điểm bắt đầu hoặc Điểm kết thúc).', 
        math: 'Định lý Euler về đường đi (Eulerian Path): Một đồ thị chỉ vẽ được bằng một nét liền nếu nó có đúng 0 hoặc 2 đỉnh bậc lẻ. Hãy bắt đầu vẽ từ một trong các đỉnh bậc lẻ đó.', 
        rules: '<p>1. Bạn cần vẽ lại hình ngôi sao trên cổng đá.</p><p>2. <strong>Cách chơi:</strong> Nhấn vào một điểm (node) để bắt đầu. Sau đó nhấn vào các điểm kề nhau để di chuyển.</p><p>3. <strong>Luật:</strong> Bạn phải đi qua TẤT CẢ các đường nối (cạnh) màu xám đúng 1 lần duy nhất.</p><p>4. Nếu đi sai hoặc hết đường, nhấn nút "↺ Reset" để làm lại.</p>' 
    },
    
    { 
        id: 'c4', 
        type: 'game', 
        game: 'river', 
        part: 'PHẦN 2: HÀNH TRÌNH', 
        title: 'Chương 4: Cây Cầu Đứt Gãy', 
        text: 'Cổng đá mở ra một vực thẳm. Cây cầu treo duy nhất đã bị đứt gãy, chỉ hiện ra lờ mờ dưới ánh sáng của Cây Đèn Chân Lý. Một Lữ Khách Bí Ẩn xuất hiện và xin đi nhờ. Ngọn đèn cảnh báo năng lượng chỉ còn đủ chiếu sáng trong 29 giây. Cả nhóm phải qua cầu trước khi bóng tối nuốt chửng tất cả. Nhưng cây cầu chỉ chịu được tối đa 2 người một lúc, và bắt buộc phải có người cầm đèn để soi đường.', 
        hint: 'Thời gian di chuyển phụ thuộc vào người đi chậm nhất trong nhóm. Nếu người nhanh đi cùng người chậm, tốc độ của người nhanh sẽ bị lãng phí.', 
        hint2: 'Gâu! Tớ chạy nhanh nhất (1s), để tớ cầm đèn chạy đi chạy lại cho! Nhưng mà... Gấu với Robo đi chậm quá, tớ đợi mỏi cả chân.', 
        guide: 'Hãy thử gom những người đi chậm nhất (Gấu & Robo) đi cùng nhau một lượt để "gói" thời gian chậm chạp của họ lại, tránh việc từng người làm mất thời gian riêng lẻ.', 
        math: 'Bài toán Tối ưu hóa (Optimization). Chiến thuật Greedy (Tham lam - luôn dùng người nhanh nhất để đưa đèn về) không phải lúc nào cũng tối ưu. Cần tối thiểu hóa tổng "chi phí" thời gian của các lượt đi chậm.', 
        rules: '<p>1. <strong>Mục tiêu:</strong> Đưa tất cả 5 thành viên (Chó, An, Khách, Gấu, Robo) qua bờ phải trong vòng 29 giây.</p><p>2. <strong>Tốc độ:</strong> Chó(1s), An(3s), Khách(6s), Gấu(8s), Robo(12s).</p><p>3. <strong>Luật đi:</strong><br>- Tối đa 2 người lên cầu một lượt.<br>- Phải có người cầm đèn (🏮) mới được đi.<br>- Thời gian đi tính theo người chậm nhất trong lượt đó.</p><p>4. <strong>Cách chơi:</strong> Nhấn vào nhân vật để đưa lên/xuống đèn. Nhấn nút "BĂNG QUA" (hoặc nút tròn "ĐI") để di chuyển.</p>' 
    },
    
    { 
        id: 'c5', 
        type: 'game', 
        game: 'cat', 
        part: 'PHẦN 2: HÀNH TRÌNH', 
        title: 'Chương 5: Sự Phản Bội', 
        text: 'Ngay khi qua cầu an toàn, Lữ Khách Bí Ẩn cười nham hiểm và hiện nguyên hình là Hắc Pháp Sư Muội Than! Hắn giật lấy mảnh bản đồ từ tay An rồi biến mất vào khu rừng ma thuật. Khu rừng này có 5 bụi cây lượng tử, và hắn chỉ có thể lẩn trốn trong đó. Hắn có thói quen kỳ lạ: mỗi khi bạn kiểm tra một hộp, hắn bắt buộc phải nhảy sang một hộp ngay bên cạnh.', 
        hint: 'Hãy chú ý đến màu sắc (hoặc số chẵn lẻ) của các hộp. Nếu hắn đang ở hộp số 2 (Chẵn), sau khi nhảy hắn buộc phải sang hộp 1 hoặc 3 (Lẻ).', 
        hint2: 'Gâu! Tớ vừa thấy hắn ở hộp số 2. Lần tới hắn chắc chắn không ở hộp số 2 hay số 4 đâu, mà phải ở một hộp Lẻ!', 
        guide: 'Đừng đoán mò. Hãy dùng một lượt kiểm tra ở giữa để xác định hoặc dồn hắn về một phía. Nếu không thấy hắn, ta có thể loại trừ một nửa khả năng.', 
        math: 'Tính chẵn lẻ (Parity). Vị trí của mục tiêu luôn đảo chiều (Chẵn -> Lẻ -> Chẵn) sau mỗi lượt. Kiểm tra theo chuỗi tăng dần (2, 3, 4...) có thể dồn mục tiêu vào góc chết.', 
        rules: '<p>1. Hắc Pháp Sư trốn trong 1 trong 5 hộp (đánh số 1-5).</p><p>2. <strong>Mỗi lượt</strong>, bạn được phép chọn mở 1 hộp để kiểm tra.</p><p>3. <strong>Sau mỗi lần kiểm tra</strong>, hắn SẼ di chuyển sang hộp liền kề (VD: từ 2 sang 1 hoặc 3).</p><p>4. <strong>Nhiệm vụ:</strong> Tìm ra vị trí chính xác của hắn trong tối đa 10 lần thử.</p>' 
    },
    
    { 
        id: 'c6', 
        type: 'game', 
        game: 'spider', 
        part: 'PHẦN 2: HÀNH TRÌNH', 
        title: 'Chương 6: Vây Bắt Nhện Máy', 
        text: 'Bị dồn vào đường cùng, Hắc Pháp Sư triệu hồi một con Nhện Máy Khổng Lồ để chặn đường rồi tiếp tục bỏ chạy. Con nhện di chuyển cực nhanh trên mạng lưới của nó. An phải sử dụng khả năng của Cây Đèn để xâm nhập vào hệ thống radar, điều khiển các điểm nút trên mạng nhện để vây bắt và vô hiệu hóa con quái vật này trước khi nó trốn thoát.', 
        hint: 'Con nhện luôn cố gắng di chuyển ra xa bạn nhất có thể. Nếu bạn chỉ đuổi theo cái đuôi của nó, bạn sẽ không bao giờ bắt được.', 
        hint2: 'Gâu! Đừng chạy theo nó! Hãy chạy chặn đầu ở mấy cái giao lộ lớn ấy!', 
        guide: 'Hãy chiếm lĩnh các điểm trung tâm (các điểm có nhiều đường nối) trước. Khi bạn kiểm soát trung tâm, không gian di chuyển của nhện sẽ bị thu hẹp.', 
        math: 'Lý thuyết Đồ thị (Graph Theory). Để bắt được mục tiêu trong không gian hữu hạn, hãy giảm bớt bậc tự do (degrees of freedom) của nó bằng cách chiếm các đỉnh có tính kết nối cao (High Centrality).', 
        rules: '<p>1. Bạn điều khiển điểm màu Xanh (🔵), Nhện là điểm màu Hồng (🔴).</p><p>2. <strong>Cách chơi:</strong> Nhấn vào các điểm nút lân cận (có đường nối màu trắng) để di chuyển.</p><p>3. <strong>Luật:</strong><br>- Bạn đi trước 1 bước, Nhện đi sau 1 bước.<br>- Nhện sẽ luôn cố gắng di chuyển ra xa bạn nhất có thể.</p><p>4. <strong>Nhiệm vụ:</strong> Bắt được Nhện (di chuyển vào cùng vị trí) trong tối đa 15 bước đi của bạn.</p>' 
    },
    
    { 
        id: 'c7', 
        type: 'game', 
        game: 'horses', 
        part: 'PHẦN 3: ĐỈNH CAO', 
        title: 'Chương 7: Triệu Hồi Rồng', 
        text: 'Vượt qua Nhện Máy, cả nhóm đến được chân Tòa Tháp Thời Gian. Cầu thang đã bị phá hủy. Cách duy nhất để lên đỉnh là nhờ sự trợ giúp của loài Rồng. Tại Trại Rồng gần đó, có 25 con rồng đang ngủ say. An cần đánh thức 3 con rồng nhanh nhất để đưa mọi người lên đỉnh tháp. Không có thiết bị đo thời gian, An chỉ có thể tổ chức các cuộc đua giữa chúng để xác định thứ hạng.', 
        hint: 'Chúng ta không cần biết thời gian chạy cụ thể. Chúng ta chỉ cần biết con nào nhanh hơn con nào để loại trừ.', 
        hint2: 'Gâu! Mấy con rồng về bét ở các vòng loại thì làm sao mà vô địch được? Loại hết đám chậm chạp đó đi!', 
        guide: 'Hãy tập trung vào những người chiến thắng. Sau khi tìm ra người nhanh nhất của mỗi nhóm, hãy cho họ đua với nhau. Đó là cuộc đua của những nhà vô địch.', 
        math: 'Tính chất bắc cầu (Transitive Property): Nếu A > B và B > C thì A > C. Điều này giúp ta loại bỏ C mà không cần đua A với C. Hãy vẽ sơ đồ quan hệ để loại bỏ các nhánh không tiềm năng.', 
        rules: '<p>1. Có 25 con rồng với tốc độ khác nhau (bạn không biết tốc độ cụ thể).</p><p>2. Đường đua chỉ cho phép tối đa 5 con rồng chạy cùng lúc.</p><p>3. Sau mỗi cuộc đua, bạn chỉ biết thứ tự về đích (nhất, nhì, ba...), không biết thời gian.</p><p>4. <strong>Cách chơi:</strong> Bấm chọn 2-5 con rồng từ "Trại Rồng" để đưa chúng lên "Đường Đua", rồi nhấn "ĐUA".</p><p>5. <strong>Nhiệm vụ:</strong> Xác định chính xác 3 con rồng nhanh nhất (theo thứ tự #1, #2, #3) với số lần đua ít nhất (Tối ưu: 7 lần).</p>' 
    },
    
    { 
        id: 'c8', 
        type: 'game', 
        game: 'balls', 
        part: 'PHẦN 3: ĐỈNH CAO', 
        title: 'Chương 8: Trái Tim Thời Gian', 
        text: 'Đỉnh tháp! Cha của An đang bị giam giữ trong một khối pha lê thời gian. Hắc Pháp Sư đã trộn Lõi Thời Gian thật vào 12 quả cầu năng lượng giống hệt nhau. Hắn cười nhạo: "Chỉ có Lõi thật mới phá được pha lê. Nếu chọn sai, cha ngươi sẽ bị kẹt trong dòng thời gian mãi mãi!". Chiếc cân thăng bằng cổ xưa ở giữa phòng là hy vọng duy nhất. An chỉ có 3 lần cân để tìm ra quả cầu chứa Lõi thật và biết nó Nặng hay Nhẹ hơn các quả khác.', 
        hint: 'Chiếc cân có 3 trạng thái: Nghiêng trái, Nghiêng phải, hoặc Cân bằng. Mỗi trạng thái đều mang lại thông tin giúp loại trừ các quả bóng thường.', 
        hint2: 'Gâu! Đừng cân lắt nhắt 1-2 quả. Hãy đặt thật nhiều lên! Nếu cân thăng bằng thì ta loại được cả đống bóng luôn!', 
        guide: 'Nếu lần cân đầu tiên thăng bằng, bóng giả nằm ở nhóm chưa cân. Nếu cân bị lệch, bóng giả nằm trên cân. Lần cân thứ 2 là quan trọng nhất: hãy thử tráo đổi các bóng nghi vấn với bóng chuẩn để xem cân có đổi chiều không.', 
        math: 'Cây quyết định (Decision Tree). Mỗi lần cân chia không gian mẫu thành 3 nhánh. Với 3 lần cân, ta có thể phân biệt tối đa 3^3 = 27 trường hợp. Bài toán có 24 trường hợp (12 bóng x 2 trạng thái Nặng/Nhẹ), nên hoàn toàn khả thi.', 
        rules: '<p>1. Có 12 quả cầu (đánh số 1-12). Một quả là giả (khác khối lượng), 11 quả còn lại là thật (cùng khối lượng).</p><p>2. Bạn có một chiếc cân thăng bằng và được phép cân tối đa 3 lần.</p><p>3. <strong>Cách chơi:</strong><br>- Nhấn chọn "Đĩa Trái" hoặc "Đĩa Phải".<br>- Nhấn vào các quả bóng để đặt lên đĩa cân đã chọn.<br>- Nhấn "⚖️ CÂN NGAY" để xem kết quả (Trái nặng, Phải nặng, hoặc Cân bằng).</p><p>4. <strong>Nhiệm vụ:</strong> Sau 3 lần cân, xác định chính xác quả bóng nào là giả và nó Nặng hay Nhẹ hơn bóng thật.</p>' 
    }
];

export const ITEMS: InventoryItem[] = [
  {id:'glass', icon:'🔍', name:'Kính Lúp', gameId: 'horses'},
  {id:'magnet', icon:'🧲', name:'Nam Châm', gameId: 'balls'}
];

export const COMPANIONS = {
  dog: { name: 'Chó Vàng', icon: '🐕', color: 'text-yellow-500' },
  bear: { name: 'Gấu', icon: '🐻', color: 'text-amber-600' },
  robo: { name: 'Robo', icon: '🤖', color: 'text-cyan-400' }
};