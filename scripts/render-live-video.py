import pathlib, json, sys, subprocess, re
from PIL import Image, ImageDraw
ROOT=pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'.video-tools'))
import imageio_ffmpeg
OUT=ROOT/'video-output'; LIVE=OUT/'live'; ff=imageio_ffmpeg.get_ffmpeg_exe()
ultra='--4k' in sys.argv
high_quality='--hq' in sys.argv or ultra
suffix='-4K' if ultra else ('-HQ' if high_quality else '')
frames=json.loads((LIVE/'frames.json').read_text()); cuts=json.loads((LIVE/'cuts.json').read_text())
ranges={}; start=0
sheet=Image.new('RGB',(1280,1250),'white'); draw=ImageDraw.Draw(sheet)
for i,cut in enumerate(cuts):
    ranges[cut['label']]=(start,cut['end']); start=cut['end']
    photo=Image.open(LIVE/frames[cut['end']-10]['name']).resize((320,180))
    sheet.paste(photo,((i%4)*320,(i//4)*250)); draw.text(((i%4)*320+8,(i//4)*250+185),cut['label'],fill='black')
sheet.save(LIVE/'review.jpg')
if '--review' in sys.argv: sys.exit()
# Only genuine browser captures. Omit empty Deals and address-bearing order details.
scenes=[(0,['landing']), (1,['landing']), (2,['home','search']), (3,['results','browse']), (4,['catalog']), (5,['recipe','ingredients','cooking']), (6,['second-recipe','cart-two','select-cart']), (8,['checkout']), (9,['budget','orders']), (10,['chat']), (11,['landing'])]
lengths=[]
for voice,_ in scenes:
    p=subprocess.run([ff,'-i',str(OUT/f'voice-male-{voice:02d}.mp3'),'-f','null','-'],capture_output=True,text=True)
    m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',p.stderr)
    lengths.append(int(m[1])*3600+int(m[2])*60+float(m[3])+.45)
scale=135/sum(lengths)
for n,((voice,labels),length) in enumerate(zip(scenes,lengths)):
    chosen=[]
    for label in labels:
        a,b=ranges[label]
        # Trim waiting time at the beginning of data-heavy pages.
        if label in ['results','catalog','budget','orders','chat']: a+=int((b-a)*.3)
        if label=='search': b=min(b,a+20)
        chosen.extend(frames[a:b])
    duration=length*scale; step=duration/len(chosen)
    manifest=LIVE/f'clip-{n:02d}.txt'
    manifest.write_text('\n'.join(f"file '{f['name']}'\nduration {step:.7f}" for f in chosen)+f"\nfile '{chosen[-1]['name']}'\n")
    video_filter=('scale=3840:2160:flags=lanczos' if ultra else 'scale=1920:1080:flags=lanczos')+',setsar=1,fps=25'
    if high_quality: video_filter+=',unsharp=5:5:0.45:5:5:0'
    args=[ff,'-y','-f','concat','-safe','0','-i',str(manifest),'-i',str(OUT/f'voice-male-{voice:02d}.mp3'),'-vf',video_filter,'-af',f'atempo={1/scale},apad','-t',str(duration),'-c:v','libx264','-preset','medium' if ultra else ('slow' if high_quality else 'fast'),'-crf','12' if ultra else ('14' if high_quality else '21'),'-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','44100',str(LIVE/f'clip-{n:02d}{suffix}.mp4')]
    p=subprocess.run(args,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    if p.returncode: raise RuntimeError(p.stderr.decode(errors='replace')[-3000:])
    print('Rendered real website scene',n+1,'/',len(scenes),flush=True)
(LIVE/'join.txt').write_text('\n'.join(f"file 'clip-{i:02d}{suffix}.mp4'" for i in range(len(scenes))))
subprocess.run([ff,'-y','-f','concat','-safe','0','-i',str(LIVE/'join.txt'),'-c','copy',str(LIVE/'joined.mp4')],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,check=True)
subprocess.run([ff,'-y','-i',str(LIVE/'joined.mp4'),'-i',str(OUT/'music.wav'),'-filter_complex','[1:a]volume=0.2[b];[0:a][b]amix=inputs=2:duration=first:normalize=0[m]','-map','0:v','-map','[m]','-c:v','copy','-c:a','aac','-b:a','192k','-movflags','+faststart',str(OUT/f'AI-Smart-Grocery-Website-Thuc-Te{suffix}.mp4')],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,check=True)
print('DONE',flush=True)
