#!/usr/bin/env python3
"""Generate green circle PNG icons for the LinkedIn Stoplight extension.
Run: python3 generate_icons.py
Requires no dependencies (uses built-in struct/zlib).
"""
import struct, zlib, os

def create_png(size, color_rgb, filename):
    def chunk(ctype, data):
        c = ctype + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    width = height = size
    cx, cy = size / 2, size / 2
    r = size / 2 - 1

    rows = []
    for y in range(height):
        row = b''
        for x in range(width):
            dx, dy = x - cx + 0.5, y - cy + 0.5
            dist = (dx*dx + dy*dy) ** 0.5
            if dist <= r - 1:
                row += bytes(color_rgb) + b'\xff'
            elif dist <= r:
                alpha = int(255 * (r - dist))
                row += bytes(color_rgb) + bytes([alpha])
            else:
                row += b'\x00\x00\x00\x00'
        rows.append(b'\x00' + row)

    raw = b''.join(rows)
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(raw)

    with open(filename, 'wb') as f:
        f.write(sig)
        f.write(chunk(b'IHDR', ihdr))
        f.write(chunk(b'IDAT', idat))
        f.write(chunk(b'IEND', b''))
    print(f'Created {filename} ({size}x{size})')

os.makedirs('icons', exist_ok=True)
green = (0, 230, 118)
for size in [16, 48, 128]:
    create_png(size, green, f'icons/green{size}.png')
print('Done! Icons created in icons/ folder.')
