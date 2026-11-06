from zipfile import ZipFile, ZIP_DEFLATED
from lxml import etree
from copy import deepcopy
from pathlib import Path

src=Path(r'D:\FPTU\Ky 8\EXE201\AI_Smart_Glocery\AI_Smart_Grocery_Outcome1_Report.docx')
out=Path('output/documents/AI_Smart_Grocery_Outcome1_Report_Hoan_Thien.docx')
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
w='{'+ns['w']+'}'
z=ZipFile(src); root=etree.fromstring(z.read('word/document.xml')); ps=root.xpath('//w:p',namespaces=ns)
notion='https://app.notion.com/p/EXE101-201-AI-Smart-Grocery-3e54b7e58f4780f9a8f1f61eb7ef3780'
edits={
6:'11 slide; nội dung demo và kỹ thuật; minh chứng tiến độ; 8 câu Q&A; phân bổ thời gian; các điểm cần kiểm chứng.',
10:'Cập nhật ngày 22/10/2026. Sản phẩm đã có website và luồng mua hàng; kết quả khảo sát, doanh thu và giao dịch thanh toán thực tế chưa được xác nhận.',
12:'Budget → Meal Suggestion → Recipe → Grocery List → Cart → Checkout → Orders. Tích hợp trực tiếp hệ thống siêu thị và đối tác giao hàng là giai đoạn sau.',
20:'Nội dung tiếng Anh dùng cho slide, lời nói tiếng Việt dùng để luyện thuyết trình. Các mục tiêu khảo sát, giá premium và kế hoạch đối tác cần được trình bày đúng là kế hoạch.',
32:'“BỮA NGON ĐỂ AI LO” | Group 84 | EXE201 Outcome 1',
33:'• Phan Trần Mẫn Nghi — Business Analyst / Product Owner',
34:'• Đào Ngọc Nam — Business Analyst, AI/Data & QA',
36:'• Ninh Quốc Bảo — Project Manager / Leader & Backend Developer',
38:'• Nguyễn Minh Tiến — Backend Developer',
79:'• Vietnamese students → A Vietnamese web app with daily budget, household size, dietary preferences and everyday recipes.',
80:'• Budget-first planning → Server-side filtering by ingredient cost and servings; each suggestion is an individual option within the budget, excluding delivery.',
81:'• Easy Vietnamese meals → Recipe photos, ingredient quantities, cooking steps and a shopping list that excludes ingredients already available at home.',
82:'• Cost estimation → Ingredient prices × required purchase units, rounded to retail units; delivery fees are added at checkout.',
86:'Từ EXE101, nhóm giữ khách hàng mục tiêu là sinh viên và cách bắt đầu từ ngân sách. Website hiện cho nhập số tiền, số người ăn, chọn món Việt, xem công thức và đánh dấu nguyên liệu đã có. Hệ thống tính chi phí theo lượng cần mua. Mỗi món gợi ý là một lựa chọn riêng trong ngân sách, không phải cam kết cả danh sách cộng lại vẫn dưới số tiền đã nhập.',
103:'• Implemented extension: Recipe-based cart groups, selective checkout, order history, monthly spending and administration.',
104:'• Current build: Public website, authentication, recipes, recommendations, cart and payOS integration. Retailer APIs, verified partner fulfilment and measured user outcomes remain unvalidated.',
108:'Luồng chính đã đi từ nhập ngân sách đến xem món, công thức và nguyên liệu. Người dùng có thể đưa nguyên liệu vào giỏ theo từng món, chọn phần cần thanh toán và theo dõi đơn. payOS được tích hợp ở backend. Tuy nhiên, nhóm chưa có API hay thỏa thuận nhận đơn của Bách Hóa Xanh hoặc WinMart; việc tích hợp thanh toán không đồng nghĩa đã kết nối vận hành với siêu thị.',
114:'Phần bổ sung sau slide 4: tổng quan tính năng, user flow, demo trực tiếp, kiến trúc và triển khai; nội dung chi tiết ở phụ lục.',
123:'• 2025 market context: Vietnam e-commerce reached approximately US$31 billion, up 25.5% year-on-year (Ministry of Industry and Trade). This is context, not our student-market TAM.',
131:'Theo Bộ Công Thương, thương mại điện tử Việt Nam năm 2025 đạt khoảng 31 tỷ USD, tăng 25,5%. Đây là bối cảnh hành vi số, không phải quy mô khách hàng của nhóm. Phân khúc cần kiểm chứng vẫn là sinh viên tự nấu ăn, có ngân sách hạn chế và muốn giảm thời gian quyết định hôm nay ăn gì.',
133:'Nguồn: Bộ Công Thương, “Cục Thương mại điện tử và Kinh tế số tổng kết công tác năm 2025 và triển khai nhiệm vụ năm 2026”, moit.gov.vn; truy cập 22/10/2026. Phân tích phân khúc và đối thủ: CP1.',
147:'• Premium hypothesis: Weekly menu planning, nutrition insights and meal-prep support; proposed price VND 19,000–49,000/month, not validated. Basic expense tracking already exists.',
171:'• Partner status: No confirmed retailer partnership or partner API access. Store names/prices are reference data managed by the team; referral attribution and commission reconciliation are not operational.',
175:'Nhóm chưa có đối tác siêu thị ký kết hoặc quyền API cửa hàng. Giỏ hàng, đơn hàng và thanh toán là luồng trong ứng dụng của nhóm; chưa thể coi là đơn được chuyển tới siêu thị. Cơ chế referral và đối soát hoa hồng là phương án đề xuất, chỉ triển khai sau khi có thỏa thuận và quy tắc hủy, hoàn tiền rõ ràng.',
190:'• Current Notion plan: Survey 20 people; pilot with 15–30 real users. Both are planned activities, not completed research results.',
196:'Kế hoạch CP1 từng đặt mục tiêu khảo sát 100–200 người và pilot 10–15 người. Workspace hiện cụ thể hóa thành khảo sát 20 người và cho 15–30 người dùng thử. Các task nghiên cứu còn To Do hoặc Backlog; nhóm chưa có số liệu phản hồi để kết luận nhu cầu đã được xác nhận.',
210:'• Product/business: Phan Trần Mẫn Nghi and Đào Ngọc Nam; UI/UX: Nguyễn Tiến Minh.',
211:'• Project lead/backend: Ninh Quốc Bảo; backend: Nguyễn Minh Tiến; frontend: Phạm Trương Long.',
212:'• AI/Data & QA: Đào Ngọc Nam. Roles follow the current Notion team table.',
213:'• Workspace: Notion “EXE101-201: AI Smart Grocery” with milestones, sprints, team roles, tasks and risks; reviewed on 22 October 2026. Link and detailed milestone evidence are in the appendix.',
214:'• Milestone status: 5 of 7 marked complete (71.4%, unweighted count only), 1 in progress, 1 not started. Task statuses are inconsistent with milestone labels; this is not a verified overall product-completion percentage.',
218:'Nhóm quản lý trên Notion với năm bảng: milestone, sprint, thành viên, công việc và rủi ro. Hiện 5 trên 7 mốc được đánh dấu hoàn thành. Tuy nhiên, nhiều task chi tiết vẫn chưa cập nhật, nên tỷ lệ 71,4% chỉ là số mốc đã đánh dấu, không phải mức hoàn thiện toàn dự án. Nhóm cần đối chiếu từng task với sản phẩm, commit và kết quả kiểm thử trước khi chốt tiến độ.',
220:'Nguồn: Notion EXE101-201: AI Smart Grocery, đọc ngày 22/10/2026; repository và website dự án. Bảng milestone chi tiết ở phụ lục.',
233:'• Funnel to measure: Budget submission → recipe view → cart creation → checkout → confirmed payment; separate genuine payments from test orders.',
236:'• Measured user KPIs: Not yet available. Notion lists a 20-person survey and 15–30-user pilot; no completed response dataset, measurement date or verified conversion/revenue result is available.',
240:'Nhóm chưa báo cáo KPI người dùng vì chưa có bộ phản hồi đã thu thập. Đợt pilot dự kiến đo tỷ lệ hoàn thành luồng, thời gian chọn món, mức hài lòng và ý định dùng lại. Đơn đã tạo không đồng nghĩa đã thanh toán; chỉ giao dịch được xác nhận từ cổng thanh toán mới được tính vào doanh thu. Ưu tiên tiếp theo là cập nhật task, kiểm thử và thu phản hồi thực tế.',
242:'Nguồn: Notion, mục 4_Tasks và 1_Milestones; kế hoạch đo đề xuất cho giai đoạn M5, chưa phải kết quả.',
246:'User Manual PDF và video giới thiệu website đã có; giới thiệu ngắn ở phần cuối, không chiếu toàn bộ trong khung 9 phút 30 giây.',
270:'Phụ lục: nội dung demo, kỹ thuật và minh chứng',
272:'Nội dung trình bày',
275:'Feature overview: Authentication; budget-based suggestions; recipes with photos, quantities and steps; recipe-grouped cart; checkout; orders; monthly spending; admin recipes and payment reporting. AI generation depends on server configuration; rule-based fallback is available.',
278:'User flow: Guest → sign up/sign in → enter budget and servings → choose recipe → mark available ingredients → add missing items → select cart groups → checkout → payment status/orders. Admin → recipe management and payment history; access is role-protected.',
281:'Live demo (50 seconds): Open https://ai-smart-glocery.vercel.app/ → enter VND 50,000 for one person → inspect an eligible recipe → show ingredients and cooking steps → add to cart → show payment options. Do not report successful payment unless the provider has confirmed it. If live data is unavailable, show the recorded website walkthrough.',
284:'Architecture: Next.js 16.4 / React 19 / TypeScript / Tailwind CSS → server API routes → MongoDB Atlas via Mongoose. Server-side authentication and admin checks; Gemini integration for optional AI support; payOS payment creation and signed callback validation. Secrets stay on the server.',
287:'Deployment: Vercel hosts the Next.js app at https://ai-smart-glocery.vercel.app/. MongoDB Atlas stores application data. Production environment variables configure database, app URL, AI and payment providers. Recheck registration, recommendations, checkout and webhook processing after redeployment; never include secret keys in slides.',
290:'User Manual: output/pdf/Huong-dan-su-dung-AI-Smart-Grocery.pdf (10 pages). Covers registration/login, budget suggestions, recipes, cart, checkout, order history, spending, assistant and administration. Submit this file alongside the slides.',
293:'TVC: video-output/AI-Smart-Grocery-Website-Thuc-Te.mp4; approximately 2 minutes 15 seconds, landscape, real website walkthrough with Vietnamese male narration. Introduce the file in the short presentation; play the complete version only if the allocated time permits.',
297:'Minh chứng và giới hạn cần lưu ý',
299:'Website đã triển khai luồng ngân sách → món → nguyên liệu → giỏ hàng. Bảng giá có thể thay đổi theo dữ liệu quản trị; không hứa mọi lựa chọn ngân sách đều có kết quả.',
301:'Đã có chức năng đặt hàng và tích hợp thanh toán ở cấp ứng dụng. Chưa xác nhận hợp tác siêu thị, vận hành giao hàng hoặc giao dịch thật thành công.',
303:'Chưa có hợp đồng đối tác, API dữ liệu siêu thị hoặc hoa hồng đã được đối soát. Không trình bày logo/tên cửa hàng như bằng chứng hợp tác.',
305:'Workspace: '+notion+'\nM0: 28/09–04/10/2026; Leader; Hoàn thành.\nM1: 05/10–18/10/2026; BA + UI/UX; Hoàn thành.\nM2: 19/10–25/10/2026; Leader; Hoàn thành.\nM3: 19/10–08/11/2026; Dev + AI; Hoàn thành.\nM4: 09/11–22/11/2026; Backend + FE; Hoàn thành.\nM5: 16/11–29/11/2026; QA + BA; Đang làm.\nM6: 30/11–06/12/2026; Leader; Chưa bắt đầu.\nTỷ lệ theo nhãn: 5 ÷ 7 × 100 = 71,4%; không trọng số. Các mốc tương lai đã có nhãn hoàn thành/đang làm, trong khi task còn tồn đọng: cần xác nhận lại lịch và trạng thái. Lịch sử thay đổi từng task chưa được kiểm chứng.',
307:'Chưa đo KPI người dùng. Kế hoạch: khảo sát 20 người; pilot 15–30 người trong M5 (16–29/11/2026). Ghi ngày thử, số mẫu hợp lệ, tỷ lệ hoàn thành luồng, thời gian chọn món, điểm hài lòng 1–5 và ý định dùng lại. Chỉ tính tỷ lệ sau khi có dữ liệu gốc và mẫu số rõ ràng.',
308:'5',
309:'Đã cập nhật bối cảnh thương mại điện tử 2025 theo Bộ Công Thương: khoảng 31 tỷ USD, tăng 25,5%. Không dùng quy mô toàn ngành thay cho TAM sinh viên.',
317:'Nhóm chưa có kết quả xác nhận mức sẵn sàng trả tiền. Luồng cơ bản định hướng miễn phí; thực đơn tuần, phân tích dinh dưỡng và meal prep là ứng viên premium ở mức đề xuất 19k–49k/tháng. Quản lý chi tiêu cơ bản đã có, nên không mô tả toàn bộ chức năng này như tính năng chưa xây dựng.',
322:'3. Đã có đặt hàng, vậy đã kết nối giao hàng với siêu thị chưa?',
323:'Website đã có giỏ hàng, đặt đơn, tích hợp payOS và lịch sử đơn. Nhưng nhóm chưa có API hoặc hợp đồng để tự động chuyển đơn cho siêu thị. Vì vậy, chức năng kỹ thuật không được xem là bằng chứng đối tác đã nhận đơn hoặc hàng đã giao. Kết nối vận hành là bước tiếp theo cần thỏa thuận rõ ràng.',
326:'Hệ thống ước tính từ lượng nguyên liệu và đơn vị mua, sau đó lấy báo giá khi thanh toán, gồm phí giao. Backend cần kiểm tra giá, tồn kho và khả năng nhận đơn trước khi tạo thanh toán. Giá tham khảo không phải cam kết giá siêu thị theo thời gian thực; khi thiếu dữ liệu hợp lệ, không nên tạo báo giá chắc chắn.',
329:'Các câu trả lời phân biệt chức năng đã triển khai với kết quả kinh doanh và vận hành chưa được xác nhận.',
335:'Nhóm chưa có đối tác siêu thị được xác nhận hoặc hoa hồng thực thu. Referral, mã chiến dịch, đối soát hằng tháng và thỏa thuận bằng văn bản là thiết kế cho tương lai. Việc đã tích hợp payOS không chứng minh quan hệ đối tác hay bảo đảm hoa hồng từ siêu thị.',
338:'Chưa có bộ kết quả khảo sát/pilot để kết luận. Notion hiện đặt khảo sát 20 người và pilot 15–30 người, nhưng task vẫn To Do/Backlog. Nhóm sẽ đo tính hữu ích, tỷ lệ hoàn thành và ý định dùng lại; quy mô thương mại điện tử chỉ cung cấp bối cảnh.',
341:'Backend lọc món từ danh mục theo ngân sách, số người và điều kiện ăn uống. Khi có cấu hình Gemini, AI hỗ trợ lựa chọn/xếp hạng trong tập phù hợp; khi không có, hệ thống dùng quy tắc. Không để mô hình tự đặt giá nguyên liệu. Chất lượng công thức và mức phù hợp thực tế vẫn cần người dùng kiểm chứng.',
344:'Notion có bảng vai trò, task, sprint, milestone và rủi ro. Tuy nhiên, nhãn milestone và task hiện chưa đồng bộ. Cần đối chiếu từng việc với commit, màn hình sản phẩm, tài liệu và test. Không thể dùng 5/7 mốc đã đánh dấu để chứng minh mọi thành viên hoàn thành cùng một tỷ lệ.',
347:'Nguồn cập nhật: workspace Notion và chức năng dự án; không suy ra doanh thu hoặc mức độ hài lòng khi chưa đo.',
405:'Hồ sơ đã có website triển khai, tài liệu hướng dẫn PDF và video website. Trước khi nộp: kiểm tra link sản phẩm, đóng gói slide và các tệp, đồng bộ trạng thái Notion với bằng chứng công việc, bổ sung dữ liệu thử nghiệm người dùng khi thu thập được. Không trình bày giao dịch thử hoặc trạng thái đơn tự tạo như doanh thu thực.',
419:'Dùng bối cảnh 2025 từ Bộ Công Thương; không gọi là TAM trực tiếp.',
423:'Đặt hàng đã có, đối tác chưa xác nhận',
424:'Dễ nhầm chức năng ứng dụng với tích hợp nhận đơn tại siêu thị.',
425:'Tách luồng kỹ thuật, xác nhận thanh toán và khả năng thực hiện đơn của đối tác.',
436:'Đã có giỏ hàng nhưng chưa có bộ dữ liệu chuyển đổi người dùng.',
437:'Định nghĩa sự kiện và mẫu số; đo riêng tạo giỏ, đặt đơn và thanh toán thành công.',
439:'Notion có milestone nhưng nhiều task chưa phản ánh trạng thái sản phẩm.',
440:'Rà soát task, đính kèm bằng chứng và xác nhận lịch; không coi nhãn milestone là tỷ lệ hoàn thiện sản phẩm.',
445:'Ưu tiên trước buổi trình bày: đồng bộ Notion với sản phẩm, kiểm tra demo và thu dữ liệu pilot. Nhấn mạnh giá trị lập kế hoạch theo ngân sách; phân biệt tính năng, kế hoạch và kết quả đã đo.'
}
edits[189]='• Original CP1 target: Survey 100–200 students; revised workspace target is 20 people, pending execution.'
edits[255]='• AI Smart Grocery: Budget-first planning, practical Vietnamese recipes and a connected shopping workflow.'
edits[263]='AI Smart Grocery giúp người dùng bắt đầu từ ngân sách, chọn món Việt và chuẩn bị danh sách nguyên liệu. Website đã có giỏ hàng, đặt đơn và theo dõi chi tiêu. Giai đoạn tiếp theo tập trung kiểm chứng trải nghiệm với người dùng thật và xây dựng khả năng thực hiện đơn cùng đối tác. BỮA NGON ĐỂ AI LO là thông điệp của nhóm.'
for i,txt in edits.items():
 p=ps[i]; old=p.find(w+'r'); props=deepcopy(old.find(w+'rPr')) if old is not None and old.find(w+'rPr') is not None else etree.Element(w+'rPr')
 for c in list(props):
  if c.tag==w+'color': props.remove(c)
 for c in list(p):
  if c.tag!=w+'pPr': p.remove(c)
 r=etree.SubElement(p,w+'r'); r.append(props)
 for j,line in enumerate(txt.split('\n')):
  if j: etree.SubElement(r,w+'br')
  t=etree.SubElement(r,w+'t'); t.text=line; t.set('{http://www.w3.org/XML/1998/namespace}space','preserve')
# Normalize old slogan and obsolete editorial wording without altering layout.
for t in root.xpath('//w:t',namespaces=ns):
 if t.text: t.text=t.text.replace('Bữa nay AI lo','BỮA NGON ĐỂ AI LO')
out.parent.mkdir(parents=True,exist_ok=True)
with ZipFile(out,'w',ZIP_DEFLATED) as dst:
 for item in z.infolist(): dst.writestr(item,etree.tostring(root,xml_declaration=True,encoding='UTF-8',standalone=True) if item.filename=='word/document.xml' else z.read(item.filename))
print(out.resolve())
print('remaining placeholders:',len(root.xpath('//w:t[contains(text(),"[ĐIỀN") or contains(text(),"[PLACEHOLDER")]',namespaces=ns)))
from docx import Document
d=Document(out)
print('validated:',len(d.tables),'tables;',len(d.sections),'sections')
for i,p in enumerate(root.xpath('//w:p',namespaces=ns)):
 if p.xpath('.//w:color[@w:val="8A4B08"]',namespaces=ns):
  print('remaining colored paragraph',i,''.join(p.xpath('.//w:t/text()',namespaces=ns)))
