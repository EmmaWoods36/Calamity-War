"""
Calamity War Sprite Cleanup Script v2
=====================================
Conservative cleanup that does NOT attempt background removal (the game's
runtime sanitizeSpriteBackground already handles that). Instead it:

1. Removes small detached opaque artifacts (stray hair clumps, text remnants)
2. Normalizes canvas size to 900x900 (centered, feet near bottom)
3. Preserves all character art

This is safe because it only removes components that are:
- Detached from the main character body
- Smaller than 2000px AND smaller than 5% of the main character
"""

from PIL import Image
import numpy as np
from scipy import ndimage
import os
import sys

SPRITE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'sprites')
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'sprites_cleaned')
TARGET_SIZE = 900
FEET_MARGIN = 20  # pixels from bottom for feet positioning
MIN_COMPONENT_AREA = 1500  # artifacts smaller than this get removed
# Poses that can have intentional detached VFX (aura, lightning, smoke, energy)
# For these poses, we only remove very small artifacts (< 200px)
VFX_POSES = {'special', 'heavy', 'hurt', 'ko', 'light', 'jump'}
VFX_MIN_AREA = 200  # Stricter threshold for VFX poses


def load_sprite(path):
    """Load sprite as RGBA numpy array."""
    img = Image.open(path).convert('RGBA')
    return np.array(img)


def remove_small_artifacts(arr, min_area=MIN_COMPONENT_AREA, pose_name=''):
    """Remove small detached opaque components (stray hair clumps, text remnants).
    
    Only removes components that are:
    - Not the largest connected component (the character)
    - Smaller than min_area
    - Smaller than 5% of the main character's area
    
    For VFX poses (special, heavy, hurt, ko), uses a much smaller threshold
    to preserve intentional energy/aura effects.
    """
    h, w = arr.shape[:2]
    alpha = arr[..., 3] > 10
    
    # Use stricter threshold for VFX poses
    effective_min = VFX_MIN_AREA if pose_name in VFX_POSES else min_area
    
    # Label connected components
    labeled, num_features = ndimage.label(alpha)
    
    if num_features <= 1:
        return arr, 0, 0
    
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
        # Only remove if small AND much smaller than main character
        # For VFX poses, use stricter threshold (1% instead of 4%)
        size_ratio = 0.01 if pose_name in VFX_POSES else 0.04
        if size < effective_min and size < largest_size * size_ratio:
            mask = labeled == i
            arr[mask, 3] = 0  # Make transparent
            removed_count += 1
            removed_area += int(size)
    
    return arr, removed_count, removed_area


def normalize_canvas(arr, target=TARGET_SIZE, feet_margin=FEET_MARGIN):
    """Center the visible content on a target-size canvas with feet near bottom."""
    alpha = arr[..., 3] > 10
    if not alpha.any():
        # No visible content, return as-is on target canvas
        result = np.zeros((target, target, 4), dtype=np.uint8)
        return result
    
    # Find visible bounds
    rows = np.any(alpha, axis=1)
    cols = np.any(alpha, axis=0)
    minY, maxY = np.where(rows)[0][[0, -1]]
    minX, maxX = np.where(cols)[0][[0, -1]]
    
    # Crop to visible bounds
    cropped = arr[minY:maxY+1, minX:maxX+1]
    ch, cw = cropped.shape[:2]
    
    # If already target size and content fills most of it, return as-is
    if ch == target and cw == target:
        return cropped
    
    # Create target canvas
    result = np.zeros((target, target, 4), dtype=np.uint8)
    
    # Center horizontally
    offset_x = (target - cw) // 2
    
    # Place feet near bottom with margin
    offset_y = target - ch - feet_margin
    
    # If sprite is taller than target, scale down
    if ch > target:
        scale = target / ch
        new_w = int(cw * scale)
        pil_img = Image.fromarray(cropped, 'RGBA')
        pil_img = pil_img.resize((new_w, target), Image.LANCZOS)
        cropped = np.array(pil_img)
        offset_x = (target - new_w) // 2
        offset_y = 0
    
    # Ensure offsets are valid
    offset_x = max(0, offset_x)
    offset_y = max(0, offset_y)
    
    # Place on canvas
    h, w = cropped.shape[:2]
    end_y = min(offset_y + h, target)
    end_x = min(offset_x + w, target)
    result[offset_y:end_y, offset_x:end_x] = cropped[:end_y-offset_y, :end_x-offset_x]
    
    return result


def process_sprite(input_path, output_path, verbose=True):
    """Process a single sprite."""
    try:
        arr = load_sprite(input_path)
        original_shape = arr.shape
        
        # Extract pose name from filename (e.g., 'adrian_idle.png' -> 'idle')
        basename = os.path.basename(input_path)
        parts = basename.rsplit('_', 1)
        pose_name = parts[-1].replace('.png', '') if len(parts) > 1 else ''
        
        # Step 1: Remove small detached artifacts
        arr, removed_count, removed_area = remove_small_artifacts(arr, pose_name=pose_name)
        
        # Step 2: Normalize canvas to 900x900
        arr = normalize_canvas(arr)
        
        # Save
        img = Image.fromarray(arr, 'RGBA')
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        img.save(output_path, 'PNG')
        
        if verbose:
            artifact_msg = f" removed {removed_count} artifact(s) ({removed_area}px)" if removed_count > 0 else ""
            print(f"  {basename}: {original_shape[1]}x{original_shape[0]} -> {arr.shape[1]}x{arr.shape[0]} OK{artifact_msg}")
        return True
    except Exception as e:
        print(f"  {os.path.basename(input_path)}: ERROR - {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    # Characters to process
    all_chars = sorted([
        d for d in os.listdir(SPRITE_DIR)
        if os.path.isdir(os.path.join(SPRITE_DIR, d))
    ])
    
    # Allow command-line override for specific characters
    if len(sys.argv) > 1:
        all_chars = sys.argv[1:]
    
    stats = {'processed': 0, 'errors': 0, 'skipped': 0, 'artifacts_removed': 0}
    
    for char_name in all_chars:
        char_dir = os.path.join(SPRITE_DIR, char_name)
        if not os.path.isdir(char_dir):
            print(f"  [{char_name}] Directory not found, skipping")
            stats['skipped'] += 1
            continue
        
        print(f"\n[{char_name}]")
        png_files = [f for f in os.listdir(char_dir) if f.endswith('.png')]
        
        if not png_files:
            print(f"  No PNG files found")
            stats['skipped'] += 1
            continue
        
        for png_file in sorted(png_files):
            # Skip spliced sheet files and select cards (they're source material)
            if 'spliced_batch' in png_file or 'select_full_body' in png_file:
                continue
            
            input_path = os.path.join(char_dir, png_file)
            output_path = os.path.join(OUTPUT_DIR, char_name, png_file)
            
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
