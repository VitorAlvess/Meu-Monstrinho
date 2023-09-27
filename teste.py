image_url = "https://text-to-image.withgoogle.com/v1/images"

data = {
    "text": "Uma folha de papel com o texto 'Olá, mundo!' escrito em cima",
    "width": 500,
    "height": 500,
    "output_format": "png",
}

response = requests.post(image_url, json=data)

image = response.json()["image"]

with open("image.png", "wb") as f:
    f.write(image)