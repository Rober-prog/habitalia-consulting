"""Create delivery derivatives, preserving source files byte for byte.

Favicon: crop of the current owner-supplied raster symbol, not a redrawing.
Social card: existing complete logo on a plain dark canvas.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
original = Image.open(root / 'assets/brand/logo-habitalia-actual.png')
assert original.mode == 'RGBA' and original.size == (2172, 724)
assert original.getchannel('A').getextrema()[0] == 0
original.crop((45, 190, 375, 520)).resize((96, 96), Image.Resampling.LANCZOS).save(root / 'public/favicon.png')
logo = original.copy()
logo.thumbnail((1080, 420), Image.Resampling.LANCZOS)
card = Image.new('RGBA', (1200, 630), (32, 34, 33, 255))
card.alpha_composite(logo, ((1200 - logo.width) // 2, (630 - logo.height) // 2))
card.convert('RGB').save(root / 'public/assets/brand/social-card.png', optimize=True)
print('Favicon cropped from original; social card composed from supplied raster. Sources untouched.')
