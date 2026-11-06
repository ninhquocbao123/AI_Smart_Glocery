import pathlib, sys, subprocess, re, json
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / '.video-tools'))
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont
ff = imageio_ffmpeg.get_ffmpeg_exe()
out = ROOT / 'video-output' / 'gioi-thieu'
out.mkdir(exist_ok=True)
scenes = [(0, 'HÔM NAY ĂN GÌ?', 'Ăn ngon, dễ nấu, vừa túi tiền'), (2, 'BẮT ĐẦU TỪ NGÂN SÁCH', 'Chọn số tiền và số người ăn'), (3, 'KHÁM PHÁ MÓN NGON', 'Xem chi phí dự kiến và thời gian nấu'), (5, 'TỰ TIN VÀO BẾP', 'Nguyên liệu rõ ràng · Hướng dẫn từng bước'), (6, 'MUA ĐÚNG PHẦN CẦN', 'Chọn nguyên liệu theo từng món'), (8, 'CHỦ ĐỘNG CHI TIÊU', 'Theo dõi ngân sách và lịch sử đơn hàng'), (9, 'TRỢ LÝ BỮA ĂN', 'Hỏi về món ăn và cách sử dụng website'), (10, 'BỮA NGON ĐỂ “AI” LO', 'Trải nghiệm và chia sẻ góp ý cùng nhóm')]
font = lambda s: ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', s)
total = 0
for n, (idx, title, subtitle) in enumerate(scenes):
    overlay = Image.new('RGBA', (1920,1080)); d = ImageDraw.Draw(overlay)
    d.rectangle((0,925,1920,1080), fill=(10,55,33,248))
    d.rectangle((55,951,63,1045), fill='#F9BC54')
    d.text((86,946),title,font=font(36),fill='white')
    d.text((86,1001),subtitle,font=font(25),fill='#D7E9D9')
    d.text((1360,968),'AI SMART GROCERY',font=font(27),fill='white')
    d.text((1360,1010),'ai-smart-glocery.vercel.app',font=font(22),fill='#F9BC54')
    png = out / f'title-{n}.png'; overlay.save(png)
    source = ROOT / 'video-output' / 'live' / f'clip-{idx:02d}-HQ.mp4'
    p = subprocess.run([ff,'-i',str(source)],capture_output=True,text=True)
    match = re.search(r'Duration: (\d+):(\d+):([\d.]+)',p.stderr)
    dur = int(match[1])*3600+int(match[2])*60+float(match[3]); total += dur
    cmd=[ff,'-y','-i',str(source),'-i',str(png),'-filter_complex','[0:v][1:v]overlay=0:0[v]','-map','[v]','-map','0:a','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','copy',str(out/f'scene-{n}.mp4')]
    subprocess.run(cmd,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    print(f'Hoan thanh canh {n+1}/{len(scenes)}',flush=True)
(out/'join.txt').write_text('\n'.join(f"file 'scene-{i}.mp4'" for i in range(len(scenes))))
target = out / 'AI-Smart-Grocery-Gioi-Thieu.mp4'
subprocess.run([ff,'-y','-f','concat','-safe','0','-i',str(out/'join.txt'),'-i',str(ROOT/'video-output/music.wav'),'-filter_complex',f'[1:a]volume=0.16,afade=t=out:st={total-3}:d=3[m];[0:a][m]amix=inputs=2:duration=first:normalize=0[a]','-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-movflags','+faststart',str(target)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
print(json.dumps({'file':str(target),'seconds':total,'bytes':target.stat().st_size}),flush=True)
subprocess.run([ff,'-y','-ss','30','-i',str(target),'-frames:v','1',str(out/'preview.jpg')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
