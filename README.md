# Dessert Store
## Table of Contents
- Description 
- Installation 
- Usage / Documentation 
- Technologies & Libraries 
- Pending Features
- Collaboration
- Authors 

## Description

[This project is an API for a Dessert Store App where you can register & login users, create products,search products by category.

As an *MANAGER* user, you can create, uodate, delete and disable products, upload images per product and, show client orders.

As a *CLIENT* user, you can see, buy and like products, see the product details, add products to cart and, show your order.

## Installation

```bash
$ git clone https://github.com/MariaDelCarmenLuque/api_dessert_store.git
```
```bash
$ npm install
```
## Usage / Documentation
Create a `.env` file using the `.env.example` file:

```bash


#DATABASE
# Postgres
DATABASE_URL="postgresql://host:mypassword@localhost:5432/api_dessert_store?schema=public"

PORT =3000

#JWT
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRATION=900s
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRATION=1y
JWT_EXPIRE_TIME_RESET_PASSWORD=300s

```
## Running the app

```bash
# migrations
$ npm run prisma:migrate:run

# generate client prisma
$ npm run prisma:generate

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run the Test

```bash
# unit tests
$ npm run test
```

#### Documentation:

`HOST:PORT/api/docs`

## Technologies & Libraries
- NestJs
- Typescript
- PostgreSQL
- Jest
- Prettier
- ESLint
- REST 
- Swagger
- Prisma

## Pending Features

- Include Unit Testing in  Services.
- Add Order functionality
- Add Like Products by Client.
- Add images in Dessert


## Collaboration

Collaboration with the project are welcome.

> Do a Pull request

> For major changes, please open an issue first to discuss what you would like to change.

## Authors
Maria del Carmen Luque Quispe

Where to find me:
|Network   |                     Link to access                   |
|----------|------------------------------------------------------|
| GitHub   |   https://github.com/MariaDelCarmenLuque             |
|LinkedIn  |   www.linkedin.com/in/maria-del-carmen-luque-quispe  |
