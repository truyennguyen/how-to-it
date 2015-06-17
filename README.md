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

### Article Storage

Users can store articles into 3 different places within the application.
toRead acts as a queue of articles that the user plans to read and uses first
in first out.

```
PUT - /api/articles/toread  [AUTH required]
```

#### Request

to add an article to toRead send an object with an add property with the put
```
{
	"add": "article"
}
```
if no add property is present the toRead array will remove and return the
first item in the array

#### Response

```
{
	"msg": "article"
}
```
```
PUT - /api/articles/hasread [AUTH required]
```
to add an article to the users hasRead collection include an add field. To
remove an article from the users has read collection include a remove field

#### Request
```
{
	"add": "article",
	"remove": "article"
}
```

#### Response
```
{
	"msg": "hasRead update successful"
}
```

```
PUT - /api/articles/isreading [AUTH required]
```
This route contains the current article that the user is reading and wants to
come back to. If an object with a "set" property is sent it acts as a setter
otherwise it will act as a getter.

#### Request
```
{
	"set": "article"
}
```
#### Response
{
	"msg": "article"
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
