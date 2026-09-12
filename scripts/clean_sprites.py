"""
Calamity War Sprite Cleanup Script
===================================
Processes battle sprite PNGs to:
1. Convert black/opaque backgrounds to transparent (flood-fill from edges)
2. Remove small detached artifacts (stray hair clumps, text remnants)
3. Crop to visible bounds with consistent padding
4. Normalize output to 900x900 canvas (centered)

Safety rules:
- Only removes edge-connected near-black/near-white backgrounds (flood-fill)
- Does NOT touch interior black pixels (costumes, hair, weapons)
- Removes detached components smaller than a threshold (stray artifacts)
- Preserves all character art
"""

from PIL import Image, ImageChops
import numpy as np
import os
import sys
import json

SPRITE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'sprites')
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'sprites_cleaned')
TARGET_SIZE = 900
PAD = 12  # padding around visible bounds

# Minimum component size (in pixels) to keep. Smaller = artifact.
# A 900x900 sprite character should be at least 5000px of visible content.
MIN_COMPONENT_AREA = 2000


def load_sprite(path):
    """Load sprite as RGBA numpy array."""
    img = Image.open(path).convert('RGBA')
    return np.array(img)


def is_background_pixel(r, g, b, a, loose=False):
    """Check if a pixel is likely background (near-black or near-white/gray)."""
    if a <= 5:
        return True
    maxc = max(r, g, b)
    minc = min(r, g, b)
    chroma = maxc - minc
    # Near-black background (but not pure black costume parts - those have some color)
    if maxc < 25 and a > 200:
        return True
    # Near-white/gray background
    if loose:
        if maxc >= 170 and chroma <= 88:
            return True
    else:
        if maxc >= 198 and chroma <= 72:
            return True
    return False


def flood_fill_background(arr):
    """Flood-fill from edges to remove background."""
    h, w = arr.shape[:2]
    data = arr.copy()
    
    # First pass: flood from edges for near-black and near-white
    visited = np.zeros((h, w), dtype=bool)
    queue = []
    
    # Seed from all 4 edges
    for x in range(w):
        for y in [0, h-1]:
            idx = (y, x)
            if not visited[y, x]:
                r, g, b, a = data[y, x]
                if is_background_pixel(r, g, b, a):
                    visited[y, x] = True
                    queue.append(idx)
    for y in range(h):
        for x in [0, w-1]:
            idx = (y, x)
            if not visited[y, x]:
                r, g, b, a = data[y, x]
                if is_background_pixel(r, g, b, a):
                    visited[y, x] = True
                    queue.append(idx)
    
    # BFS flood fill
    head = 0
    while head < len(queue):
        y, x = queue[head]
        head += 1
        data[y, x, 3] = 0  # Make transparent
        
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                r, g, b, a = data[ny, nx]
                if is_background_pixel(r, g, b, a):
                    visited[ny, nx] = True
                    queue.append((ny, nx))
    
    # Second pass: find opaque bounding box and flood from its perimeter
    opaque = data[..., 3] > 5
    if not opaque.any():
        return data
    
    rows = np.any(opaque, axis=1)
    cols = np.any(opaque, axis=0)
    minY, maxY = np.where(rows)[0][[0, -1]]
    minX, maxX = np.where(cols)[0][[0, -1]]
    
    # Sample background colors from perimeter of opaque region
    visited2 = np.zeros((h, w), dtype=bool)
    queue2 = []
    
    bg_colors = []
    # Sample from perimeter
    for x in range(minX, maxX + 1, max(1, (maxX - minX) // 64)):
        for y in [minY, min(maxY, minY + 2), max(minY, maxY - 2), maxY]:
            if 0 <= y < h and 0 <= x < w:
                r, g, b, a = data[y, x]
                if a > 5:
                    maxc = max(r, g, b)
                    minc = min(r, g, b)
                    if maxc >= 120 and (maxc - minc) <= 90:
                        bg_colors.append((r, g, b))
    
    if not bg_colors:
        return data
    
    # Deduplicate colors
    unique_colors = []
    for c in bg_colors:
        cr, cg, cb = int(c[0]), int(c[1]), int(c[2])
        if all((cr-int(uc[0]))**2 + (cg-int(uc[1]))**2 + (cb-int(uc[2]))**2 > 300 for uc in unique_colors):
            unique_colors.append((cr, cg, cb))
    
    def close_to_bg(r, g, b, a):
        if a <= 5:
            return True
        if is_background_pixel(r, g, b, a, loose=True):
            return True
        ri, gi, bi = int(r), int(g), int(b)
        for uc in unique_colors:
            if (ri-uc[0])**2 + (gi-uc[1])**2 + (bi-uc[2])**2 < 4200:
                return True
        return False
    
    # Seed from perimeter of opaque region
    for x in range(minX, maxX + 1):
        for y in [minY, maxY]:
            if 0 <= y < h and not visited2[y, x]:
                r, g, b, a = data[y, x]
                if close_to_bg(r, g, b, a):
                    visited2[y, x] = True
                    queue2.append((y, x))
    for y in range(minY, maxY + 1):
        for x in [minX, maxX]:
            if 0 <= x < w and not visited2[y, x]:
                r, g, b, a = data[y, x]
                if close_to_bg(r, g, b, a):
                    visited2[y, x] = True
                    queue2.append((y, x))
    
    head = 0
    while head < len(queue2):
        y, x = queue2[head]
        head += 1
        data[y, x, 3] = 0
        
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ny, nx = y + dy, x + dx
            if minY <= ny <= maxY and minX <= nx <= maxX and not visited2[ny, nx]:
                r, g, b, a = data[ny, nx]
                if close_to_bg(r, g, b, a):
                    visited2[ny, nx] = True
                    queue2.append((ny, nx))
    
    return data


def remove_small_artifacts(arr, min_area=MIN_COMPONENT_AREA):
    """Remove small detached opaque components (stray hair clumps, text remnants)."""
    h, w = arr.shape[:2]
    alpha = arr[..., 3] > 5
    
    # Label connected components
    from scipy import ndimage
    labeled, num_features = ndimage.label(alpha)
    
    if num_features <= 1:
        return arr
    
    # Find sizes of all components
    sizes = ndimage.sum(alpha, labeled, range(1, num_features + 1))
    
    # Find the largest component (this is the character)
    largest_idx = np.argmax(sizes) + 1
    largest_size = sizes[largest_idx - 1]
    
    removed_count = 0
    removed_area = 0
    
    for i in range(1, num_features + 1):
        if i == largest_idx:
            continue
        size = sizes[i - 1]
        # Remove components smaller than min_area AND smaller than 5% of the main character
        if size < min_area and size < largest_size * 0.05:
            mask = labeled == i
            arr[mask, 3] = 0
            removed_count += 1
            removed_area += int(size)
    
    if removed_count > 0:
        print(f"    Removed {removed_count} artifact(s) ({removed_area}px total)")
    
    return arr


def crop_to_visible(arr, pad=PAD, target=TARGET_SIZE):
    """Crop to visible alpha bounds, then center on target canvas."""
    alpha = arr[..., 3] > 5
    if not alpha.any():
        return arr
    
    rows = np.any(alpha, axis=1)
    cols = np.any(alpha, axis=0)
    minY, maxY = np.where(rows)[0][[0, -1]]
    minX, maxX = np.where(cols)[0][[0, -1]]
    
    # Add padding
    minX = max(0, minX - pad)
    minY = max(0, minY - pad)
    maxX = min(arr.shape[1] - 1, maxX + pad)
    maxY = min(arr.shape[0] - 1, maxY + pad)
    
    cropped = arr[minY:maxY+1, minX:maxX+1]
    
    # Center on target canvas
    h, w = cropped.shape[:2]
    if h >= target or w >= target:
        # If larger than target, just return cropped
        return cropped
    
    result = np.zeros((target, target, 4), dtype=np.uint8)
    offset_x = (target - w) // 2
    offset_y = (target - h) // 2
    
    # Place character so feet are near bottom with some margin
    offset_y = target - h - 20  # 20px from bottom
    
    result[offset_y:offset_y+h, offset_x:offset_x+w] = cropped
    
    return result


def process_sprite(input_path, output_path, verbose=True):
    """Process a single sprite."""
    try:
        arr = load_sprite(input_path)
        original_size = arr.shape[:2]
        
        # Step 1: Flood-fill background to transparent
        arr = flood_fill_background(arr)
        
        # Step 2: Remove small detached artifacts
        arr = remove_small_artifacts(arr)
        
        # Step 3: Crop to visible bounds and center on 900x900
        arr = crop_to_visible(arr)
        
        # Save
        img = Image.fromarray(arr, 'RGBA')
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        img.save(output_path, 'PNG')
        
        if verbose:
            print(f"  {os.path.basename(input_path)}: {original_size[0]}x{original_size[1]} -> {arr.shape[1]}x{arr.shape[0]} OK")
        return True
    except Exception as e:
        print(f"  {os.path.basename(input_path)}: ERROR - {e}")
        return False


def main():
    # Characters to process (high-impact subset first)
    priority_chars = ['adrian', 'akila', 'rose', 'rai', 'nico', 'shanti', 
                       'dante', 'awar', 'goro', 'mammon', 'malachai', 'diego',
                       'rikku', 'mani', 'akira', 'shinichi', 'yuta', 'miwa',
                       'michelle', 'esther', 'semuda', 'tenganisha', 'raijin',
                       'diastre', 'baburu', 'machai', 'mahje', 'pierre',
                       'training_dummy_shadow', 'nikki', 'roger', 'daisuke',
                       'awar_aries', 'dante_aries', 'nox_aries', 'seccla_aries',
                       'danpen_shikake', 'danpen_tokei']
    
    # Allow command-line override for specific characters
    if len(sys.argv) > 1:
        priority_chars = sys.argv[1:]
    
    stats = {'processed': 0, 'errors': 0, 'skipped': 0}
    
    for char_name in priority_chars:
        char_dir = os.path.join(SPRITE_DIR, char_name)
        if not os.path.isdir(char_dir):
            print(f"  [{char_name}] Directory not found, skipping")
            stats['skipped'] += 1
            continue
        
        print(f"\n[{char_name}]")
        png_files = [f for f in os.listdir(char_dir) if f.endswith('.png')]
        
        for png_file in sorted(png_files):
            # Skip spliced sheet files (they're source material, not battle sprites)
            if 'spliced_batch' in png_file or 'select_full_body' in png_file:
                continue
            
            input_path = os.path.join(char_dir, png_file)
            output_path = os.path.join(OUTPUT_DIR, char_name, png_file)
            
            # Preserve the original directory structure
            rel_path = os.path.relpath(char_dir, SPRITE_DIR)
            output_path = os.path.join(OUTPUT_DIR, rel_path, png_file)
            
            success = process_sprite(input_path, output_path)
            if success:
                stats['processed'] += 1
            else:
                stats['errors'] += 1
    
    print(f"\n{'='*60}")
    print(f"Done! Processed: {stats['processed']}, Errors: {stats['errors']}, Skipped: {stats['skipped']}")
    print(f"Output: {OUTPUT_DIR}")


if __name__ == '__main__':
    main()
