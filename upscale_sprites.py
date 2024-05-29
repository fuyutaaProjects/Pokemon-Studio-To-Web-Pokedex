from PIL import Image
import os

def upscale_images(directory):
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        if os.path.isfile(filepath):
            try:
                img = Image.open(filepath)
                width, height = img.size
                new_img = img.resize((width * 4, height * 4), Image.NEAREST)  # Utilisation de NEAREST pour préserver la netteté
                new_img.save(filepath)  # Écrase l'image d'origine
                print(f"Image '{filename}' upscaled and overwritten")
            except Exception as e:
                print(f"Error processing '{filename}': {e}")

directory = "pokefront"
upscale_images(directory)
