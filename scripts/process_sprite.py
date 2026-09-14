#!/usr/bin/env python3
"""Post-process generated sprites: fit to 900x900 square, preserve transparency and full character."""
from PIL import Image
import sys

def process_sprite(input_path, output_path, target_size=900):
    """Take any image, fit to target_size square, preserve alpha and full character."""
    img = Image.open(input_path)
    
    # Convert to RGBA if needed
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    w, h = img.size
    
    if w == h:
        # Already square, just resize
        img = img.resize((target_size, target_size), Image.LANCZOS)
    elif h > w:
        # Portrait: resize to height=target, pad width with transparency
        new_h = target_size
        new_w = int(w * new_h / h)
        img = img.resize((new_w, new_h), Image.LANCZOS)
        result = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
        result.paste(img, ((target_size - new_w) // 2, 0))
        img = result
    else:
        # Landscape: resize to width=target, pad height with transparency
        new_w = target_size
        new_h = int(h * new_w / w)
        img = img.resize((new_w, new_h), Image.LANCZOS)
        result = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
        result.paste(img, (0, (target_size - new_h) // 2))
        img = result
    
    # Save with transparency
    img.save(output_path)
    print(f"Processed: {input_path} -> {output_path} ({img.size})")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python process_sprite.py <input> <output>")
        sys.exit(1)
    process_sprite(sys.argv[1], sys.argv[2])
