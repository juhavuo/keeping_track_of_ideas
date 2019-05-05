# keeping_track_of_ideas

Node.js express MondoDB project. The idea was, that if one got wonderful ideas, one wants to keep track, one can save them
with application, that uses this backend. One can keep them private, just for one self or one can publish them. This backend
is suitable for small testing sizes, for heavier use it needs adjustments.

There is two major routes, one for users and one for ideas. In users route there is http methods for login, register and logout.
In ideas there is methods for handling ideas. When one logs in, one gets token and that token is required in every user method
that is to do with that user. Only getting public ideas don't need token. 

Idea methods are for fetching ideas, all public ones, public ones with keyword (tag), all ideas of certain user, then there is
method for deleting ideas, editing text fields, for changing idea from public to private and other way around. Ideas can be liked.
It is not directly the amount of likes, that is stored in database, instead there is list of user_ids, that has liked the idea.
It is prevented to like the same idea multiple times, the id of current user is compared to that list and if the id is there,
it don't get added again. In frontend side one is supposed to count the amout of ids and use it as amount of likes. Comments can
be added to idea and comments can also be removed.

Passwords are saved as tokens. Bcrypt is used for this. 
