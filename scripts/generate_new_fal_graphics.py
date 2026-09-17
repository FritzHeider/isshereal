#!/usr/bin/env python3
import os
import sys
import time
import httpx
from dotenv import load_dotenv

load_dotenv('/Users/drop/fal.ai.mcp/.env')
FAL_KEY = os.environ.get('FAL_API_KEY')
if not FAL_KEY:
    print("Error: FAL_API_KEY not found in /Users/drop/fal.ai.mcp/.env")
    sys.exit(1)

OUTPUT_DIR = "/Users/drop/ISSHEREAL/public/images"
os.makedirs(f"{OUTPUT_DIR}/platforms", exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/features", exist_ok=True)

NEW_GRAPHICS = {
    # Redesigned Brand Logo
    "logo.png": {
        "prompt": "Iconic futuristic 3D cybersecurity authenticity emblem for isshereal.com, glowing emerald green and deep titanium shield with an iridescent neon cyan holographic verification checkmark, frosted glass refractive edges, clean centered composition, isolated on white background, 8k octane render, professional SaaS brand mark",
        "size": "square_hd",
        "force": True
    },
    # 3D Platform Badges
    "platforms/instagram-3d.png": {
        "prompt": "3D isometric high tech Instagram camera icon encased in a glowing emerald verification security halo, dark sleek glossy glass texture, cyber forensic lens, isolated on clean background, 8k render",
        "size": "square_hd",
        "force": True
    },
    "platforms/tiktok-3d.png": {
        "prompt": "3D isometric high tech TikTok musical note icon surrounded by glowing cyan and emerald authenticity rings, futuristic dark glass, isolated on clean background, 8k octane render",
        "size": "square_hd",
        "force": True
    },
    "platforms/youtube-3d.png": {
        "prompt": "3D isometric high tech YouTube play button badge with glowing emerald verification shield and digital data streams, dark sleek aesthetic, isolated on clean background, 8k render",
        "size": "square_hd",
        "force": True
    },
    "platforms/dating-shield-3d.png": {
        "prompt": "3D modern glowing heart encased inside a fortified emerald cybersecurity shield, catfish and romance scam forensic protection badge, soft ambient lighting, clean background, 8k render",
        "size": "square_hd",
        "force": True
    },
    "platforms/marketplace-3d.png": {
        "prompt": "3D isometric e-commerce storefront badge with glowing emerald verification checkmark and gold security escrow lock, seller authenticity protection, clean studio render",
        "size": "square_hd",
        "force": True
    },
    # Deep Tech Feature Visuals
    "features/web-use-inspection.png": {
        "prompt": "Futuristic 3D visualization of a headless web browser engine scanning a social media profile, holographic laser grid analyzing follower metrics, glowing emerald data packets, high-tech dark background, cinematic tech art, 8k",
        "size": "landscape_16_9",
        "force": True
    },
    "features/spike-analysis.png": {
        "prompt": "3D holographic financial-style forensic graph showing follower growth velocity, sharp red spike for bot injection contrasted with a steady emerald curve for organic audience, cyber UI analytics dashboard, 8k",
        "size": "landscape_16_9",
        "force": True
    }
}

def generate_asset(rel_path, config):
    target_file = os.path.join(OUTPUT_DIR, rel_path)
    if not config.get("force", False) and os.path.exists(target_file) and os.path.getsize(target_file) > 1000:
        print(f"Skipping {rel_path} (already exists)")
        return True

    print(f"Generating {rel_path} via FAL.AI...")
    headers = {"Authorization": f"Key {FAL_KEY}"}
    payload = {
        "prompt": config["prompt"],
        "image_size": config.get("size", "square_hd"),
        "num_inference_steps": 4,
        "enable_safety_checker": False
    }

    try:
        with httpx.Client(timeout=60.0) as client:
            res = client.post("https://fal.run/fal-ai/flux/schnell", headers=headers, json=payload)
            if res.status_code != 200:
                print(f"Error for {rel_path}: {res.status_code} - {res.text[:200]}")
                return False
            data = res.json()
            images = data.get("images", [])
            if not images:
                print(f"No images for {rel_path}")
                return False
            img_url = images[0]["url"]
            print(f"Downloading {rel_path} from {img_url[:45]}...")
            img_res = client.get(img_url)
            if img_res.status_code == 200:
                with open(target_file, "wb") as f:
                    f.write(img_res.content)
                print(f"Saved {rel_path} ({len(img_res.content):,} bytes)")
                return True
            else:
                print(f"Failed download {rel_path}: {img_res.status_code}")
                return False
    except Exception as e:
        print(f"Exception for {rel_path}: {e}")
        return False

def main():
    print(f"Starting FAL.AI generation for {len(NEW_GRAPHICS)} new assets...")
    success = 0
    for rel_path, config in NEW_GRAPHICS.items():
        if generate_asset(rel_path, config):
            success += 1
        time.sleep(0.5)
    print(f"Finished! Successfully generated {success}/{len(NEW_GRAPHICS)} assets.")

if __name__ == "__main__":
    main()
