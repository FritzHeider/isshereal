import os
import sys
import json
import time
import httpx
from dotenv import load_dotenv

load_dotenv('/Users/drop/fal.ai.mcp/.env')
FAL_KEY = os.environ.get('FAL_API_KEY')
if not FAL_KEY:
    print("Error: FAL_API_KEY not found in /Users/drop/fal.ai.mcp/.env")
    sys.exit(1)

OUTPUT_DIR = "/Users/drop/ISSHEREAL/public/images"
os.makedirs(f"{OUTPUT_DIR}/avatars", exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/features", exist_ok=True)

PROMPTS = {
    # Brand and Hero
    "logo.png": {
        "prompt": "Minimalist modern 3D icon of a cybersecurity authenticity verification shield, glowing emerald green and deep slate, subtle holographic checkmark, frosted glass texture, clean tech aesthetic, white background, rendered in octane, 8k",
        "size": "square_hd"
    },
    "hero-scanner.png": {
        "prompt": "Futuristic 3D holographic digital dashboard showing a social media authenticity scanner and fraud detector, floating translucent UI cards with circular metrics, analytics graphs, emerald green lasers, dark sleek modern tech environment, high tech, cinematic lighting, 8k",
        "size": "landscape_16_9"
    },
    "og-image.png": {
        "prompt": "Premium tech marketing banner for isshereal.com, dark modern aesthetic with vibrant emerald green neon accents, 3D holographic authenticity score meter showing 99% authentic, cyber security shield, clean typography space, professional SaaS banner",
        "size": "landscape_16_9"
    },
    # Features
    "features/fake-detector.png": {
        "prompt": "3D isometric illustration of a digital magnifying glass scanning social media follower accounts, exposing robot bot avatars with red warning badges, glowing emerald data streams, sleek tech style, clean isolated background",
        "size": "square_hd"
    },
    "features/romance-shield.png": {
        "prompt": "3D modern icon of a glowing heart encased inside an emerald security shield, cybersecurity protection for dating apps, preventing catfish and romance scams, soft studio lighting, clean background",
        "size": "square_hd"
    },
    "features/marketplace-trust.png": {
        "prompt": "3D isometric e-commerce storefront with a golden and emerald verification badge of trust, secure digital escrow, verified buyer and seller protection, clean modern render",
        "size": "square_hd"
    },
    "features/ai-forensics.png": {
        "prompt": "3D glowing AI neural network brain processing data points and metrics, neon emerald synapses, forensic analytical machine learning, high tech dark aesthetic",
        "size": "square_hd"
    },
    # Sample Avatars
    "avatars/mrbeast.jpg": {
        "prompt": "Portrait of a friendly enthusiastic male top content creator in a blue hoodie, studio lighting, confident warm smile, YouTube creator avatar style, high quality photography",
        "size": "square"
    },
    "avatars/luca.jpg": {
        "prompt": "Portrait of a stylish handsome male fashion lifestyle influencer wearing designer streetwear, aesthetic golden hour lighting, Instagram model headshot",
        "size": "square"
    },
    "avatars/maya.jpg": {
        "prompt": "Portrait of a vibrant energetic young female dancer and content creator, colorful aesthetic background, natural smile, TikTok creator profile photo",
        "size": "square"
    },
    "avatars/alex.jpg": {
        "prompt": "Portrait of a suave travel lifestyle man posing in front of a European cafe, handsome dating app profile picture, slight stock-photo aesthetic",
        "size": "square"
    },
    "avatars/quickdeals.jpg": {
        "prompt": "Modern 3D flat vector logo icon for an online marketplace store named QuickDeals, shopping cart with discount tags and lightning bolt, clean colors",
        "size": "square"
    },
    "avatars/fittitan.jpg": {
        "prompt": "Portrait of an athletic fitness coach in workout gear at a modern gym, confident look, motivational fitness trainer avatar",
        "size": "square"
    },
    "avatars/pixelpro.jpg": {
        "prompt": "Portrait of a professional software engineer with stylish glasses in front of multi-monitor coding setup, freelance developer avatar",
        "size": "square"
    },
    "avatars/cryptogainz.jpg": {
        "prompt": "Stylized 3D avatar of a crypto day trader wearing dark sunglasses, neon green candlestick chart reflections, modern Web3 profile picture",
        "size": "square"
    }
}

def generate_and_save(rel_path, config):
    target_file = os.path.join(OUTPUT_DIR, rel_path)
    if os.path.exists(target_file) and os.path.getsize(target_file) > 1000:
        print(f"Skipping {rel_path} (already exists: {os.path.getsize(target_file)} bytes)")
        return True

    print(f"Generating {rel_path} via fal.ai flux/schnell...")
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
                print(f"Error for {rel_path}: status {res.status_code}, {res.text[:200]}")
                return False
            data = res.json()
            images = data.get("images", [])
            if not images:
                print(f"No images returned for {rel_path}")
                return False
            img_url = images[0]["url"]
            print(f"Downloading {rel_path} from {img_url[:40]}...")
            img_res = client.get(img_url)
            if img_res.status_code == 200:
                with open(target_file, "wb") as f:
                    f.write(img_res.content)
                print(f"Saved {rel_path} ({len(img_res.content)} bytes)")
                return True
            else:
                print(f"Failed to download image for {rel_path}: {img_res.status_code}")
                return False
    except Exception as e:
        print(f"Exception for {rel_path}: {e}")
        return False

def main():
    print(f"Starting FAL.AI generation for {len(PROMPTS)} assets...")
    success = 0
    for rel_path, config in PROMPTS.items():
        if generate_and_save(rel_path, config):
            success += 1
        time.sleep(1.0) # gentle spacing
    print(f"Finished! Successfully generated {success}/{len(PROMPTS)} assets.")

if __name__ == "__main__":
    main()
