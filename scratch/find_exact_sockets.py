# scratch/find_exact_sockets.py
# Finds exact sockets in media_1794369401164_4cb7dd2a.jpg and media_1794369415015_2dd2f46b.jpg
import struct

def parse_jpeg(filename):
    with open(filename, 'rb') as f:
        data = f.read()
    # Find dimensions
    i = 2
    w, h = 0, 0
    while i < len(data):
        marker, length = struct.unpack('>2sH', data[i:i+4])
        if marker[0] != 0xff:
            break
        if marker[1] in [0xc0, 0xc2]:
            h, w = struct.unpack('>HH', data[i+5:i+9])
            break
        i += 2 + length
    print(filename, 'size:', w, h)

parse_jpeg(r'C:\Users\vijay\.gemini\antigravity\brain\04af1dc8-a2b5-4aba-8d28-f876790cfa37\.user_uploaded\media_1794369401164_4cb7dd2a.jpg')
parse_jpeg(r'C:\Users\vijay\.gemini\antigravity\brain\04af1dc8-a2b5-4aba-8d28-f876790cfa37\.user_uploaded\media_1794369415015_2dd2f46b.jpg')
