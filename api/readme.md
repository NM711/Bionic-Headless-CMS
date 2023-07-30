# Bionic CMS

## Description

Bionic CMS is a flexible content management system aimed towards anyone who wishes
to do what they want with **THEIR** content.

This project is entirely api based with a complementary ui for people to use,
you can use the full capabilities of the api after making a account. Alternatively if you want
you can clone this repo download postgresql and the rest of this projects dependencies and host the cms
yourself.

Each created workspace has an api key which can be implemented in all sorts of applications, this allows for users
to be able to do whatever they want to make their work easier, or more fun, 
want to make a CLI app with your own saved content? You can.

**There is also a webapp which offers all of the apis functionality to its fullest extent
at http://websitehere.com**

This project was intially made for myself but maybe others can find a use for it,
### For Users Who Are Planning To SelfHost

**Make sure you have Postgresql version 15.1 or higher.**
**Yarn add after cloning the repository**
**Add your own db connection string for pisma**
**npx prisma db push**

And with that you should be good to go, have fun!

### *AUTH DISCLAIMER*

The authenthication part of this project is very barebones made with bcrypt and jwt which I admit, is obviously
not the securest thing to do. Now I did this because this project is meant to be self hosted, if were to have used
a third party auth provider then it would be harder for users to do what they want. I made this part of the project
as barebones as possible so that it is easy to add your own implementation the way you want.

### Readme under development
