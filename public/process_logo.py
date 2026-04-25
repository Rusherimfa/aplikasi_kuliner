from PIL import Image, ImageDraw, ImageChops

def crop_and_circle(input_path, output_path):
    try:
        # Load the image
        img = Image.open(input_path).convert("RGBA")
        
        # 1. Remove white background (make it transparent)
        # Assuming the background is mostly white
        bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
        diff = ImageChops.difference(img, bg)
        diff = ImageChops.add(diff, diff, 2.0, -100)
        bbox = diff.getbbox()
        
        if bbox:
            img = img.crop(bbox)
            
        # 2. Make it a square to fit a circle
        width, height = img.size
        size = max(width, height)
        # Add a tiny bit of padding
        size = int(size * 1.05)
        
        new_img = Image.new("RGBA", (size, size), (255, 255, 255, 0))
        offset = ((size - width) // 2, (size - height) // 2)
        new_img.paste(img, offset)
        
        # 3. Create a circular mask
        mask = Image.new("L", (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size, size), fill=255)
        
        # 4. Apply mask
        result = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        result.paste(new_img, (0, 0), mask=mask)
        
        # Save it back
        result.save(output_path, "PNG")
        print("Success")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    crop_and_circle("logo.png", "logo.png")
