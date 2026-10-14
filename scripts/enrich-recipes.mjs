import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const file='src/data/mockData.ts',marker='// BEGIN DETAILED COOKING GUIDES';
const source=fs.readFileSync(file,'utf8').split(marker)[0].trimEnd();
const exports={};vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports});
const guides=[];
function add(n,amounts,pantry,prep,cook,waiting,equipment,finish,steps){
 const recipe=exports.recipes[n-1];
 const measures=amounts.split('|').map(x=>{const [quantity,unit]=x.trim().split(' ');return {quantity:Number(quantity),unit};});
 if(measures.length!==recipe.ingredients.length)throw Error('Amounts mismatch '+n);
 const extras=pantry?pantry.split('|').map(x=>{const [name,quantity,unit]=x.split('~');return {name,quantity:Number(quantity),unit};}):[];
 const parsed=steps.trim().split('\n').map(line=>{const [title,duration,heat,detail,cue]=line.trim().split('~');if(!cue)throw Error('Step missing '+n);return {title,duration,heat,detail,cue};});
 guides.push({id:recipe.id,prepTime:prep,cookTime:cook,cookingGuide:{baseServings:recipe.servings,measures:recipe.ingredients.map((i,j)=>({ingredientId:i.id,name:i.name,...measures[j]})),pantry:extras,waiting,equipment:equipment.split('|'),finish,steps:parsed}});
}
// The amounts below are the amounts USED, not the retail pack sizes.
add(1,'500 g|300 g|600 g|3 bông|2 thanh|2 củ|30 g|150 g|20 g|30 ml','Nước~2200~ml|Muối~4~g|Đường~8~g|Hành lá~10~g',30,180,'Không cần ướp','Nồi 4–5 lít|Rây lọc|Dao, thớt riêng cho thịt|Nhiệt kế thực phẩm','Nước dùng trong màu hổ phách nhạt; nạm mềm thái mỏng, bánh phở tơi, rau đặt trên mặt tô.',`
Sơ chế xương và rau~10 phút~Lửa lớn~Chần xương trong nước sôi 5 phút, bỏ nước chần rồi làm sạch cặn bám. Rửa giá, húng quế, hành lá; để ráo. Để riêng nạm bò và dụng cụ tiếp xúc thịt sống.~Xương sạch cặn, rau ráo nước.
Làm thơm gia vị~8–10 phút~Lửa vừa~Áp chảo hành tây bổ đôi và gừng đập dập cho xém mặt; cạo phần cháy đen. Rang hồi, quế 1–2 phút rồi cho vào túi lọc.~Gia vị thơm, không khét hoặc cháy đen.
Ninh nước dùng và nạm~150–180 phút~Lửa nhỏ~Cho xương, nạm, hành gừng và lượng nước trong mục gia vị vào nồi. Đun sôi, hớt bọt rồi hạ lửa chỉ sôi lăn tăn. Sau 60–90 phút kiểm tra nạm, vớt khi mềm; tiếp tục ninh xương. Nếu cạn nhiều, thêm nước nóng để trở lại mức ban đầu.~Nạm xiên dễ, nước dùng không sôi cuộn đục; thịt đạt ít nhất 63°C và nghỉ 3 phút.
Lọc và nêm nước dùng~8 phút~Lửa nhỏ~Lọc bỏ xương và gia vị. Thêm một nửa nước mắm, muối và đường đã định lượng; nếm rồi thêm dần phần còn lại. Giữ nước dùng nóng. Nạm nguội bớt thì thái ngang thớ dày khoảng 2 mm.~Nước thơm hồi quế, vị đậm nhẹ để dùng với bánh phở.
Chuẩn bị từng tô~3 phút~Lửa lớn~Chần bánh phở theo hướng dẫn trên bao bì, vẩy ráo rồi chia tô. Chần giá nếu thích ăn chín. Xếp nạm thái mỏng và hành lá lên bánh phở.~Bánh phở nóng, không dính thành khối.
Chan nước và trình bày~2 phút~Tắt bếp~Chan nước dùng nóng ngập bánh phở; đặt giá và húng quế lên trên hoặc để đĩa riêng. Dùng ngay khi nóng.~Tô có lớp bánh phở phía dưới, lát bò trên mặt và điểm xanh của rau.
`);
add(2,'200 g|300 g|150 g|3 quả|3 nhánh|10 g|15 ml|80 g','Thịt heo băm~100~g|Miến khô~15~g|Mộc nhĩ khô~5~g|Nước mắm~30~ml|Đường~20~g|Dầu ăn~10~ml|Chanh~1~quả|Dưa leo~100~g|Cà chua~100~g|Tiêu~1~g|Thính gạo~10~g|Nước pha mắm~60~ml',30,40,'Ướp sườn 30 phút trong ngăn mát','Nồi cơm|Chảo nướng hoặc lò|Xửng hấp|Nhiệt kế thực phẩm','Cơm tấm trắng tơi, sườn vàng nâu, bì tơi và chả cắt miếng; rau và chén mắm đặt bên cạnh.',`
Chuẩn bị cơm và đồ chua~10 phút~Chưa bật bếp~Vo gạo nhẹ, nấu theo tỷ lệ nước trên bao bì. Miến và mộc nhĩ ngâm mềm, để ráo rồi cắt nhỏ. Rửa dưa leo, cà chua và thái lát; để đồ chua ráo.~Nguyên liệu ráo; miến mềm nhưng chưa nhũn.
Ướp sườn~30 phút~Không dùng nhiệt~Đập nhẹ miếng sườn dày 1–1,5 cm. Trộn với sả băm, nửa tỏi, một phần ba nước mắm, một phần ba đường, dầu ăn và tiêu. Đậy kín, ướp trong ngăn mát.~Gia vị phủ đều hai mặt sườn.
Hấp chả~25–30 phút~Lửa vừa~Trộn thịt băm, miến, mộc nhĩ với 2 trứng và lòng trắng của trứng còn lại; nêm chút nước mắm từ phần đã chuẩn bị. Cho vào khuôn chịu nhiệt có quét dầu. Hấp, kiểm tra giữa chả đạt 71°C; quét lòng đỏ còn lại lên mặt, hấp thêm 3–5 phút.~Chả chắc, mặt vàng; giữa chả đã chín, không còn hỗn hợp trứng sống.
Luộc và trộn bì~20–30 phút~Lửa vừa~Luộc bì đã làm sạch đến mềm nhưng còn giòn, để nguội rồi thái sợi thật mỏng. Trộn với thính và phần tỏi còn lại. Không dùng thớt vừa cắt sườn sống cho bì chín.~Bì sợi tơi, không còn mỡ dày bám ngoài.
Nướng sườn~15–20 phút~Lò 200°C~Làm nóng lò; xếp sườn một lớp, nướng và trở mặt giữa chừng. Hoặc áp chảo lửa vừa, trở khi mặt dưới đã vàng. Đo phần thịt dày đạt 63°C, để nghỉ 3 phút trước khi cắt.~Mặt sườn vàng nâu, không cháy đen; thời gian điều chỉnh theo độ dày.
Pha mắm và dọn cơm~5 phút~Tắt bếp~Hòa nước pha mắm, lượng nước mắm và đường còn lại; thêm nước cốt chanh từng ít, nếm vị chua ngọt. Xới cơm, xếp sườn, bì, chả, dưa leo, cà chua và đồ chua, rưới mỡ hành lên cơm.~Các phần nằm riêng trên đĩa, sườn hướng mặt vàng lên trên.
`);
add(3,'400 g|200 g|600 g|45 ml|30 g|3 quả|150 g|40 g|15 g','Hành tím~20~g|Dầu ăn~10~ml|Tiêu~1~g|Cà rốt~100~g|Nước~180~ml',25,20,'Ướp thịt 30 phút trong ngăn mát','Chảo nướng hoặc lò|Bát pha nước chấm|Nhiệt kế thực phẩm','Chả viên và ba chỉ xém cạnh trong bát nước mắm chua ngọt; bún và rau để riêng.',`
Sơ chế~10 phút~Chưa bật bếp~Rửa rau rồi để ráo. Băm hành, tỏi; thái ba chỉ lát dày 4–5 mm, cà rốt lát mỏng. Bún chần theo bao bì nếu cần, để ráo.~Thịt và rau dùng dụng cụ riêng.
Ướp hai loại thịt~30 phút~Không dùng nhiệt~Chia hành tỏi cho thịt xay và ba chỉ. Dùng một phần ba nước mắm, một phần ba đường, dầu và tiêu ướp cả hai phần; để ngăn mát. Nặn thịt xay thành viên dẹt dày khoảng 1,5 cm.~Viên chả đều độ dày để chín cùng lúc.
Pha nước chấm~5 phút~Không dùng nhiệt~Hòa nước với đường và nước mắm còn lại; thêm nước cốt chanh từng ít, nếm chua ngọt dịu. Thêm cà rốt thái mỏng; giữ rau ăn kèm ở đĩa riêng.~Nước chấm loãng vừa, không mặn như nước mắm nguyên chất.
Nướng chả~12–18 phút~Lửa vừa hoặc lò 200°C~Nướng chả viên và ba chỉ thành một lớp, trở đều. Chả xay phải đạt 71°C ở giữa; ba chỉ đạt ít nhất 63°C rồi nghỉ 3 phút. Gắp miếng đã chín ra, không để chờ miếng dày hơn.~Chả nâu vàng, có cạnh xém nhẹ, không cháy đen.
Hoàn thiện bát chả~2 phút~Tắt bếp~Cho chả nóng vào từng bát nước chấm đã pha. Đặt cà rốt quanh chả; chỉ cho lượng vừa dùng để chả không ngâm quá lâu.~Thấy rõ cả chả viên và miếng ba chỉ trong bát.
Thưởng thức~2 phút~Không dùng nhiệt~Dọn bún tơi, xà lách và rau thơm bên cạnh. Gắp từng phần bún, rau vào bát chả; ăn ngay khi chả còn ấm.~Bún không ngập sẵn trong bát để giữ độ tơi.
`);
add(4,'12 tờ|200 g|150 g|300 g|150 g|20 g|60 ml|25 g','Nước pha sốt~60~ml|Đường~5~g|Tỏi~5~g|Dầu ăn~5~ml',25,20,'Để tôm và thịt nguội bớt trước khi cuốn','Nồi nhỏ|Thớt sạch cho đồ chín|Chảo sốt','Cuốn chặt vừa tay, nhìn thấy tôm hồng qua lớp bánh tráng; rau xanh ở phần đầu.',`
Chuẩn bị rau và bún~8 phút~Chưa bật bếp~Rửa xà lách, húng lủi, để thật ráo. Bún chần theo bao bì nếu cần rồi để nguội; bánh tráng để khô trên đĩa.~Rau không đọng nước làm rách cuốn.
Luộc thịt~15–20 phút~Lửa vừa~Cho thịt vào nước vừa ngập, luộc sôi nhẹ. Kiểm tra phần dày đạt 63°C, vớt ra nghỉ ít nhất 3 phút rồi thái lát mỏng ngang thớ.~Lát thịt mỏng, đều, không dùng lại thớt thịt sống.
Luộc tôm~3–5 phút~Lửa vừa~Luộc tôm đến thịt trắng đục và đạt 63°C. Vớt ra, để nguội bớt, bóc vỏ, bỏ chỉ lưng rồi chẻ đôi dọc thân.~Hai nửa tôm gọn, lưng hồng đẹp.
Nấu sốt~3–4 phút~Lửa nhỏ~Phi tỏi với dầu, cho tương đen, nước pha sốt và đường vào khuấy. Đun sôi nhẹ đến hơi sánh; rắc đậu phộng giã lên mặt khi múc ra bát.~Sốt chảy chậm khỏi thìa, không đặc quánh.
Cuốn~10 phút~Không dùng nhiệt~Làm ẩm nhanh từng bánh tráng, đặt lên đĩa. Xếp rau, bún, thịt ở một phần ba phía dưới; gập hai mép vào rồi cuốn một vòng. Đặt 2 nửa tôm phía trước, mặt hồng úp xuống bánh, cuốn tiếp đến hết.~Mặt ngoài thấy tôm; cuốn kín hai đầu nhưng không siết rách bánh.
Dọn món~2 phút~Không dùng nhiệt~Xếp cuốn cách nhau trên đĩa để không dính; dùng ngay với sốt. Đậu phộng để riêng nếu người ăn cần tránh nguyên liệu này.~Cuốn bóng mềm, rau tươi, không bị khô mép.
`);
add(5,'2 cái|250 g|2 nhánh|100 g|100 g|1 quả|1 quả|15 g|30 g','Nước mắm~10~ml|Đường~15~g|Giấm~30~ml|Nước~30~ml|Dầu ăn~10~ml|Tỏi~5~g|Muối~1~g',20,15,'Ướp thịt và ngâm đồ chua 30 phút','Chảo nướng|Dao, thớt|Bát ngâm đồ chua','Ổ bánh giòn, thịt nướng vàng, đồ chua, dưa leo và ngò nhìn rõ ở khe bánh.',`
Làm đồ chua~10 phút~Không dùng nhiệt~Gọt củ cải, cà rốt rồi thái sợi. Bóp nhẹ với muối, để 5 phút, rửa nhanh và vắt ráo. Hòa giấm, nước và hai phần ba đường, cho rau củ vào ngâm.~Sợi rau củ giòn, vị chua ngọt nhẹ.
Ướp thịt~30 phút~Không dùng nhiệt~Thái nạc vai ngang thớ dày 3–4 mm. Băm sả và tỏi; trộn cùng thịt, nước mắm, dầu và đường còn lại. Đậy kín trong ngăn mát.~Thịt phủ gia vị đều, không thành cục dày.
Chuẩn bị rau ăn kèm~5 phút~Chưa bật bếp~Rửa dưa leo, ngò và ớt; để ráo. Thái dưa leo thành thanh mỏng, ớt thành lát; để riêng cho người ăn tự chọn.~Rau ráo để bánh không bị ỉu.
Nướng thịt~8–12 phút~Lửa vừa~Làm nóng chảo, xếp thịt một lớp. Trở khi mặt dưới vàng; nướng đến thịt đạt 63°C ở phần dày rồi để nghỉ 3 phút. Nướng nhiều mẻ nếu chảo chật.~Thịt nâu vàng, cạnh hơi xém, không đen khét.
Làm nóng bánh~3–5 phút~Lò 170°C~Làm nóng ổ bánh trong lò rồi rạch dọc, chừa một cạnh liền. Phết mayonnaise mỏng vào ruột.~Vỏ giòn, ruột còn mềm.
Kẹp và dọn~3 phút~Tắt bếp~Cho dưa leo, thịt, đồ chua đã ráo và ngò vào; thêm ớt theo khẩu vị. Để mặt thịt vàng quay ra khe bánh.~Nhân trải đều, không chảy nhiều nước xuống đáy bánh.
`);
add(6,'400 g|500 ml|20 g|25 ml|20 g|1 g|10 g|1 quả','Trứng gà~3~quả|Nước~200~ml',20,65,'Ướp thịt 20 phút trong ngăn mát','Nồi đáy dày|Nồi luộc trứng','Thịt ba chỉ nâu óng, mềm nhưng nguyên miếng; trứng vàng nhạt nằm trong nước kho.',`
Sơ chế và ướp thịt~20 phút~Không dùng nhiệt~Thấm khô thịt, cắt khối 3 cm. Băm hành tỏi, trộn với thịt, nước mắm, tiêu và nửa đường. Ướp trong ngăn mát.~Miếng thịt đều cỡ, giữ đủ lớp nạc và mỡ.
Luộc trứng~10–12 phút~Lửa vừa~Luộc trứng từ khi nước sôi nhẹ 10–12 phút, làm nguội bằng nước sạch rồi bóc vỏ. Giữ trứng nguyên, không cắt trước khi kho.~Vỏ bóc sạch, trứng không vỡ.
Tạo màu~3–4 phút~Lửa nhỏ~Cho đường còn lại và một ít nước trong phần định lượng vào nồi. Đun đến màu hổ phách, thêm phần nước còn lại thật chậm để tránh bắn. Không dùng nước màu đã chuyển đen.~Màu nâu cánh gián, không có mùi khét.
Kho thịt~45–55 phút~Lửa nhỏ~Cho thịt vào đảo săn, thêm nước dừa và nước màu. Đun sôi, hớt bọt rồi kho hé nắp; trở miếng thịt vài lần. Nếu nước cạn trước khi mềm, thêm nước nóng từng ít.~Nước chỉ sôi lăn tăn; thịt xiên dễ nhưng không nát.
Thêm trứng và nêm~10 phút~Lửa nhỏ~Cho trứng vào, trở nhẹ để thấm màu. Nếm nước kho; nếu đậm, thêm ít nước nóng; nếu nhạt, thêm nước mắm từng chút. Thịt phải chín kỹ, tối thiểu 63°C và nghỉ 3 phút.~Nước kho còn xâm xấp, trứng vàng nhạt, thịt mềm.
Trình bày~2 phút~Tắt bếp~Múc thịt và trứng vào tô hoặc nồi đất, rưới nước kho vừa đủ. Rắc tiêu, thêm ớt nếu thích; ăn cùng cơm riêng.~Mặt thịt bóng, trứng nằm xen kẽ giống bố cục ảnh.
`);
add(7,'300 g|10 g|10 g|15 ml|10 ml|100 g|2 quả|1 củ|1 quả','Dầu ăn~10~ml|Đường~3~g|Tiêu~1~g',15,10,'Ướp bò 15 phút trong ngăn mát','Chảo rộng đáy dày|Kẹp gắp|Nhiệt kế','Thịt bò dạng khối vàng nâu bên ngoài, hành tây còn giòn, rau xanh và cà chua quanh đĩa.',`
Cắt và làm ráo~8 phút~Chưa bật bếp~Thấm khô bò, cắt khối 2 cm. Hành tây cắt miếng vuông; rửa xà lách xoong, cà chua, để ráo. Băm tỏi.~Bề mặt bò khô giúp áp chảo lên màu.
Ướp bò~15 phút~Không dùng nhiệt~Trộn bò với nước tương, dầu hào, đường, tiêu và nửa tỏi. Để ngăn mát; lấy ra ngay trước lúc nấu.~Gia vị bám mỏng, không quá nhiều nước ướp.
Xào hành~2 phút~Lửa lớn~Làm nóng chảo với nửa dầu. Cho hành tây vào đảo nhanh rồi trút ra đĩa riêng.~Hành trong nhẹ ở mép, giữa còn giòn.
Áp chảo bò~5–7 phút~Lửa vừa lớn~Thêm dầu còn lại, xếp bò một lớp. Để yên khoảng 1 phút cho vàng rồi trở các mặt. Không nhồi kín chảo. Kiểm tra phần dày đạt 63°C, sau nấu nghỉ 3 phút.~Bò có mặt nâu vàng; thời gian tùy kích thước và độ nóng chảo.
Đảo bơ tỏi~1 phút~Lửa vừa~Hạ lửa, thêm bơ và tỏi còn lại; đảo nhanh cho thơm rồi cho hành tây trở lại, trộn đều. Tắt bếp trước khi bơ cháy.~Bơ áo bóng thịt, tỏi vàng nhạt.
Bày món~3 phút~Tắt bếp~Lót xà lách xoong, xếp cà chua quanh đĩa, đặt bò và hành vào giữa; chanh cắt múi để riêng.~Khối bò nổi bật ở giữa, rau không bị ngập sốt.
`);
add(8,'300 g|25 g|200 g|2 quả|100 g|100 g|15 g|20 ml','Nước~1200~ml|Đường~10~g|Muối~2~g',20,20,'Không cần ướp','Nồi 2–3 lít|Rây me','Canh trong chua dịu, có cá, dứa, cà chua, đậu bắp và giá; rau om rắc trên mặt.',`
Chuẩn bị cá và rau~10 phút~Chưa bật bếp~Dùng cá đã làm sạch, cắt khoanh 2–3 cm, thấm ráo; loại bỏ phần máu đọng. Cà chua bổ múi, dứa cắt lát, đậu bắp cắt xéo. Rửa giá và rau om, để riêng.~Cá và rau dùng thớt riêng, miếng cá đều cỡ.
Lấy nước me~5 phút~Nước nóng~Dầm me với một ít nước nóng lấy từ lượng nước đã định, lọc bỏ hạt và xơ. Không đổ cả hạt me vào nồi.~Nước me mịn, không có hạt cứng.
Nấu cá~8–12 phút~Lửa vừa~Đun lượng nước còn lại với dứa, cho cá vào khi nước sôi. Hớt bọt, hạ lửa; tránh đảo mạnh làm vỡ cá. Kiểm tra cá đạt 63°C ở phần dày.~Thịt cá đục và tách thớ, nước canh ít bọt.
Thêm rau và nêm~4–5 phút~Lửa vừa~Cho cà chua, đậu bắp, nửa nước me, nước mắm và đường vào. Nếm rồi thêm nước me còn lại từ từ; thêm muối nếu cần.~Vị chua ngọt dịu, cà chua còn múi và đậu bắp xanh.
Hoàn thiện~1 phút~Lửa vừa~Cho giá vào, đợi nước sôi lại rồi tắt. Rắc rau om và đảo nhẹ một lần.~Giá còn giòn, rau thơm không thâm đen.
Múc canh~2 phút~Tắt bếp~Xếp cá vào tô trước, múc nước và rau quanh cá; đặt vài múi cà chua và dứa trên mặt.~Cá nguyên khoanh và màu rau rõ như ảnh; chú ý xương khi ăn.
`);
add(9,'300 g|400 g|40 g|20 g|30 ml|20 g|3 g','Nước luộc gà~1000~ml',20,45,'Ngâm nếp 6–8 giờ trong ngăn mát','Xửng hấp|Nồi luộc|Chảo nhỏ','Hạt xôi bóng, tơi nhưng dẻo; thịt gà xé phủ trên, thêm hành phi và mỡ hành.',`
Ngâm và chuẩn bị nếp~6–8 giờ~Không dùng nhiệt~Vo nếp, ngâm ngập nước trong ngăn mát. Đổ ra rổ để ráo 15 phút, trộn với hai phần ba muối. Không dùng nước ngâm để hấp.~Hạt nếp nở đều, đã ráo bề mặt.
Luộc gà~25–30 phút~Lửa vừa nhỏ~Cho đùi gà, gừng đập dập, muối còn lại và nước vào nồi. Đun sôi rồi hạ lửa; kiểm tra phần thịt dày không chạm xương đạt 74°C. Vớt ra, để nguội bớt rồi xé sợi.~Gà chín kỹ, xé được sợi nhưng không vụn khô.
Hấp xôi lượt đầu~25 phút~Lửa vừa~Đun nước sôi trong xửng, rải nếp tơi, tạo vài lỗ thoát hơi. Đậy nắp có khăn hứng nước ngưng, tránh khăn chạm lửa. Hấp rồi đảo nhẹ từ dưới lên.~Nếp chín gần hết, không có vùng khô cứng.
Làm hành phi và mỡ hành~8 phút~Lửa nhỏ~Thái hành tím mỏng, phi với dầu đến vàng nhạt rồi vớt ngay. Cho hành lá cắt nhỏ vào phần dầu nóng còn lại, tắt bếp.~Hành phi vàng giòn, không nâu đen.
Hấp hoàn tất~10–15 phút~Lửa vừa~Rưới ít nước luộc gà nóng lên xôi nếu hạt còn khô, trộn nhẹ rồi hấp tiếp. Thử hạt ở giữa xửng; nếu còn lõi cứng, hấp thêm từng 5 phút.~Hạt dẻo từ trong ra ngoài, không nhão.
Bày xôi~3 phút~Tắt bếp~Xới xôi ra đĩa, phủ gà xé, mỡ hành và hành phi. Dọn ngay khi nóng.~Xôi thành ụ thấp, gà và hành phủ đều mặt.
`);
add(10,'500 g|20 g|20 ml|10 ml|3 g|2 g|1 quả','Nước chần~1500~ml',12,6,'Không cần ướp','Nồi chần|Chảo rộng','Rau xanh bóng, cọng giòn, tỏi vàng nhạt nằm trên mặt.',`
Nhặt rau~8 phút~Chưa bật bếp~Bỏ gốc già, ngắt rau đoạn 6–8 cm. Rửa nhiều lần bằng nước sạch, để ráo. Đập dập rồi băm thô tỏi; ớt cắt lát nếu dùng.~Cọng non bẻ dễ, không còn đất cát.
Pha gia vị~2 phút~Không dùng nhiệt~Hòa nước mắm, đường và 2 thìa canh nước lấy từ lượng nước chần; để cạnh bếp. Muối dùng cho nồi chần.~Đường tan, gia vị sẵn sàng để xào nhanh.
Chần rau~30–45 giây~Lửa lớn~Đun nước với muối thật sôi, cho rau vào, đảo cho ngập rồi vớt ngay. Xả nhanh nước mát sạch, để thật ráo.~Rau vừa chuyển xanh đậm, cọng chưa mềm nhũn.
Phi tỏi~30 giây~Lửa vừa~Làm nóng dầu trong chảo rộng, cho hai phần ba tỏi vào đảo đến thơm. Không chờ tỏi chuyển nâu.~Tỏi vàng rất nhạt.
Xào nhanh~2–3 phút~Lửa lớn~Cho rau đã ráo vào đảo, thêm gia vị đã pha rồi tỏi còn lại. Xào theo mẻ nếu chảo nhỏ; dừng khi rau vừa nóng đều.~Cọng còn độ giòn, đáy chảo ít nước.
Bày rau~1 phút~Tắt bếp~Gắp rau ra đĩa ngay, rắc tỏi trong chảo và ớt lên trên. Không để rau nằm trong chảo nóng lâu.~Rau xanh bóng, tỏi nổi trên mặt, không úa mềm.
`);
add(11,'300 g|2 quả|20 ml|2 g','Hành lá~10~g|Đường~3~g|Nước~80~ml',10,18,'Không cần ướp','Chảo chống dính|Xẻng lật','Đậu vàng cạnh, phủ sốt cà chua đỏ cam, rắc hành xanh như ảnh.',`
Làm ráo đậu~5 phút~Chưa bật bếp~Thấm đậu bằng giấy bếp, cắt khối 2–3 cm. Để ráo trước khi chiên để hạn chế bắn dầu.~Bề mặt đậu khô, miếng không vỡ.
Chuẩn bị cà chua~5 phút~Chưa bật bếp~Rửa cà chua, bỏ cuống, thái hạt lựu nhỏ. Rửa hành, tách đầu trắng và lá xanh rồi cắt nhỏ.~Cà chua cắt nhỏ để nhanh mềm thành sốt.
Chiên đậu~8–10 phút~Lửa vừa~Làm nóng dầu, xếp đậu một lớp. Đợi mặt dưới vàng mới trở, chiên các mặt rồi gắp ra đĩa.~Vỏ vàng nhẹ, ruột vẫn mềm.
Nấu sốt~5–7 phút~Lửa vừa nhỏ~Dùng dầu còn lại phi đầu hành, thêm cà chua và muối. Dằm nhẹ khi cà chua mềm; thêm nước và đường, đun đến sốt sánh.~Cà chua nhuyễn phần lớn, sốt không khô cháy.
Om đậu~3 phút~Lửa nhỏ~Cho đậu vào, đảo hoặc lắc chảo nhẹ để sốt áo đều. Nếm rồi điều chỉnh muối từng ít; nếu đặc quá, thêm một chút nước.~Sốt bám quanh đậu, không còn vũng nước loãng.
Bày món~1 phút~Tắt bếp~Múc đậu ra đĩa nông, rưới sốt và rắc hành xanh. Xếp vài miếng có cạnh vàng lên trên.~Đĩa có màu đỏ cam, vàng và xanh; đậu giữ hình khối.
`);
add(12,'4 quả|10 g|10 ml','Muối~1~g|Tiêu~0.5~g',5,8,'Không cần ướp','Chảo chống dính 22–24 cm|Xẻng rộng','Trứng thành miếng vàng đều, hành xanh phân bố trên mặt, giữa chín mềm.',`
Sơ chế hành~2 phút~Chưa bật bếp~Rửa hành, để ráo rồi thái thật nhỏ cả phần trắng và xanh. Chuẩn bị đĩa sạch để đặt trứng chín.~Hành ráo, không làm hỗn hợp trứng loãng.
Đánh trứng~2 phút~Không dùng nhiệt~Đập từng quả vào bát nhỏ kiểm tra rồi cho vào bát lớn. Thêm muối, tiêu và hành, đánh đến lòng trắng hòa vào lòng đỏ.~Hỗn hợp đều màu, không còn mảng lòng trắng dài.
Làm nóng chảo~1 phút~Lửa vừa~Cho dầu vào chảo, nghiêng cho phủ đáy; dầu nóng nhưng không bốc khói thì hạ lửa.~Mặt chảo được phủ một lớp dầu mỏng.
Chiên mặt đầu~3–4 phút~Lửa nhỏ vừa~Đổ trứng, nghiêng chảo để lớp trứng đều. Đậy nắp 1–2 phút nếu mặt trên còn ướt; không tăng lửa để ép trứng chín nhanh.~Mép trứng se, mặt dưới vàng nhạt.
Trở và làm chín~2–3 phút~Lửa nhỏ~Dùng xẻng rộng trở trứng, hoặc chia đôi rồi trở. Nấu đến giữa trứng đông hoàn toàn; món trứng đạt 71°C nếu đo bằng nhiệt kế.~Không còn phần trứng lỏng, mặt ngoài không cháy.
Bày đĩa~1 phút~Tắt bếp~Trượt trứng lên đĩa, mặt vàng và hành hướng lên. Cắt miếng hình quạt khi trứng đã đứng mặt.~Miếng cắt gọn, bên trong vẫn mềm.
`);
add(13,'350 g|10 g|2 g','Thịt heo băm~120~g|Nước~700~ml|Dầu ăn~5~ml|Tiêu~0.5~g',10,15,'Không cần ướp','Nồi 1,5–2 lít|Dao, thớt|Muôi hớt bọt','Bí xanh nhạt, hơi trong, thịt băm tơi và nước canh trong; hành xanh rắc trên mặt.',`
Gọt và cắt bí~5 phút~Chưa bật bếp~Rửa bí, gọt vỏ, bỏ ruột xốp và hạt già. Cân lượng bí đã sơ chế theo danh sách; cắt lát dày khoảng 1 cm, miếng vừa thìa.~Miếng bí đều độ dày để chín cùng lúc.
Chuẩn bị thịt và hành~3 phút~Chưa bật bếp~Rửa hành, thái nhỏ, tách phần trắng và xanh. Trộn thịt băm với một phần tư muối và tiêu. Để thịt riêng, không dùng dụng cụ thịt sống cho món chín.~Thịt tơi, hành cắt nhỏ; nguyên liệu được chia sẵn.
Xào săn thịt~2–3 phút~Lửa vừa~Cho dầu và đầu hành vào nồi, đảo khoảng 20 giây. Thêm thịt băm, dùng muôi tách nhỏ, đảo đến thịt săn; không ép thịt thành viên lớn.~Thịt tơi thành hạt nhỏ, chưa cần cháy cạnh.
Nấu nước canh~4–5 phút~Lửa vừa~Thêm lượng nước đã định, đun đến sôi rồi hớt bọt. Hạ lửa để canh sôi nhẹ, tránh khuấy liên tục làm nước đục.~Nước canh ít bọt và không sôi cuộn mạnh.
Nấu bí và kiểm tra~6–8 phút~Lửa vừa nhỏ~Cho bí vào, nấu hé nắp. Thử miếng dày nhất: đầu đũa xuyên qua dễ nhưng miếng chưa nát. Thịt băm cần đạt 71°C; thời gian là ước lượng, tăng nếu miếng bí dày.~Bí hơi trong ở mép, ruột mềm; thịt chín kỹ.
Nêm và trình bày~1–2 phút~Tắt bếp~Thêm muối còn lại từng ít, nếm vừa ăn rồi tắt. Rắc hành xanh, múc bí vào tô trước, chan nước và rải thịt lên mặt để nhìn rõ các thành phần.~Canh trong, bí nguyên miếng, có thịt băm như ảnh; dùng nóng.
`);
add(14,'300 g|10 g|10 ml','Muối~2~g|Nước~30~ml',10,5,'Không cần ướp','Chảo rộng','Rau cải xanh bóng, thân vừa mềm và tỏi vàng nhạt, không ngập nước.',`
Rửa rau~5 phút~Chưa bật bếp~Cắt bỏ gốc, tách bẹ rau và rửa kỹ kẽ lá. Để ráo; cắt thân dài 4–5 cm, để thân và lá riêng.~Không còn đất ở gốc bẹ, rau ráo nước.
Chuẩn bị tỏi~2 phút~Chưa bật bếp~Bóc tỏi, đập dập và băm thô. Chuẩn bị sẵn muối và nước vì lúc xào cần thao tác nhanh.~Tỏi không băm quá nhuyễn dễ cháy.
Phi tỏi~30 giây~Lửa vừa~Làm nóng dầu, cho tỏi vào đảo đến thơm rồi tăng lửa.~Tỏi mới vàng nhạt, không nâu.
Xào phần thân~2 phút~Lửa lớn~Cho thân cải vào trước, đảo đều, thêm nước để tạo hơi; chỉ đậy nắp khoảng 30 giây nếu thân dày.~Thân chuyển hơi trong nhưng còn độ giòn.
Thêm lá và nêm~1–2 phút~Lửa lớn~Thêm lá, rắc muối, đảo đến lá vừa xẹp. Nếm một miếng, điều chỉnh muối; không tiếp tục nấu đến lá thâm.~Rau xanh, đáy chảo chỉ còn ít nước.
Dọn ngay~1 phút~Tắt bếp~Gắp rau ra đĩa, rưới chút nước xào và tỏi lên mặt. Không để trong chảo nóng.~Thân và lá còn hình dạng, không mềm nhũn.
`);
add(15,'200 g|15 g|10 ml','Dầu ăn~5~ml|Đường~5~g|Nước~15~ml|Tiêu~0.5~g',5,12,'Không cần ướp','Chảo chống dính|Muôi gỗ','Thịt băm tơi, màu nâu vàng, hành mềm, không còn nhiều nước dưới đĩa.',`
Chuẩn bị~3 phút~Chưa bật bếp~Băm nhỏ hành tím. Hòa nước mắm, đường và nước trong bát; thịt băm giữ lạnh đến trước lúc nấu.~Đường tan, sốt nêm đã sẵn.
Phi hành~1 phút~Lửa vừa~Làm nóng dầu, cho hành vào đảo đến thơm và trong nhẹ.~Hành chưa nâu đen.
Làm tơi thịt~3–4 phút~Lửa vừa lớn~Cho thịt vào chảo, dùng muôi tách nhỏ liên tục. Đảo đến không còn cục thịt lớn và nước tiết ra bắt đầu cạn.~Hạt thịt nhỏ, tơi, không đóng bánh.
Rang và nêm~4–5 phút~Lửa vừa~Rưới sốt nêm quanh chảo, đảo đều. Khi nước cạn, hạ lửa và đảo thêm cho cạnh thịt vàng nhẹ; đo thịt đạt 71°C.~Thịt chín kỹ, nâu vàng nhẹ, không khô cháy.
Điều chỉnh~1 phút~Lửa nhỏ~Nếm một ít thịt đã chín. Nếu mặn, thêm một chút nước rồi đảo; nếu khô, thêm vài thìa cà phê nước. Rắc tiêu.~Thịt đủ ẩm để ăn với cơm, không thành vụn cứng.
Bày đĩa~1 phút~Tắt bếp~Múc thịt thành ụ thấp, rải hành từ chảo lên trên. Dùng cùng cơm và rau riêng.~Nhìn rõ hạt thịt rang, không ngập sốt.
`);
add(16,'2 quả|2 quả|10 g','Dầu ăn~5~ml|Muối~2~g|Nước~650~ml',7,10,'Không cần ướp','Nồi nhỏ|Bát đánh trứng','Nước canh đỏ nhạt, cà chua mềm còn múi, trứng thành vân mảnh và hành xanh.',`
Sơ chế~4 phút~Chưa bật bếp~Rửa cà chua, bỏ cuống, bổ múi nhỏ. Rửa và thái hành; để đầu trắng riêng. Đập trứng vào bát, đánh tan.~Trứng hòa đều, cà chua cắt miếng vừa thìa.
Xào cà chua~3 phút~Lửa vừa~Phi đầu hành với dầu, cho cà chua và nửa muối vào đảo. Dằm nhẹ một phần cà chua để tạo màu nước canh.~Cà chua mềm cạnh, có nước đỏ dưới đáy nồi.
Nấu nước~4 phút~Lửa vừa lớn~Thêm nước, đun sôi rồi hạ về sôi nhẹ. Nêm phần muối còn lại từng ít, nếm vừa.~Nước đỏ nhạt, còn vài múi cà chua nguyên.
Tạo vân trứng~1–2 phút~Lửa nhỏ vừa~Rót trứng thành dòng mảnh theo vòng tròn. Đợi 10–15 giây cho se rồi khuấy nhẹ một chiều, không khuấy mạnh liên tục.~Trứng thành sợi hoặc vân, không vón thành khối lớn.
Làm chín~1–2 phút~Lửa nhỏ~Đun sôi nhẹ đến trứng đông hoàn toàn; món trứng đạt 71°C nếu đo. Không để canh sôi cuộn làm vỡ hết vân trứng.~Trứng chín, không còn lòng trắng trong.
Múc canh~1 phút~Tắt bếp~Rắc hành xanh, múc nhẹ vào tô để giữ vân trứng, đặt vài múi cà chua trên mặt.~Tô có vân trứng vàng nhạt xen cà chua đỏ.
`);
add(17,'400 g|1 g|20 ml','Đường~10~g|Hành tím~15~g|Dầu ăn~5~ml|Nước~200~ml|Hành lá~10~g',15,30,'Ướp cá 15 phút trong ngăn mát','Nồi đáy dày hoặc nồi đất dùng được trên bếp','Khoanh cá nguyên, nước kho nâu sánh bám mặt; tiêu và hành nổi rõ.',`
Chuẩn bị cá~5 phút~Chưa bật bếp~Dùng cá đã làm sạch, cắt khoanh dày 2–3 cm, thấm ráo. Băm hành tím, cắt nhỏ hành lá.~Khoanh cá đều cỡ, không còn máu đọng.
Ướp~15 phút~Không dùng nhiệt~Trộn cá với nước mắm, nửa tiêu, nửa đường và hành tím; đậy kín trong ngăn mát. Trở nhẹ để gia vị phủ hai mặt.~Cá ngấm đều, khoanh không bị nát.
Tạo nước màu~3 phút~Lửa nhỏ~Đun đường còn lại với ít nước đến hổ phách; thêm nước còn lại từ từ. Nếu đường đen hoặc đắng, làm lại; cho dầu vào khi nước màu đã nguội bớt.~Nước màu nâu trong, không mùi cháy.
Kho cá~20–25 phút~Lửa nhỏ~Xếp cá một lớp vào nồi nước màu, thêm cả nước ướp. Đun sôi rồi hạ lửa, hé nắp. Thỉnh thoảng nghiêng nồi, dùng thìa rưới nước lên cá thay vì đảo.~Cá chín đạt 63°C, thịt chắc nhưng không khô.
Làm sánh~3–5 phút~Lửa vừa nhỏ~Mở nắp cho nước rút còn vài thìa quanh cá. Nếm và điều chỉnh bằng chút nước nếu quá mặn; rắc tiêu còn lại.~Sốt bám lưng thìa, không cạn cháy đáy nồi.
Trình bày~1 phút~Tắt bếp~Đặt khoanh cá ra đĩa hoặc giữ trong nồi đất, rưới sốt và rắc hành. Gắp nhẹ để khoanh nguyên.~Cá bóng nâu, tiêu và hành trên mặt; chú ý xương khi ăn.
`);
add(18,'400 g|25 g|20 ml','Đường~8~g|Dầu ăn~10~ml|Hành tím~15~g|Nước~180~ml|Hành lá~10~g',12,30,'Ướp gà 15 phút trong ngăn mát','Nồi hoặc chảo sâu lòng|Nhiệt kế','Gà nâu óng, gừng thái sợi nằm trên thịt, nước kho sánh nhẹ.',`
Cắt gà và gừng~7 phút~Chưa bật bếp~Dùng gà đã sơ chế, thấm khô, cắt miếng 3–4 cm. Gừng rửa sạch, thái sợi; hành tím băm, hành lá cắt nhỏ. Không rửa gà dưới vòi nước để tránh bắn nước thịt sống.~Miếng gà đều, dụng cụ sống tách riêng.
Ướp gà~15 phút~Không dùng nhiệt~Trộn gà với nước mắm, đường, nửa gừng và nửa hành tím; đậy kín để ngăn mát.~Gia vị phủ đều từng miếng.
Xào săn~5 phút~Lửa vừa~Phi hành tím còn lại với dầu, thêm gừng còn lại, đảo thơm. Cho gà và nước ướp vào, trở các mặt đến săn.~Mặt gà đổi màu và bắt đầu óng nâu.
Kho mềm~20–25 phút~Lửa nhỏ~Thêm nước, đun sôi rồi hạ lửa, đậy hé. Trở vài lần; thêm nước nóng nếu cạn sớm. Kiểm tra phần dày của gà, tránh xương, đạt 74°C.~Gà chín kỹ, miếng nguyên, gừng mềm.
Cô sốt~3 phút~Lửa vừa nhỏ~Mở nắp, đảo nhẹ cho nước rút và áo quanh gà. Nếm nước kho, thêm nước nếu quá đậm.~Sốt còn ở đáy, không cháy hoặc khô đặc.
Dọn món~1 phút~Tắt bếp~Múc gà vào tô, gắp gừng lên trên và rắc hành lá. Rưới sốt quanh miếng gà.~Gà và sợi gừng nổi rõ, mặt bóng nhẹ.
`);
add(19,'350 g|2 quả|150 g|20 g','Nước~800~ml|Nước mắm~10~ml|Đường~8~g|Rau om~10~g',12,18,'Không cần ướp','Nồi nhỏ|Rây lọc me','Cá nguyên miếng, canh chua thanh, cà chua đỏ và dứa vàng trong nước canh.',`
Sơ chế~6 phút~Chưa bật bếp~Cá làm sạch cắt khúc 2–3 cm, thấm ráo. Cà chua bổ múi, dứa bỏ mắt cắt lát mỏng, rau om rửa và cắt nhỏ.~Rau và cá được chuẩn bị bằng dụng cụ riêng.
Lọc me~3 phút~Nước nóng~Dầm me trong ít nước nóng lấy từ lượng nước đã định; lọc lấy nước, bỏ hạt và xơ.~Nước me không lẫn hạt.
Nấu cá~8–12 phút~Lửa vừa~Đun phần nước còn lại với dứa, thêm cá khi sôi. Hớt bọt, nấu sôi nhẹ và không đảo mạnh. Đo cá đạt 63°C ở chỗ dày nhất.~Thịt cá chuyển đục, miếng cá không vỡ.
Nêm chua ngọt~4 phút~Lửa vừa nhỏ~Cho cà chua, đường, nước mắm và nửa nước me. Nếm rồi thêm nước me từng chút đến chua dịu.~Cà chua mềm nhưng còn múi, canh không gắt chua.
Thêm rau thơm~30 giây~Tắt bếp~Rắc rau om sau khi tắt bếp, đảo nhẹ một lần. Nếm lại và thêm một chút nước nóng nếu vị quá đậm.~Rau giữ màu xanh và mùi thơm.
Bày canh~1 phút~Tắt bếp~Đặt cá giữa tô, xếp cà chua và dứa quanh, chan nước vừa ngập.~Thấy rõ cá và rau trên mặt; lưu ý xương khi ăn.
`);
add(20,'300 g|3 quả|20 ml','Đường~10~g|Hành tím~15~g|Nước~400~ml|Tiêu~0.5~g',15,55,'Ướp thịt 15 phút trong ngăn mát','Nồi đáy dày|Nồi luộc trứng','Thịt nâu mềm, trứng nguyên vàng nhẹ, nước kho còn xâm xấp.',`
Ướp thịt~15 phút~Không dùng nhiệt~Thấm khô thịt, cắt khối 2–3 cm, băm hành tím. Trộn thịt với hành, nước mắm, tiêu và nửa đường; để ngăn mát.~Miếng thịt đều, gia vị bám quanh.
Luộc trứng~10–12 phút~Lửa vừa~Luộc trứng 10–12 phút tính từ lúc sôi nhẹ. Làm nguội, bóc vỏ, để nguyên quả.~Trứng không vỡ, vỏ được bóc sạch.
Tạo màu và săn thịt~5 phút~Lửa nhỏ rồi vừa~Đun đường còn lại với một ít nước đến hổ phách, thêm nước cẩn thận. Cho thịt vào đảo săn, tránh làm đường cháy.~Thịt có lớp màu nâu nhẹ.
Kho thịt~35–45 phút~Lửa nhỏ~Thêm nước còn lại, đun sôi rồi hạ lửa và hé nắp. Hớt bọt, trở nhẹ; thêm nước nóng khi cạn sớm. Thịt phải đạt ít nhất 63°C và nghỉ 3 phút trước khi ăn.~Thịt xiên dễ, miếng chưa nát.
Kho cùng trứng~10 phút~Lửa nhỏ~Cho trứng vào nồi, trở vài lần để thấm màu. Nêm lại nước kho, giữ còn xâm xấp để trứng không khô.~Trứng vàng nhạt, nước kho dịu và sánh nhẹ.
Bày tô~1 phút~Tắt bếp~Múc thịt và trứng xen kẽ, rưới nước kho. Có thể bổ đôi một quả để thấy lòng đỏ trước khi dọn.~Tô có cả thịt và trứng, dùng cùng cơm riêng.
`);
add(21,'400 g|80 g|80 g|15 ml','Muối~2~g|Hành lá~10~g',10,10,'Dùng cơm đã bảo quản lạnh đúng cách','Chảo rộng|Muôi đảo','Hạt cơm tơi, xen cà rốt cam và đậu xanh, không bết hoặc đọng dầu.',`
Chuẩn bị cơm~3 phút~Chưa bật bếp~Dùng cơm nguội được cho vào tủ lạnh trong vòng 2 giờ sau nấu, giữ lạnh đến lúc dùng. Dùng muôi tách nhẹ các cục cơm. Không dùng cơm để ngoài qua đêm.~Hạt cơm tách rời, không có cục lớn.
Cắt rau~5 phút~Chưa bật bếp~Cà rốt gọt vỏ, thái hạt lựu nhỏ khoảng 5 mm. Rửa đậu và hành; nếu đậu đông lạnh, rã theo hướng dẫn bao bì rồi để ráo.~Rau cắt nhỏ và ráo nước.
Xào rau~3–4 phút~Lửa vừa~Làm nóng dầu, cho cà rốt vào trước, đảo 2 phút rồi thêm đậu. Đảo đến rau gần chín.~Cà rốt hơi mềm, đậu xanh, không cháy cạnh.
Chiên cơm~4–5 phút~Lửa vừa lớn~Cho cơm vào, dùng mặt muôi ép nhẹ cho tơi rồi đảo liên tục. Chia mẻ nếu chảo chật; không thêm nhiều nước.~Cơm và rau trộn đều, hạt tơi.
Nêm và làm nóng kỹ~2 phút~Lửa vừa~Rắc muối, đảo đều; kiểm tra cơm đạt 74°C ở giữa phần cơm. Thêm hành cuối cùng, nếm điều chỉnh.~Cơm nóng đều, không còn chỗ lạnh.
Dọn~1 phút~Tắt bếp~Múc cơm thành ụ thấp trên đĩa, rải vài hạt đậu và cà rốt trên mặt. Ăn ngay khi nóng.~Màu rau phân bố đều, không có vũng dầu.
`);
add(22,'350 g|3 quả|15 ml','Muối~2~g|Tỏi~5~g|Nước~20~ml',8,8,'Không cần ướp','Chảo chống dính','Mướp xanh nhạt, trứng vàng mềm thành miếng, ít nước xào.',`
Sơ chế mướp~4 phút~Chưa bật bếp~Gọt lớp vỏ cứng, rửa mướp rồi cắt vát dày khoảng 1 cm. Nếu mướp có vị đắng bất thường, không dùng. Băm tỏi.~Miếng đều, không quá mỏng dễ nát.
Đánh trứng~2 phút~Không dùng nhiệt~Đánh trứng với một phần ba muối đến lòng trắng và đỏ hòa đều.~Hỗn hợp vàng đồng nhất.
Chiên trứng~2 phút~Lửa vừa~Dùng nửa dầu làm nóng chảo, đổ trứng; khi bắt đầu se, đẩy nhẹ thành miếng lớn rồi lấy ra.~Trứng vừa đông, còn mềm, chưa chiên khô.
Xào mướp~3–4 phút~Lửa vừa lớn~Thêm dầu còn lại, phi tỏi rồi cho mướp. Đảo, thêm muối và nước nếu chảo khô; không thêm nhiều vì mướp tự ra nước.~Mướp hơi trong ở mép, ruột mềm vừa.
Trộn trứng~1–2 phút~Lửa vừa~Cho trứng trở lại, đảo nhẹ để miếng không vụn. Nấu đến trứng chín hoàn toàn, đạt 71°C nếu đo.~Mướp nguyên miếng, trứng không còn ướt sống.
Bày món~1 phút~Tắt bếp~Múc ra đĩa nông, để miếng trứng nằm xen giữa mướp. Rưới vừa đủ nước xào.~Đĩa thấy rõ màu xanh nhạt và vàng.
`);
add(23,'200 g|150 g','Muối~2~g|Dầu ăn~5~ml|Hành tím~10~g|Nước~700~ml',10,12,'Không cần ướp','Nồi nhỏ','Rau ngót xanh sẫm vừa mềm, thịt băm tơi, nước canh trong.',`
Nhặt rau~5 phút~Chưa bật bếp~Tuốt lá, bỏ cọng cứng và lá úa. Rửa sạch, để ráo rồi vò nhẹ lá trong tay sạch để lá mềm hơn, không vò nát.~Lá nguyên phần lớn, không còn cọng già.
Chuẩn bị thịt~2 phút~Chưa bật bếp~Băm hành tím. Trộn thịt với một phần ba muối; giữ thịt và dụng cụ riêng khỏi rau đã rửa.~Thịt tơi, không đóng khối.
Xào thịt~3 phút~Lửa vừa~Phi hành với dầu, cho thịt vào, dùng muôi tách nhỏ và đảo săn.~Thịt thành hạt nhỏ đều.
Nấu nước canh~4 phút~Lửa vừa~Thêm nước, đun sôi rồi hớt bọt. Hạ lửa, kiểm tra thịt băm đạt 71°C.~Nước ít bọt, thịt chín kỹ.
Nấu rau~3–5 phút~Lửa vừa~Cho rau vào, đảo cho ngập. Nêm muối còn lại từng ít, nấu đến lá mềm vừa; không đun lâu đến vàng úa.~Rau xanh sẫm, lá mềm nhưng còn hình.
Múc canh~1 phút~Tắt bếp~Múc rau và nước vào tô, rải thịt lên mặt để không chìm hết dưới đáy.~Canh có rau và thịt rõ, dùng nóng.
`);
add(24,'300 g|2 nhánh|25 ml','Muối~2~g|Ớt tươi (tùy chọn)~0.5~quả',10,15,'Thấm đậu ráo trước khi chiên','Chảo chống dính|Giấy thấm dầu','Đậu vàng giòn, sả băm bám ngoài thành lớp vụn vàng, không cháy đen.',`
Làm ráo đậu~5 phút~Chưa bật bếp~Thấm đậu bằng giấy bếp rồi cắt khối 2–3 cm. Để ra đĩa khô, không xếp chồng khi còn ướt.~Bề mặt khô, miếng nguyên.
Băm sả~4 phút~Chưa bật bếp~Bỏ lá già và gốc sả, chỉ dùng phần lõi trắng mềm. Thái rất mỏng rồi băm nhỏ; ớt bỏ hạt và băm nếu dùng.~Sả mịn, không còn sợi dài cứng.
Chiên đậu~8–10 phút~Lửa vừa~Làm nóng dầu, chiên đậu một lớp. Đợi mặt dưới vàng rồi trở, chiên vàng các mặt và gắp ra.~Vỏ vàng đều, không nát.
Phi sả~1–2 phút~Lửa nhỏ~Chừa một lớp dầu mỏng trong chảo, cho sả vào đảo liên tục. Khi sả thơm vàng nhạt, thêm muối và ớt.~Sả tơi thơm, chưa chuyển nâu.
Áo sả lên đậu~1 phút~Lửa nhỏ~Cho đậu trở lại, lắc chảo hoặc đảo nhẹ cho sả bám. Tắt bếp ngay khi sả đã phủ đều.~Đậu được phủ lớp sả mỏng, không cháy vụn.
Bày đĩa~1 phút~Tắt bếp~Xếp đậu thành lớp, rắc sả còn lại trong chảo lên mặt; dùng nóng để giữ độ giòn.~Đậu vàng rõ và sả nằm trên bề mặt.
`);
add(25,'300 g|80 g|10 g','Dầu ăn~10~ml|Muối~2~g|Nước~20~ml',10,6,'Không cần ướp','Chảo rộng','Bắp cải xanh nhạt, cà rốt cam thái sợi, vừa giòn và không chảy nhiều nước.',`
Cắt bắp cải~4 phút~Chưa bật bếp~Bỏ lá ngoài hỏng và lõi cứng, rửa rồi để ráo. Thái bắp cải thành sợi rộng khoảng 1 cm.~Sợi đều, ráo nước.
Chuẩn bị cà rốt và tỏi~4 phút~Chưa bật bếp~Gọt cà rốt, thái sợi mỏng; bóc tỏi và băm thô. Chuẩn bị sẵn muối và nước.~Cà rốt mỏng để chín cùng bắp cải.
Phi tỏi~30 giây~Lửa vừa~Làm nóng dầu, cho tỏi vào đảo đến thơm.~Tỏi vàng nhạt, không cháy.
Xào cà rốt~2 phút~Lửa vừa lớn~Cho cà rốt vào đảo trước, thêm nước nếu đáy chảo khô. Đảo đến cà rốt hơi mềm.~Sợi cà rốt còn nguyên, không sống cứng.
Xào bắp cải~2–3 phút~Lửa lớn~Thêm bắp cải và muối, đảo từ dưới lên cho chín đều. Không đậy nắp lâu; nếm và tắt khi rau vừa mềm.~Bắp cải còn giòn nhẹ, không thâm và không ngập nước.
Bày món~1 phút~Tắt bếp~Múc rau ra ngay, xếp thành ụ thấp để hơi thoát. Để cà rốt xen đều trên mặt.~Màu xanh nhạt và cam rõ, rau không nát.
`);
add(26,'300 g|15 g|15 ml','Đường~10~g|Dầu ăn~10~ml|Nước~40~ml|Hành lá~10~g',12,10,'Không cần ướp','Chảo rộng','Tôm đỏ cam, còn nguyên vỏ, sốt mặn ngọt bóng bám thân.',`
Làm sạch tôm~7 phút~Chưa bật bếp~Cắt râu và mũi nhọn, rạch nhẹ lưng bỏ chỉ. Rửa nhanh bằng nước sạch rồi thấm ráo. Giữ vỏ để giống ảnh; có thể bỏ đầu nếu thích.~Tôm sạch chỉ lưng và khô bề mặt.
Pha sốt~2 phút~Không dùng nhiệt~Hòa nước mắm, đường và nước; băm hành tím, cắt hành lá.~Đường tan, sốt sẵn bên bếp.
Phi hành~1 phút~Lửa vừa~Làm nóng dầu, phi hành tím đến thơm và vàng nhạt.~Hành chưa nâu đen.
Đảo tôm~3–4 phút~Lửa vừa lớn~Cho tôm vào một lớp, đảo và trở để chuyển đỏ đều. Nếu nhiều tôm, chia mẻ.~Vỏ đỏ cam, thịt bắt đầu trắng đục.
Rim sốt~3–5 phút~Lửa vừa nhỏ~Đổ sốt vào, trở tôm cho áo đều. Nấu đến phần thịt dày đạt 63°C; cho sốt sánh vừa, không rim cạn cháy.~Sốt bám bóng thân tôm, thịt chín và còn mọng.
Bày tôm~1 phút~Tắt bếp~Xếp tôm cong cùng chiều trên đĩa, rưới sốt và rắc hành lá. Dùng khi nóng.~Màu đỏ cam nổi bật, không có vũng dầu lớn.
`);
add(27,'3 quả|150 g|10 g','Nước~90~ml|Nước mắm~8~ml|Dầu ăn~5~ml|Tiêu~0.5~g',8,25,'Không cần ướp','Xửng hấp|Bát chịu nhiệt nông|Nhiệt kế','Trứng mềm đông đều, thịt băm phân bố bên trong, mặt có hành xanh.',`
Chuẩn bị xửng~3 phút~Lửa lớn~Cho nước vào đáy xửng, mức nước không chạm bát. Đun sôi; quét dầu mỏng vào bát chịu nhiệt sâu khoảng 3–4 cm.~Xửng có hơi, bát đứng vững.
Trộn thịt~2 phút~Không dùng nhiệt~Trộn thịt băm với nước mắm và tiêu, dùng đũa tách thịt cho tơi. Rửa hành, thái nhỏ.~Thịt không thành cục lớn.
Đánh trứng~2 phút~Không dùng nhiệt~Đánh tan trứng với lượng nước đã định, trộn cùng thịt và phần lớn hành. Hớt bọt trên mặt, đổ vào bát.~Hỗn hợp đều, lớp trứng không quá dày.
Hấp~20–25 phút~Lửa nhỏ vừa~Đặt bát vào xửng, đậy bát bằng đĩa nhỏ hoặc giấy bạc có khe thoát hơi để nước không nhỏ vào. Hấp sôi nhẹ; không mở nắp liên tục.~Mặt trứng đông dần, không phồng rỗ mạnh.
Kiểm tra giữa bát~2–5 phút~Lửa nhỏ~Cắm nhiệt kế vào giữa món, đạt 71°C. Nếu còn lỏng, hấp thêm từng 3 phút. Với nhiều khẩu phần, chia bát nông thay vì dùng một bát rất dày.~Giữa bát đông, thịt chín kỹ, không có nước trứng sống.
Dọn~2 phút~Tắt bếp~Để bát nghỉ 2 phút, rắc hành còn lại. Dùng thìa sạch xắn miếng để thấy phần trứng và thịt.~Trứng giữ miếng nhưng mềm, ăn nóng.
`);
add(28,'150 g|200 g|10 g','Muối~2~g|Nước~700~ml|Tiêu~0.5~g',8,10,'Không cần ướp','Nồi nhỏ','Canh trong, đậu trắng nguyên khối, nấm chín mềm và hành xanh.',`
Sơ chế nấm~4 phút~Chưa bật bếp~Cắt bỏ gốc nấm, rửa nhanh, để ráo. Nấm lớn thái lát 5 mm hoặc xé miếng vừa ăn.~Nấm sạch, không ngâm lâu làm nhũn.
Cắt đậu và hành~3 phút~Chưa bật bếp~Cắt đậu thành khối 2 cm. Rửa hành, thái nhỏ; đậu để riêng để không vỡ khi trộn.~Khối đậu đều và nguyên.
Nấu nấm~4–5 phút~Lửa vừa~Đun nước sôi, cho nấm vào, hạ lửa và nấu đến nấm mềm. Hớt bọt nếu có.~Nấm chín, nước canh ít bọt.
Thêm đậu~3–4 phút~Lửa nhỏ vừa~Thả đậu sát mặt nước để tránh bắn. Chỉ lắc nồi nhẹ, không khuấy mạnh. Thêm muối từng ít và nếm.~Đậu nóng tới giữa, nước sôi nhẹ.
Hoàn thiện vị~1 phút~Lửa nhỏ~Kiểm tra nấm đã mềm, thêm tiêu nếu thích; tắt bếp rồi rắc hành.~Canh thanh, không mặn gắt.
Trình bày~1 phút~Tắt bếp~Múc đậu và nấm vào tô trước, chan nước quanh để không làm vỡ đậu, rắc hành trên mặt.~Khối đậu trắng và nấm nổi rõ như ảnh.
`);
add(29,'350 g|2 quả|100 g','Giấm~15~ml|Đường~15~g|Nước mắm~15~ml|Dầu ăn~15~ml|Tỏi~5~g|Nước~200~ml',15,35,'Không cần ướp','Nồi chần|Chảo sâu lòng','Sườn vàng nâu áo sốt đỏ cam chua ngọt, hành tây còn miếng.',`
Chuẩn bị~8 phút~Chưa bật bếp~Dùng sườn đã chặt miếng 3–4 cm, chần 3 phút rồi bỏ nước và làm sạch bọt bám. Cà chua thái nhỏ, hành tây cắt miếng, tỏi băm.~Sườn sạch cặn, rau được cắt riêng.
Pha sốt~2 phút~Không dùng nhiệt~Hòa giấm, đường, nước mắm và nửa lượng nước; khuấy tan. Nửa nước còn lại để om sườn.~Sốt có vị chua ngọt cân bằng, chưa cần nêm quá đậm.
Áp chảo sườn~6–8 phút~Lửa vừa~Làm nóng dầu, áp chảo sườn cho vàng nhẹ các mặt, lấy ra. Không chiên lửa quá lớn vì bên trong chưa chín.~Mặt ngoài vàng, không cháy đen.
Om cho mềm~20–25 phút~Lửa nhỏ~Phi tỏi, xào cà chua 3 phút, dằm cho ra màu. Cho sườn, sốt và nước còn lại vào, đun sôi rồi hạ lửa, hé nắp. Thêm nước nóng nếu cạn sớm.~Sườn xiên dễ, thịt đạt ít nhất 63°C; sau nấu nghỉ 3 phút.
Thêm hành và cô sốt~3 phút~Lửa vừa~Cho hành tây vào đảo, mở nắp cho sốt sánh. Nếm, thêm chút nước nếu mặn hoặc chua gắt.~Sốt bám sườn, hành vừa trong và còn giòn.
Bày đĩa~1 phút~Tắt bếp~Xếp sườn thành một lớp, rưới sốt và hành lên trên. Không múc quá nhiều dầu.~Sườn bóng đỏ nâu, thấy rõ từng miếng.
`);
add(30,'150 g|200 g|80 g|15 ml','Dầu ăn~15~ml|Tỏi~5~g|Nước~30~ml',10,8,'Không cần ướp','Nồi chần mì|Chảo rộng|Rổ ráo','Sợi mì tơi, rau xanh và cà rốt cam xen đều, không bết sốt.',`
Chuẩn bị rau~5 phút~Chưa bật bếp~Rửa rau cải, để ráo rồi cắt đoạn 4 cm, để thân và lá riêng. Cà rốt thái sợi mỏng, tỏi băm.~Rau ráo để không làm mì ướt.
Chần mì~2–4 phút~Lửa lớn~Luộc hoặc ngâm mì theo bao bì nhưng dừng sớm hơn khoảng 1 phút vì còn xào. Vớt, để ráo và trộn một ít dầu từ lượng đã chuẩn bị.~Sợi mềm nhưng còn độ dai, không nhũn.
Phi tỏi~30 giây~Lửa vừa~Cho dầu còn lại vào chảo, phi tỏi đến thơm.~Tỏi vàng nhạt.
Xào rau~3 phút~Lửa vừa lớn~Cho cà rốt và thân cải vào trước, đảo 2 phút rồi thêm lá. Rưới nước nếu khô; chỉ xào đến gần chín.~Rau còn xanh, cà rốt hơi mềm.
Xào mì~2–3 phút~Lửa vừa lớn~Cho mì vào, rưới nước tương quanh chảo. Dùng đũa và xẻng nâng đảo nhẹ từ dưới lên, không ép nát sợi. Nếu nhiều khẩu phần, chia mẻ.~Mì nóng đều, sốt bám mỏng và sợi tơi.
Bày món~1 phút~Tắt bếp~Gắp mì thành ụ trên đĩa, xếp rau và cà rốt lên mặt. Dùng ngay khi nóng.~Sợi mì rõ, rau xen đều như ảnh.
`);

const patches=guides.map(g=>{
 const additions=[];
 // Add missing principal ingredients to the priced shopping list; pantry remains explicitly separate.
 const missing=g.id==='recipe-013'?[['Thịt heo băm',120,140,'g','deal-001']]:g.id==='recipe-006'?[['Trứng gà',3,3500,'quả','deal-003']]:g.id==='recipe-002'?[['Thịt heo băm',100,140,'g','deal-001']]:[];
 for(const [name,quantity,price,unit,imageId] of missing){
  const id=`${g.id}-extra-${additions.length+1}`;
  additions.push({id,name,quantity,price,unit,store:'Bach Hoa Xanh',category:'Đạm',image:name==='Thịt heo băm'?'/images/catalog/i-015-1.svg':`/images/food/${imageId}.webp`});
  g.cookingGuide.measures.push({ingredientId:id,name,quantity,unit});
  g.cookingGuide.pantry=g.cookingGuide.pantry.filter(i=>i.name!==name);
 }
 return {...g,additions};
});
const block=`\n\n${marker}\nconst cookingPatches = ${JSON.stringify(patches,null,2)};\nfor (const patch of cookingPatches) {\n const r = recipes.find(r => r.id === patch.id); if (!r) continue;\n r.ingredients.push(...patch.additions as Ingredient[]);\n r.prepTime = patch.prepTime; r.cookTime = patch.cookTime;\n r.cookingGuide = patch.cookingGuide;\n r.instructions = patch.cookingGuide.steps.map(s => s.title + ': ' + s.detail + ' ' + s.cue);\n r.totalPrice = r.ingredients.reduce((sum,i)=>sum+i.price*i.quantity,0);\n}\n`;
fs.writeFileSync(file,source+block);
console.log(JSON.stringify({guides:patches.length,steps:patches.reduce((s,p)=>s+p.cookingGuide.steps.length,0)}));
