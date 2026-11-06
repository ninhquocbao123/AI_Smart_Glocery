from pathlib import Path
import json
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from PIL import Image
R=Path(__file__).resolve().parent.parent; O=R/'output/pdf'; O.mkdir(parents=True,exist_ok=True)
T=R/'tmp/pdfs'; T.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('Arial','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold','C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='ArialBold',italic='Arial',boldItalic='ArialBold')
W,H=595.28,841.89; green=HexColor('#15743E'); ink=HexColor('#183B2A'); gray=HexColor('#53655B')
c=canvas.Canvas(str(O/'Huong-dan-su-dung-AI-Smart-Grocery.pdf'),pagesize=(W,H))
c.setTitle('Hướng dẫn sử dụng AI Smart Grocery'); c.setAuthor('AI Smart Grocery')
style=ParagraphStyle('body',fontName='Arial',fontSize=11,leading=17,textColor=ink,spaceAfter=8)
y=0; page=0
def para(text,size=11,color=ink,bold=False,gap=10):
    global y
    s=ParagraphStyle('p',parent=style,fontName='ArialBold' if bold else 'Arial',fontSize=size,leading=size*1.5,textColor=color)
    p=Paragraph(text,s); _,h=p.wrap(W-92,700)
    if y-h<58: raise ValueError('Page overflow: '+text[:55])
    p.drawOn(c,46,y-h); y-=h+gap
def begin(number,title,kicker='HƯỚNG DẪN NGƯỜI DÙNG'):
    global y,page
    page=number; c.setFillColor(HexColor('#F7F9F3'));c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(green);c.rect(0,H-9,W,9,fill=1,stroke=0)
    c.setFont('ArialBold',10);c.drawString(46,H-42,'AI SMART GROCERY');c.setFont('Arial',9);c.drawRightString(W-46,H-42,kicker)
    y=H-75;para(title,25,green,True,16)
def end():
    c.setStrokeColor(HexColor('#D8E4D7'));c.line(46,49,W-46,49)
    c.setFillColor(gray);c.setFont('Arial',8);c.drawString(46,33,'ai-smart-glocery.vercel.app  |  Cập nhật 17/10/2026');c.drawRightString(W-46,33,f'{page:02d} / 10');c.showPage()
def steps(items):
    for n,t in enumerate(items,1): para(f'<b>{n}.</b> {t}')
cuts=json.loads((R/'video-output/live/cuts.json').read_text())
def shot(label,caption,height=235):
    global y
    cut=next(x for x in cuts if x['label']==label)
    im=Image.open(R/'video-output/live'/f"frame-{cut['end']-10:05d}.png").convert('RGB')
    # Mask the account greeting on Home; never publish contact details.
    if label=='home':
        from PIL import ImageDraw
        ImageDraw.Draw(im).rectangle((180,92,550,130),fill='#F4F8F1')
    width=W-92; h=min(height,width*im.height/im.width); w=h*im.width/im.height
    c.drawImage(ImageReader(im),46+(width-w)/2,y-h,width=w,height=h);y-=h+9
    para(caption,9,gray,gap=14)
begin(1,'HƯỚNG DẪN\nSỬ DỤNG WEBSITE'.replace('\n','<br/>'))
c.drawImage(str(R/'public/images/brand/logo.png'),207,480,width=180,height=180,mask='auto')
y=455;para('BỮA NGON ĐỂ “AI” LO',23,green,True)
para('Từ ngân sách hôm nay đến bữa cơm nhà: chọn món, chuẩn bị nguyên liệu và theo dõi chi tiêu.',13)
para('<b>Website:</b> <link href="https://ai-smart-glocery.vercel.app/" color="#15743E">https://ai-smart-glocery.vercel.app/</link>',11)
para('Dự án môn EXE202 - Đại học FPT',11,gray)
para('Bắt đầu nhanh',15,green,True)
steps(['Tạo tài khoản và đăng nhập.','Chọn số người ăn, nhập ngân sách và tìm thực đơn.','Xem công thức, chọn nguyên liệu cần mua.','Kiểm tra giỏ hàng, người bán và phương thức thanh toán.'])
end()
begin(2,'01. Tài khoản & cách di chuyển')
para('Đăng ký và đăng nhập',16,green,True)
steps(['Mở website, chọn <b>Bắt đầu miễn phí</b> hoặc <b>Tạo tài khoản mới</b>.','Nhập họ tên, email, số điện thoại và địa chỉ giao hàng đầy đủ.','Nhập mật khẩu, sau đó nhập lại đúng mật khẩu ở ô xác nhận; nhấn <b>Đăng ký</b>.','Sau khi đăng ký thành công, dùng email và mật khẩu vừa tạo để đăng nhập.'])
para('Các khu vực chính',16,green,True)
for t in ['<b>Home:</b> nhập ngân sách và số người ăn.','<b>Smart Cart:</b> khám phá danh mục món Việt và mở công thức.','<b>Giỏ hàng:</b> biểu tượng giỏ phía trên; chọn nguyên liệu sẽ mua.','<b>Deals:</b> tham khảo ưu đãi nguyên liệu đang hiển thị.','<b>My Budget:</b> xem ngân sách và chi tiêu theo tháng.','<b>Orders:</b> theo dõi trạng thái đơn và mua lại.','<b>Profile / ảnh đại diện:</b> sửa hồ sơ, khẩu vị, ngân sách mục tiêu và đăng xuất.']: para(t,gap=7)
para('Trên điện thoại, các mục điều hướng nằm ở thanh bên dưới. Nếu quên mật khẩu, chọn “Quên mật khẩu?” và liên hệ quản trị viên theo hướng dẫn trên trang.',10,gray)
end()
begin(3,'02. Tìm món theo ngân sách')
shot('home','Giao diện Home: chọn số người và ngân sách dự kiến cho bữa ăn.')
steps(['Điều chỉnh <b>Số người ăn</b> bằng nút + / - hoặc nhập số người.','Nhập ngân sách, ví dụ <b>50.000đ</b>; có thể chọn nhanh 50K, 100K, 150K hoặc 200K.','Nhấn <b>Tìm thực đơn</b> và chờ danh sách gợi ý.','Chọn cửa hàng tham khảo, sắp xếp theo chi phí thấp nhất hoặc thời gian nấu; bấm món muốn xem.'])
para('<b>Hiểu đúng giá:</b> mỗi món trong kết quả là một lựa chọn riêng phù hợp ngân sách, không phải tổng giá của cả danh sách. Phí giao hàng được tính ở bước đặt đơn.',11)
para('Nếu cửa hàng chưa có đủ bảng giá, phần tìm món có thể dùng giá công thức và ghi rõ giá tham khảo. Giá, tồn kho và phí giao cần được kiểm tra lại khi đặt hàng.',10,gray)
end()
begin(4,'03. Xem món & cùng vào bếp')
shot('recipe','Trang chi tiết món: ảnh thành phẩm, khẩu phần và chi phí nguyên liệu.')
steps(['Mở một món từ gợi ý hoặc <b>Smart Cart</b>. Trong danh mục, có thể tìm theo tên món/nguyên liệu và lọc món nấu trong 30 phút.','Điều chỉnh khẩu phần. Đọc lượng dùng, quy cách mua và các gia vị cần chuẩn bị thêm.','Đánh dấu nguyên liệu đã có trong bếp để bỏ khỏi danh sách mua.','Đọc <b>Cùng vào bếp</b>: làm theo thứ tự, thời gian, mức lửa và dấu hiệu đạt; đánh dấu bước đã hoàn thành.','Nhấn <b>Thêm nguyên liệu vào giỏ</b> nếu cần mua phần còn thiếu.'])
para('Lượng dùng để nấu có thể khác số lượng phải mua theo gói/phần. Thời gian nấu là ước lượng; kiểm tra độ chín thực tế theo hướng dẫn món.',10,gray)
end()
begin(5,'04. Giỏ hàng & chọn món mua')
shot('cart-two','Nguyên liệu được chia theo từng món, giúp chọn mua riêng hoặc mua chung.')
steps(['Mở biểu tượng giỏ hàng. Kiểm tra tên món và nguyên liệu trong từng nhóm.','Tích nhóm món muốn mua hoặc dùng <b>Chọn tất cả</b>.','Điều chỉnh số lượng; dùng nút xóa cạnh nguyên liệu nếu không cần mua.','Kiểm tra số nhóm đã chọn và tổng tiền tạm tính.','Nhấn <b>Tiếp tục với món đã chọn</b> để đến bước xác nhận đơn.'])
para('<b>Lưu ý:</b> các nhóm được chọn sẽ gộp vào một đơn thanh toán. Món chưa chọn vẫn ở trong giỏ. Tiền tạm tính nguyên liệu chưa bao gồm phí giao.',11)
para('Muốn bổ sung món khác, chọn “+ Thêm món ăn”. Muốn tìm nguyên liệu ưu đãi, mở “Xem ưu đãi” hoặc trang Deals.',10,gray)
end()
begin(6,'05. Đặt hàng & thanh toán payOS')
shot('checkout','Bước đặt hàng: kiểm tra tổng tiền và chọn QR ngân hàng qua payOS.')
steps(['Chọn điểm bán đang nhận đơn. Kiểm tra <b>người bán, khu vực giao hàng, giá nguyên liệu và phí giao</b>.','Điền số điện thoại và địa chỉ giao hàng đầy đủ, chính xác.','Chọn <b>QR ngân hàng · payOS</b>, sau đó nhấn <b>Đặt đơn hàng</b>.','Tại trang thanh toán, đối chiếu số tiền, người nhận và nội dung chuyển khoản; dùng ứng dụng ngân hàng để quét QR.','Sau khi chuyển tiền, chờ hệ thống xác nhận. Nếu cần, dùng nút kiểm tra thanh toán và xem lại trong <b>Orders</b>.'])
para('<b>Chỉ xem là đã thanh toán khi website xác nhận.</b> Việc quay lại website không tự chứng minh giao dịch đã thành công. Nếu đã bị trừ tiền mà trạng thái chưa cập nhật, kiểm tra đơn cũ và liên hệ quản trị; không vội thanh toán lần nữa.',10,gray)
end()
begin(7,'06. Theo dõi đơn & chi tiêu')
shot('budget','My Budget hiển thị ngân sách mục tiêu, số đã chi và phần còn lại theo tháng.')
para('Orders - đơn hàng của bạn',15,green,True)
steps(['Chọn bộ lọc như Chưa thanh toán, Chờ chuẩn bị, Đang giao, Đã giao hoặc Hoàn thành.','Mở <b>Chi tiết</b> để xem nguyên liệu và phí giao. Đơn chưa trả có thể hiện nút thanh toán hoặc kiểm tra thanh toán.','Dùng <b>Mua lại</b> để đưa nguyên liệu về giỏ, rồi kiểm tra lại giá và số lượng. Chỉ xác nhận đã nhận hàng khi thực sự nhận được.'])
para('My Budget - quản lý theo tháng',15,green,True)
para('Chọn tháng cần xem, đối chiếu ngân sách mục tiêu, số đã chi và lịch sử mua sắm. Nhấn <b>Đổi ngân sách mục tiêu</b> để cập nhật tại hồ sơ. Đơn mới tạo hoặc chưa được xác nhận thu tiền có thể chưa xuất hiện trong chi tiêu.',11)
end()
begin(8,'07. Ưu đãi, trợ lý & hồ sơ')
para('Deals - tham khảo nguyên liệu giảm giá',16,green,True)
steps(['Mở Deals, tìm thực phẩm hoặc lọc theo cửa hàng.','Đọc giá và thông tin ưu đãi đang hiển thị, chọn thêm vào giỏ nếu phù hợp.','Nếu trang báo chưa có ưu đãi, thử bỏ bộ lọc hoặc quay lại sau khi nhóm cập nhật.'])
para('Trợ lý bữa ăn',16,green,True)
steps(['Bấm biểu tượng trò chuyện ở góc dưới màn hình.','Chọn câu hỏi gợi ý hoặc nhập câu hỏi, ví dụ “Cách nấu canh bí xanh?” hay “My Budget hoạt động thế nào?”.','Đọc trả lời, mở liên kết món ăn khi cần xem công thức đầy đủ.'])
para('Trợ lý có thể trả lời từ công thức/hướng dẫn có sẵn hoặc dịch vụ AI tùy cấu hình. Không gửi mật khẩu, OTP hoặc thông tin thẻ vào cuộc trò chuyện.',10,gray)
para('Hồ sơ cá nhân',16,green,True)
para('Mở ảnh đại diện hoặc Profile. Cập nhật họ tên, số điện thoại, địa chỉ, chế độ ăn, nguyên liệu cần tránh và ngân sách tháng; nhấn lưu. Khi dùng máy chung, chọn <b>Đăng xuất</b> sau khi hoàn tất.',11)
end()
begin(9,'08. Xử lý tình huống thường gặp')
for title,body in [
('Không đăng ký hoặc đăng nhập được','Kiểm tra email, mật khẩu và mật khẩu xác nhận. Điền đủ số điện thoại, địa chỉ. Nếu đã có tài khoản, dùng trang đăng nhập; quên mật khẩu thì liên hệ quản trị.'),
('Không có món phù hợp','Kiểm tra ngân sách, số người và chế độ ăn/nguyên liệu cần tránh trong hồ sơ. Thử tăng ngân sách hoặc giảm khẩu phần. Nếu có thông báo lỗi tải dữ liệu, tải lại trang và thử lại.'),
('Cửa hàng chưa nhận đơn hoặc thiếu tồn kho','Chọn điểm bán khác nếu có. Nếu vẫn bị chặn, liên hệ quản trị để kiểm tra trạng thái nhận đơn, giá và tồn kho; đổi ngân sách không giải quyết được lỗi cấu hình cửa hàng.'),
('payOS chưa sẵn sàng hoặc QR không hiện','Kiểm tra thông báo trên trang. Nếu đơn đã được tạo, vào Orders mở lại thanh toán của đơn đó. Nếu phương thức bị vô hiệu hóa, quản trị cần kiểm tra cấu hình thanh toán.'),
('Đã chuyển tiền nhưng đơn còn chờ','Dùng kiểm tra thanh toán, đối chiếu giao dịch trong ứng dụng ngân hàng và gửi mã đơn cho quản trị. Không gửi khóa API, mật khẩu hoặc OTP; tránh tạo đơn và chuyển tiền trùng.'),
('Chưa thấy dữ liệu chi tiêu','Chọn đúng tháng; kiểm tra trạng thái thanh toán của đơn. Ngân sách mục tiêu là số bạn đặt trong hồ sơ, không phải số dư tài khoản ngân hàng.')]:
    para(title,13,green,True,gap=4);para(body,10.5,gap=15)
end()
begin(10,'Phụ lục. Dành cho quản trị viên','QUẢN TRỊ')
para('Tài khoản cần được cấp quyền quản trị. Sau đăng nhập, giao diện quản trị có hai mục chính: <b>Quản trị</b> và <b>Lịch sử thanh toán</b>.',11)
para('Quản lý món ăn',16,green,True)
steps(['Mở Quản trị, tìm món cần sửa hoặc chọn thêm món mới.','Điền tên, mô tả, ảnh, khẩu phần, thời gian, nguyên liệu và hướng dẫn nấu theo biểu mẫu.','Lưu thay đổi; kiểm tra lại nội dung. Dùng điều khiển hiển thị/ẩn khi cần tạm ngưng giới thiệu món.'])
para('Mở nhận đơn & cập nhật nguyên liệu',16,green,True)
para('Trong <b>Đơn hàng & cửa hàng</b>, chọn cửa hàng nguồn; nhập người bán thực tế, khu vực, phí giao và bật nhận đơn khi nhóm đã sẵn sàng xử lý. Cập nhật đúng mã nguyên liệu, đơn vị, giá và tồn kho. Bảng giá có hạn hiệu lực nên cần được duy trì.',11)
para('Lịch sử thanh toán',16,green,True)
para('Chọn ngày hoặc tháng để xem số đơn, tổng tiền và tài khoản đặt hàng. Báo cáo dựa trên giao dịch đã được xác nhận; tên tài khoản đặt đơn không phải bằng chứng xác minh danh tính người chuyển tiền.',11)
para('Phạm vi hoạt động',16,green,True)
para('Nhóm quản trị vận hành danh mục và đơn hàng. Tên cửa hàng nguồn không đồng nghĩa website tự đặt hàng hoặc đồng bộ trực tiếp với siêu thị. MoMo chỉ dùng khi đã được cấu hình và cho phép chọn; tài liệu này hướng dẫn luồng QR ngân hàng payOS.',10.5,gray)
para('Ảnh trong tài liệu lấy từ website thực tế ngày 17/10/2026. Giá, ưu đãi và trạng thái có thể thay đổi. Tài liệu không chứa thông tin đăng nhập hoặc khóa thanh toán.',9,gray)
end();c.save();print(O/'Huong-dan-su-dung-AI-Smart-Grocery.pdf')
