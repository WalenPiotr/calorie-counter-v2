## Calorie Counter

Calorie Counter is a web app that tracks diet and exercise to determine optimal caloric intake and nutrients for the users' goals

## Tech stack:

Typescript, Node, GraphQL, TypeGraphQL, PostgreSQL, TypeORM, ApolloClient, React, NextJS,MaterialUI, Docker, NGiNX

## App structure

The app is organized into separate microservices as shown on following chart.

<p align="center">
<img src="https://raw.githubusercontent.com/WalenPiotr/calorie-counter-v2/master/cc-system-chart.png"/>
</p>

The app is composed of following microservices:

- Resource service, which handles CRUD operation for food and user daily logs (Node, GraphQL)
- Resource database, which stores food data and user daily logs (PostgreSQL)
- Auth service, which handles user authentication and authorization (Node, REST, GraphQL)
- Auth database, which stores user data (PostgreSQL)
- Session storage, which shares session between auth service and resource service (Redis)
- Gateway service, which stiches resource and auth service GraphQL schema, for convienient usage with client apps (Node, GraphQL)
- Frontend app, which serves dual role of admin panel and client app (React, ApolloClient, NextJS, MaterialUI)
- Reverse proxy (Nginx)

Every microservice is deployed using docker and the whole app is composed using docker-compose
