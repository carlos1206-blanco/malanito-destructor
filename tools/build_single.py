"""Empaqueta el proyecto en un único HTML (imágenes en base64) para enviarlo por WhatsApp o subirlo a cualquier hosting.
Uso:  python tools/build_single.py   ->  genera dist/malanito_destructor.html
"""
import base64, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def rd(p, mode='r'):
    with open(os.path.join(ROOT, p), mode, encoding=None if 'b' in mode else 'utf-8') as f: return f.read()
def b64(p, mime): return f"data:{mime};base64," + base64.b64encode(rd(p, 'rb')).decode()
index = rd('index.html')
css = rd('css/style.css')
assets = rd('js/assets.js')
assets = assets.replace("'assets/sheet.png'", "'" + b64('assets/sheet.png', 'image/png') + "'")
assets = assets.replace("'assets/bg.jpg'", "'" + b64('assets/bg.jpg', 'image/jpeg') + "'")
assets = assets.replace("'assets/photo.jpg'", "'" + b64('assets/photo.jpg', 'image/jpeg') + "'")
js = "\n".join([assets] + [rd(f'js/{n}.js') for n in ['core', 'entities', 'levels', 'game']])
out = re.sub(r'<link rel="stylesheet" href="css/style\.css(?:\?[^"]*)?">', '<style>\n' + css + '</style>', index)
out = re.sub(r'(<script src="js/[a-z]+\.js(?:\?[^"]*)?"></script>\n*)+', lambda m: '<script>\n' + js + '\n</script>\n', out, count=1)
os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
with open(os.path.join(ROOT, 'dist', 'malanito_destructor.html'), 'w', encoding='utf-8') as f: f.write(out)
print('OK -> dist/malanito_destructor.html', len(out) // 1024, 'KB')
