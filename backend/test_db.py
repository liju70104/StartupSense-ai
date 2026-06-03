from database import users

users.insert_one({
    "name": "Liju",
    "email": "liju@test.com"
})

print("Data Inserted Successfully")