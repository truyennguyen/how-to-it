[![Build Status](https://travis-ci.org/MrAllen/how-to-it.svg?branch=master)](https://travis-ci.org/MrAllen/how-to-it)
[![Stories in Ready](https://badge.waffle.io/MrAllen/how-to-it.svg?label=ready&title=Ready)](http://waffle.io/MrAllen/how-to-it)
#how-to-it
==========

Howtoit allows user to share tutorials on topics of interest, vote for the
tutorials that they feel are the best, and manage their tutorial library.

## A Code Fellows Project - Brought to you by
* Josh Allen
* Nick Eagan
* Truyen Nguyen

### To create an account

```
POST - /api/create_user
```
create_user expects a JSON object in the following form

```
{
	"username": "trogdor",
	"email": "trogdor@example.com",
	"password": "burninate"
}

```

This request will generate a token and save it as a cookie so that the user
can access the rest of the site.

### To sign in

```
GET - /api/sign_in
```
requests to /sign_in will verify the user's email and password in order to
generate a new access token.

```
{
	"email": trogdor@example.com,
	"password": "burninate"
}
```

get all tutorials
	superagent localhost:3000/api/tutorial

add a tutorial
	superagent localhost:3000/api/tutorial post '{"link":"this is link2", "caption":"A2"}'

search a tutorial by caption
	superagent 'localhost:3000/api/tutorial/search?captionSearch=A2'
	captionSearch: caption of a tutorial

add a vote to a tutorial
	superagent 'localhost:3000/api/tutorial/addvote?tutUuid=4572ba0b-08ee-436c-9b2e-338baa6860bd&userUuid=use4'
	tutUuid: uuid of the tutorial
	userUuid: uuid of user want to add vote

remove a vote from a tutorial
	superagent 'localhost:3000/api/tutorial/removevote?tutUuid=4572ba0b-08ee-436c-9b2e-338baa6860bd&userUuid=use3'
	tutUuid: uuid of the tutorial
	userUuid: uuid of user want to remove vote
```
