import sys, pathlib, json, asyncio, subprocess, math, wave
ROOT=pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'.video-tools'))
from PIL import Image, ImageDraw, ImageFont, ImageOps
import numpy as np
import imageio_ffmpeg
OUT=ROOT/'video-output'; OUT.mkdir(exist_ok=True)
SCENES=[
('HÔM NAY ĂN GÌ?', 'Một câu hỏi nhỏ.\nMột bài toán mỗi ngày.', 'Giữa lịch học, công việc và những khoản chi mỗi tháng, hôm nay ăn gì đôi khi lại là câu hỏi khó nhất. Ăn ngon, dễ nấu, mà vẫn vừa túi tiền. Bạn có từng băn khoăn như vậy?', 'recipe-013.webp'),
('AI SMART GROCERY', 'BỮA NGON\nĐỂ “AI” LO', 'Nhóm chúng mình giới thiệu AI Smart Grocery, dự án môn EXE202 tại Đại học FPT. Một website giúp bạn bắt đầu bữa ăn từ chính ngân sách của mình, rồi từng bước chọn món và chuẩn bị nguyên liệu.', None),
('01 / CHỌN NGÂN SÁCH', '50.000đ hôm nay.\nBạn muốn nấu gì?', 'Tại trang Home, hãy nhập số tiền muốn chi và chọn số người ăn. Ví dụ, năm mươi nghìn đồng cho một người. Nhấn tìm thực đơn để khám phá những món phù hợp với ngân sách và khẩu vị của bạn.', 'recipe-001.webp'),
('02 / KHÁM PHÁ MÓN NGON', 'Nhiều lựa chọn.\nMột ngân sách của bạn.', 'Danh sách gợi ý giúp bạn xem ảnh món ăn, thời gian nấu và chi phí dự kiến. Bạn có thể ưu tiên món tiết kiệm hoặc món nấu nhanh. Mỗi món là một lựa chọn riêng, để bạn chủ động quyết định bữa ăn.', 'recipe-003.webp'),
('03 / SMART CART', 'Món Việt quen thuộc.\nBữa cơm thêm đa dạng.', 'Bạn muốn tự chọn món? Mở Smart Cart để khám phá những món Việt quen thuộc hằng ngày. Từ canh rau đến các món mặn, bạn có thêm cảm hứng cho bữa cơm, mà không phải nghĩ lại từ đầu mỗi ngày.', 'recipe-005.webp'),
('04 / CÙNG VÀO BẾP', 'Từ nguyên liệu\nđến món ăn hoàn chỉnh.', 'Bấm vào một món để xem nguyên liệu và hướng dẫn nấu. Điều chỉnh khẩu phần, đánh dấu nguyên liệu đã có, rồi làm theo từng bước. Phần cùng vào bếp giúp người mới nấu tự tin hơn khi chuẩn bị bữa ăn.', 'recipe-013.webp'),
('05 / GIỎ HÀNG', 'Chọn một món.\nHoặc chuẩn bị cả bữa.', 'Nguyên liệu được chia theo món trong giỏ hàng. Bạn có thể chọn một món hoặc chọn tất cả để đặt chung. Những món chưa chọn vẫn được giữ lại, giúp bạn mua đúng phần cần thiết cho lần nấu này.', 'recipe-008.webp'),
('06 / DEALS', 'Tham khảo ưu đãi.\nBổ sung thứ còn thiếu.', 'Khi thiếu nguyên liệu, trang Deals giúp bạn tham khảo các sản phẩm khuyến mãi do nhóm quản trị cập nhật. Kết hợp với những gì đã có trong bếp, bạn sẽ dễ lên danh sách mua sắm và hạn chế mua dư.', 'deal-001.webp'),
('07 / THANH TOÁN', 'Đặt hàng. Quét QR.\nTheo dõi xác nhận.', 'Với điểm bán đã mở nhận đơn và đủ nguyên liệu, bạn có thể đặt hàng rồi thanh toán bằng mã QR qua payOS. Hệ thống chỉ ghi nhận đã thanh toán sau khi xác minh giao dịch, giúp trạng thái đơn rõ ràng hơn.', None),
('08 / MY BUDGET & ORDERS', 'Biết mình đã mua gì.\nBiết mình đã chi bao nhiêu.', 'My Budget giúp theo dõi chi tiêu theo tháng. Trang Orders lưu các đơn hàng và trạng thái xử lý, đồng thời cho phép mua lại nhanh. Bạn có thể nhìn lại thói quen mua sắm để chủ động cân đối ngân sách của mình.', 'recipe-010.webp'),
('09 / TRỢ LÝ BỮA ĂN', 'Có câu hỏi?\nBắt đầu một cuộc trò chuyện.', 'Trợ lý bữa ăn hỗ trợ giải đáp về món ăn và cách sử dụng website. Từ việc tìm nguyên liệu đến khám phá các tính năng, bạn có thêm một nơi để hỏi khi cần, ngay trong hành trình chuẩn bị bữa ăn.', None),
('TRẢI NGHIỆM CÙNG NHÓM', 'Ăn ngon hơn.\nChi tiêu chủ động hơn.', 'Hãy trải nghiệm AI Smart Grocery và chia sẻ góp ý với nhóm chúng mình. Mỗi phản hồi sẽ giúp dự án hoàn thiện hơn. Truy cập website ngay hôm nay. AI Smart Grocery. Bữa ngon để AI lo!', None),
]
FONT='C:/Windows/Fonts/arial.ttf'; BOLD='C:/Windows/Fonts/arialbd.ttf'
def font(n,b=False): return ImageFont.truetype(BOLD if b else FONT,n)
def wrap(draw,text,f,width):
    lines=[]
    for paragraph in text.split('\n'):
        line=''
        for word in paragraph.split():
            new=(line+' '+word).strip()
            if draw.textlength(new,font=f)>width and line: lines.append(line); line=word
            else: line=new
        lines.append(line)
    return lines
def render(i):
    label,title,narr,photo=SCENES[i]; im=Image.new('RGB',(1920,1080),'#F5F7ED'); d=ImageDraw.Draw(im)
    d.ellipse((1400,-300,2200,500),fill='#E4EED8'); d.rectangle((0,1048,1920,1080),fill='#16753E')
    d.text((100,75),'AI SMART GROCERY',font=font(27,True),fill='#16753E')
    d.text((100,207),label,font=font(24,True),fill='#16753E')
    y=278
    for line in wrap(d,title,font(70,True),1000): d.text((95,y),line,font=font(70,True),fill='#153E29'); y+=91
    captions=['Dành cho những bữa ăn vừa túi tiền.','Dự án EXE202 · Đại học FPT','Nhập ngân sách → Chọn số người → Tìm thực đơn','Sắp xếp theo chi phí hoặc thời gian nấu.','Khám phá danh mục món Việt mỗi ngày.','Nguyên liệu rõ ràng · Hướng dẫn từng bước','Chọn món cần mua · Giữ lại món chưa chọn','Ưu đãi được cập nhật bởi nhóm quản trị.','QR ngân hàng qua payOS','Theo dõi chi tiêu · Lịch sử đơn · Mua lại','Hỏi về món ăn và cách sử dụng website.','ai-smart-glocery.vercel.app']
    y=max(y+38,565)
    for line in wrap(d,captions[i],font(31),960): d.text((100,y),line,font=font(31),fill='#596B60'); y+=46
    d.rounded_rectangle((100,740,640,823),radius=40,fill='#16753E'); d.text((132,761),'BỮA NGON ĐỂ “AI” LO',font=font(32,True),fill='white')
    if photo:
        pic=ImageOps.fit(Image.open(ROOT/'public/images/food'/photo).convert('RGB'),(670,680))
        mask=Image.new('L',pic.size); ImageDraw.Draw(mask).rounded_rectangle((0,0,670,680),radius=55,fill=255); im.paste(pic,(1150,200),mask)
    else:
        pic=Image.open(ROOT/'public/images/brand/logo.png').convert('RGBA'); pic.thumbnail((650,650)); im.paste(pic,(1150,200),pic)
    d.text((100,944),'ai-smart-glocery.vercel.app',font=font(25),fill='#16753E'); d.text((1715,944),f'{i+1:02d} / 12',font=font(25),fill='#596B60')
    im.save(OUT/f'scene-{i:02d}.png')
async def voices():
    import edge_tts
    for i,s in enumerate(SCENES):
        if not (OUT/f'voice-male-{i:02d}.mp3').exists():
            await edge_tts.Communicate(s[2],'vi-VN-NamMinhNeural',rate='+12%').save(str(OUT/f'voice-male-{i:02d}.mp3'))
        print('Voice',i,flush=True)
def build():
    ff=imageio_ffmpeg.get_ffmpeg_exe(); lengths=[]
    for i in range(len(SCENES)):
        render(i)
        audio=OUT/f'voice-male-{i:02d}.mp3'
        if audio.exists() and audio.stat().st_size:
            p=subprocess.run([ff,'-i',str(audio),'-f','null','-'],capture_output=True,text=True)
            import re
            m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',p.stderr); dur=int(m[1])*3600+int(m[2])*60+float(m[3]); lengths.append(dur+0.65)
        else: lengths.append(11.25)
    total=sum(lengths); scale=135/total
    print('Narration seconds:', round(total,2), 'Playback adjustment:', round(1/scale,3), flush=True)
    elapsed=0; subtitles=[]
    def stamp(seconds):
        ms=round(seconds*1000); return f'{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}'
    for i,length in enumerate(lengths):
        chunks=[s.strip()+'.' for s in SCENES[i][2].split('.') if s.strip()]
        duration=length*scale
        for j,chunk in enumerate(chunks):
            subtitles.append(f'{len(subtitles)+1}\n{stamp(elapsed+duration*j/len(chunks))} --> {stamp(elapsed+duration*(j+1)/len(chunks))}\n{chunk}\n')
        elapsed+=duration
    (OUT/'AI-Smart-Grocery-135s.srt').write_text('\n'.join(subtitles),encoding='utf-8')
    for i,duration in enumerate(lengths):
        duration*=scale; frames=round(duration*25)
        args=[ff,'-y','-loop','1','-i',str(OUT/f'scene-{i:02d}.png')]
        audio=OUT/f'voice-male-{i:02d}.mp3'; has=audio.exists() and audio.stat().st_size>0
        if has: args+=['-i',str(audio)]
        else: args+=['-f','lavfi','-i','anullsrc=r=44100:cl=stereo']
        args+=['-vf',f"scale=1920:1080,zoompan=z='min(zoom+0.000025,1.012)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1920x1080:fps=25,fade=t=in:st=0:d=0.35,fade=t=out:st={duration-.35}:d=0.35",'-af',f'atempo={1/scale},apad','-t',str(duration),'-c:v','libx264','-preset','ultrafast','-crf','23','-pix_fmt','yuv420p','-c:a','aac',str(OUT/f'part-{i:02d}.mp4')]
        subprocess.run(args,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,check=True); print('Rendered',i,flush=True)
    (OUT/'concat.txt').write_text('\n'.join(f"file 'part-{i:02d}.mp4'" for i in range(12)))
    subprocess.run([ff,'-y','-f','concat','-safe','0','-i',str(OUT/'concat.txt'),'-c','copy','-movflags','+faststart',str(OUT/'AI-Smart-Grocery-intro.mp4')],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,check=True)
    # Original, locally synthesized instrumental bed; no downloaded music.
    sr=44100; track=np.zeros(sr*136,dtype=np.float32)
    chords=[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]]
    for beat in range(272):
        t=np.arange(int(sr*.65))/sr; chord=chords[(beat//8)%4]; hz=chord[beat%3]*(2 if beat%4==3 else 1)
        tone=(np.sin(2*np.pi*hz*t)+.2*np.sin(2*np.pi*hz*2*t))*np.exp(-t*6)*np.minimum(t*60,1)*.11
        start=int(beat*.5*sr); end=min(start+len(tone),len(track)); track[start:end]+=tone[:end-start]
    track[:sr*2]*=np.linspace(0,1,sr*2); track[-sr*4:]*=np.linspace(1,0,sr*4)
    with wave.open(str(OUT/'music.wav'),'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((track*32767).astype('<i2').tobytes())
    subprocess.run([ff,'-y','-i',str(OUT/'AI-Smart-Grocery-intro.mp4'),'-i',str(OUT/'music.wav'),'-filter_complex','[0:a]volume=1[a];[1:a]volume=0.25[b];[a][b]amix=inputs=2:duration=first:normalize=0[m]','-map','0:v','-map','[m]','-c:v','copy','-c:a','aac','-shortest','-movflags','+faststart',str(OUT/'AI-Smart-Grocery-135s.mp4')],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,check=True)
    (OUT/'Loi-dan.txt').write_text('\n\n'.join(f'{i+1}. {s[0]}\n{s[2]}' for i,s in enumerate(SCENES)),encoding='utf-8')
    print('DONE',flush=True)
if __name__=='__main__':
    if '--voice' in sys.argv: asyncio.run(voices())
    else: build()
