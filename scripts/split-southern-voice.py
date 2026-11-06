import pathlib,sys,subprocess
ROOT=pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'.video-tools'))
import imageio_ffmpeg
ff=imageio_ffmpeg.get_ffmpeg_exe();out=ROOT/'video-output/ban-theo-mau'
# Paragraph boundaries fall in the pauses of the generated narration.
cuts=[0,6.44,11.18,16.66,22.58,27.49,32.38,36.67,43.08]
for i,(a,b) in enumerate(zip(cuts,cuts[1:])):
    subprocess.run([ff,'-y','-ss',str(a),'-i',str(out/'voice-nam-mien-nam.mp3'),'-t',str(b-a),'-c:a','libmp3lame','-q:a','2',str(out/f'voice-{i}.mp3')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
print('Prepared 8 southern male narration segments')
