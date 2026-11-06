import pathlib, sys, asyncio, subprocess, re, json
ROOT=pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'.video-tools'))
import edge_tts, imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont, ImageOps
OUT=ROOT/'video-output'/'ban-theo-mau'; OUT.mkdir(exist_ok=True)
ff=imageio_ffmpeg.get_ffmpeg_exe()
SCENES=[
('MỖI BỮA ĂN, MỘT NỖI LO','Sau những giờ học và làm việc, ai cũng mong có một bữa cơm ngon. Nhưng hôm nay ăn gì, và chi bao nhiêu cho vừa đủ?', 'recipe-013.webp'),
('ĂN NGON. VỪA TÚI TIỀN.','Bạn muốn tự nấu, nhưng chưa biết chọn món? Mua nguyên liệu thế nào để không vượt ngân sách?', 'recipe-003.webp'),
('AI SMART GROCERY','AI Smart Grocery giúp bạn bắt đầu từ ngân sách, chọn món phù hợp và chuẩn bị nguyên liệu cho bữa ăn mỗi ngày.',10),
('01 / CHỌN NGÂN SÁCH','Đầu tiên, nhập số tiền muốn chi và số người ăn. Khám phá những món ăn cùng chi phí dự kiến và thời gian nấu.',2),
('02 / CHỌN MÓN, VÀO BẾP','Chọn món bạn thích. Xem nguyên liệu, điều chỉnh khẩu phần và làm theo hướng dẫn nấu từng bước.',5),
('03 / CHUẨN BỊ NGUYÊN LIỆU','Thêm nguyên liệu vào giỏ hàng. Chọn những món cần mua để chuẩn bị vừa đủ cho bữa cơm của bạn.',6),
('04 / CHỦ ĐỘNG CHI TIÊU','Theo dõi ngân sách và lịch sử đơn hàng, để mỗi lần mua sắm đều chủ động hơn.',8),
('BỮA NGON ĐỂ “AI” LO','AI Smart Grocery. Ăn ngon hơn, chi tiêu chủ động hơn. Truy cập website và trải nghiệm ngay hôm nay!',None)]
def font(n,b=False):return ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf' if b else 'C:/Windows/Fonts/arial.ttf',n)
def lines(d,text,f,width):
    result=[]; line=''
    for w in text.split():
        test=(line+' '+w).strip()
        if d.textlength(test,font=f)>width and line:result.append(line);line=w
        else:line=test
    return result+[line]
def center(d,text,y,f,fill='white',width=1650):
    for line in lines(d,text,f,width):
        d.text(((1920-d.textlength(line,font=f))/2,y),line,font=f,fill=fill);y+=int(f.size*1.35)
async def voices():
    for i,(_,narr,_) in enumerate(SCENES):
        p=OUT/f'voice-{i}.mp3'
        if not p.exists() or not p.stat().st_size:
            await edge_tts.Communicate(narr,'vi-VN-NamMinhNeural',rate='+8%').save(str(p))
        print('Voice',i+1,flush=True)
def run(args):
    p=subprocess.run([ff,'-y']+args,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    if p.returncode:raise RuntimeError(p.stderr.decode(errors='replace')[-1800:])
def duration(path):
    p=subprocess.run([ff,'-i',str(path)],capture_output=True,text=True)
    m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',p.stderr)
    return int(m[1])*3600+int(m[2])*60+float(m[3])
def build():
    preview='--visual-preview' in sys.argv
    old=[0,0,11,2,5,6,9,11]
    voices=[ROOT/'video-output'/f'voice-male-{old[i]:02d}.mp3' if preview else OUT/f'voice-{i}.mp3' for i in range(8)]
    ds=[duration(p)+.3 for p in voices]; factor=61/sum(ds)
    for i,(title,narr,src) in enumerate(SCENES):
        t=ds[i]*factor
        im=Image.new('RGB',(1920,1080),'#EEF3EC');d=ImageDraw.Draw(im)
        if isinstance(src,str):
            im=ImageOps.fit(Image.open(ROOT/'public/images/food'/src).convert('RGB'),(1920,1080))
            dark=Image.new('RGBA',im.size,(0,20,10,130));im=Image.alpha_composite(im.convert('RGBA'),dark);d=ImageDraw.Draw(im)
            d.text((95,80),'AI SMART GROCERY',font=font(30,True),fill='#F5D88D')
            center(d,title,420,font(66,True))
        elif src is None:
            d.rectangle((0,0,1920,1080),fill='#0D432C')
            logo=Image.open(ROOT/'public/images/brand/logo.png').convert('RGBA');logo.thumbnail((290,290));im.paste(logo,((1920-logo.width)//2,90),logo)
            center(d,'AI SMART GROCERY',405,font(68,True))
            center(d,title,515,font(47,True),fill='#F8CD73')
            d.rounded_rectangle((380,665,1540,770),radius=50,fill='#F0F5E9')
            center(d,'ai-smart-glocery.vercel.app',690,font(45,True),fill='#0D432C')
        else:
            center(d,title,24,font(31,True),fill='#195338')
            d.rounded_rectangle((295,78,1625,849),radius=25,fill='#19241F')
            d.ellipse((955,85,964,94),fill='#6E8476')
            d.polygon([(295,850),(1625,850),(1765,905),(155,905)],fill='#A5B0AA')
            d.rounded_rectangle((155,900,1765,921),radius=10,fill='#68756D')
            d.rectangle((818,850,1102,865),fill='#79877D')
        # Short subtitles follow the narration, changing at sentence boundaries.
        bg=OUT/f'bg-{i}.png'; im.convert('RGB').save(bg)
        chunks=[x.strip() for x in re.split(r'(?<=[.!?])\s+',narr) if x.strip()]
        args=['-loop','1','-i',str(bg)]
        filters=[]
        if isinstance(src,int):
            args+=['-stream_loop','-1','-i',str(ROOT/'video-output/live'/f'clip-{src:02d}-HQ.mp4')]
            filters.append('[1:v]scale=1280:720,setsar=1[screen];[0:v][screen]overlay=320:103[base]')
            base='base'; audidx=2
        else:
            filters.append("[0:v]zoompan=z='min(zoom+0.00010,1.025)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1920x1080:fps=25[base]")
            base='base';audidx=1
        args+=['-i',str(voices[i])]
        for j,chunk in enumerate(chunks):
            sub=Image.new('RGBA',(1920,1080));sd=ImageDraw.Draw(sub)
            sd.rectangle((0,936,1920,1080),fill=(7,30,20,225))
            center(sd,chunk,960,font(34),width=1690)
            path=OUT/f'sub-{i}-{j}.png';sub.save(path)
            inputidx=audidx+1+j;args+=['-i',str(path)]
            start=t*j/len(chunks);end=t*(j+1)/len(chunks)
            filters.append(f"[{base}][{inputidx}:v]overlay=0:0:enable='between(t,{start},{end})'[s{j}]");base=f's{j}'
        filters.append(f'[{base}]fps=25,fade=t=in:d=0.25,fade=t=out:st={t-.25}:d=0.25[v]')
        args+=['-filter_complex',';'.join(filters),'-map','[v]','-map',f'{audidx}:a','-af',f'atempo={1/factor},apad','-t',str(t),'-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-ar','44100',str(OUT/f'part-{i}.mp4')]
        run(args); print('Rendered',i+1,'/8',flush=True)
    (OUT/'join.txt').write_text('\n'.join(f"file 'part-{i}.mp4'" for i in range(8)))
    target=OUT/('AI-Smart-Grocery-Ban-Duyet-Hinh.mp4' if preview else 'AI-Smart-Grocery-Phong-Cach-VAM.mp4')
    mix='[1:a]volume=0.5,afade=t=out:st=58:d=3[a]' if preview else '[1:a]volume=0.18,afade=t=out:st=58:d=3[m];[0:a][m]amix=inputs=2:duration=first:normalize=0[a]'
    run(['-f','concat','-safe','0','-i',str(OUT/'join.txt'),'-i',str(ROOT/'video-output/music.wav'),'-filter_complex',mix,'-map','0:v','-map','[a]','-t','61','-c:v','copy','-c:a','aac','-b:a','192k','-movflags','+faststart',str(target)])
    (OUT/'Loi-dan.txt').write_text('\n\n'.join(t+'\n'+n for t,n,s in SCENES),encoding='utf-8')
    for sec in [4,24,58]:run(['-ss',str(sec),'-i',str(target),'-frames:v','1',str(OUT/f'preview-{sec}.jpg')])
    print('DONE',target,duration(target),flush=True)
if __name__=='__main__':
    if '--voice' in sys.argv:asyncio.run(voices())
    else:build()
