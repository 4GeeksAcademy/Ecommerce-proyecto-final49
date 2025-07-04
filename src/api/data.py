roles = [
    "Admin",
    "General"
]
users = [
    {
        "email": "jose@gmail.com",
        "name": "Jose Hernandez",
        "password": "123456789",
        "role_id": 2
    },
    {
        "email": "maria@gmail.com",
        "name": "Jose Hernandez",
        "password": "123456789",
        "role_id": 2
    },
    {
        "email": "luis@gmail.com",
        "name": "Luis Miguel",
        "password": "123456789",
        "role_id": 2
    },
    {
        "email": "sofia@gmail.com",
        "name": "Sofia Reyes",
        "password": "123456789",
        "role_id": 2
    }
]
categories = [
    {
        "name": "Ciencia ficción"
    },
    {
        "name": "Fantasía"
    },
    {
        "name": "No ficción"
    }
]
authors = [
    {
        "name": "Isaac Asimov",
    },
    {
        "name": "J.R.R. Tolkien",
    },
    {
        "name": "George Orwell",
    }
]
products = [
    {
        "name": "Producto de Ejemplo",
        "price": 19.99,
        "image_url": "https://example.com/image.jpg",
        "is_featured": True,
        "description": "Descripción del producto de ejemplo",
        "detail_images": [
            "https://example.com/detail1.jpg",
            "https://example.com/detail2.jpg"
        ],
        "rating": 4,
        "product_stock": 100,
        "category_id": 1
    },
    {
        "name": "Otro Producto",
        "price": 29.99,
        "image_url": "https://example.com/another_image.jpg",
        "is_featured": False,
        "description": "Descripción de otro producto",
        "detail_images": [
            "https://example.com/detail3.jpg",
            "https://example.com/detail4.jpg"
        ],
        "rating": 5,
        "product_stock": 50,
        "category_id": 2},
    {
        "name": "Tercer Producto",
        "price": 39.99,
        "image_url": "https://example.com/third_image.jpg",
        "is_featured": True,
        "description": "Descripción del tercer producto",
        "detail_images": [
            "https://example.com/detail5.jpg",
            "https://example.com/detail6.jpg"
        ],
        "rating": 3,
        "product_stock": 75,
        "category_id": 3
    }
]