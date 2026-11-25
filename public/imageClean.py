from PIL import Image
from rembg import remove

# Define input and output file paths
input_path = "public/image2.png"
output_path = "public/image200gm.png"

# Open the image, remove the background, and save it
input_image = Image.open(input_path)
output_image = remove(input_image)
output_image.save(output_path)

print("Background removed successfully!")
