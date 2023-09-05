# Bionic CMS

## Description

Bionic CMS is an open source content management system which aims to be flexible and extendible for others to use.

This project is entirely api based (Headless CMS) with a complementary ui for people to use (Under Development),
you can use the full capabilities of the api after making a account. Alternatively if you want
you can clone this repo download postgresql and the rest of this projects dependencies and run the project
yourself.

Each created workspace has an api key which can be implemented in all sorts of applications, this allows for users
to be able to do whatever they want to make their work easier, or more fun, 
want to make a CLI app with your own saved content? You can.

**There is also a webapp which offers all of the apis functionality to its fullest extent
at http://websitehere.com**

This project was intially made for myself but maybe others can find a use for it,
### For Users Who Are Planning To SelfHost

**Make sure you have Postgresql version 15.1 or higher.**
**Yarn after cloning the repository to install dependencies**
**Add your own db connection string for prisma**
**Copy the queries in "manual_queries.sql" and paste it into your sql database**
**npx prisma db push**

And with that you should be good to go, have fun!

### *AUTH DISCLAIMER*

The authenthication part of this project is very barebones made with bcrypt and jwt which I admit, is obviously
not the securest thing to do, but it works. Now I did this because this project is meant to be extendible, if were to have used
a third party auth provider then it would be harder for users to do what they want. I made this part of the project
as barebones as possible so that it is easy to add your own implementation the way you want.

## Endpoints

### User and Authenthication

#### /auth/sign-up <span style="color:orange">POST</span>

Pushes a new user to the database by accepting the username and password fields.

#### /auth/sign-in <span style="color:orange">POST</span>

Signs a database user in with the fields of username and password then, it generates the JWT which should be added to the
Authorization header as: "Authorization": "Bearer (YOUR TOKEN HERE)".

#### /auth/sign-out <span style="color:limegreen">GET</span>

Signs a user out by removing the JWT from the Authorization Header in the request object.

#### /auth/delete <span style="color:red">DELETE</span>

Deletes a user from the database

#### /auth/retrieve <span style="color:limegreen">GET</span>

Retrieves general user data

### Workspaces

#### /workspaces/create <span style="color:orange">POST</span>

Creates a workspace the user who created it will default to OWNER

#### /workspaces/update <span style="color:purple">PATCH</span>

Updates the workspace name

#### /workspaces/retrieve?id=(workspace_id) <span style="color:green">GET</span>

Retrieves all data related to the workspace

#### /workspaces/delete?id=(workspace_id) <span style="color:red">DELETE</span>

Removes a workspace and all its contents from the database

#### /workspaces/user/update <span style="color:blue">PUT</span>

Updates the users in a workspaces, on this endpoint you are able to add a user to the workspaces or remove a user.

#### /workspaces/user/update/role <span style="color:purple">PATCH</span>

Updates a users role on a endpoint

#### /workspaces/collection/create <span style="color:orange">POST</span>

Creates a collection within the workspace

#### /workspaces/collection/update <span style="color:blue">PUT</span>

Updates the content within the collection depending on the operations used within the request body

#### /workspaces/collection/retrieve?id=(workspace_id)&cid=(collection_id) <span style="color:limegreen">GET</span>

Retrieves data related to the workspace collection.

#### /workspaces/collection/retrieve?id=(workspace_id)&cid=(collection_id) <span style="color:red">DELETE</span>

Deletes a workspace collection

#### /workspaces/collection/media/add?id=(workspace_id)&cid=(collection_id) <span style="color:orange">POST</span>

Pushes media bytes to the database through a form body

#### /workspaces/collection/media/delete?id=(workspace_id)&cid=(collection_id)&mid=(media_id) <span style="color:red">DELETE</span>

Deletes media from the database depending on the media id.

## Project Final Thoughts

When I first began to work on this project I was quite eager to implement as many things I could in a clean manner of course.
But after you begin to work on something for so long you begin to focus on finishing over anything in order to show some results
and so thats what kind of happened with this project. Now I do plan to come back and work on it and, do a rework on some design decisions I decided
to take at the very end in order to finish because, I do feel like a lot of the internal functionality can be improved and optimized for better
performance and code cleanliness. But for now Im taking a small break from this project.

### Readme under development
