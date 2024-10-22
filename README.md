# state-affair-srv

back end server

Steps to test -

- Create clone on your local m/c.
- npm install
- npm start.

Server supports following end points -

GET /v1/news

- gives all news present in the database. No pagination present this moment.
- GET /v1/news?topic=Microsoft
  Search with the topic Microsoft

- GET /v1/news?state=CA
  Searches news from state CA

- GET /v1/news?search=Xbox
  searches 'XBox' in news title. This can be enhanced to search in entire content but for now it is set only look in title.

- POST /v1/news
  This API needs following
  topic
  title
  publishedAt - iso date,
  state - 2 character state code. e.g. CA/FL etc. currently news fetch API doesn;t provide state code so for now application is hardcoding it to CA for now.
  description
  url
  content

- POST /v1/news/fetch
  This endpoint will fetch news from remote endpoint (https://newsapi.org/v2/everything).
  Make sure to pass following in the body -
  {
  "q": "Microsoft" //Or any topic.
  }

Cache Implementation:
Cache is also implementated in the application. By default cache is set aside of the microservice to
avoid single point of failure but for this demo project it is implemented as part of this server. The
logic to have cache is - when we post or fetch data from remote, it not only updates Database, but also updates the cache as well..
Again implementation is not perfact but this moment key to set data in the cache is combination of state, topic and title seperated by #.
Please note, if data is present in the cache, response is very quick.

News Aggregation and Uniqueness of the data:
At this moment uniqueness of data is maintained at cache level only. Backend database still has duplicates. We need to enhance the logic and define 'uniquenes' and implement the same at cache and db level.  
Apart from current, there are different approaches we can define to define uniqueness of data -

- we already have url and published at fields from data source which means we can leverage these two fields along with title and state to define uniqueness of news.
- we can also look at the content and/or description and that can be defined as unique.

Scalability Consideration:
Current implementation is having cache and application logic in single application. This is not good pattern but since it was demo project I implemented that way, but in real production system we should be using seperate Cache server and Database server.
Cache server - we have two options Redis or memcached. We can select either one. I have implemented Redis server in one of my earlier project and this works great. In that project implementation was done on AWS..
Database - Since it is News system, yes data is important but consistancy of data is not the primary concern for our use case. According to CAP theoram, we can select A and P which means Availibility and Partition can be prioritize over Consistance and we can select no sql database. Currently I am using mongo db which is great but if we want any free/open source database that is also an option. But let's remember we may have to manage db in that case and it may be costly (it depends on many factors).

Search Optimization:
It is not implemented this moment in this demo project but here is my thought on this -

- we should define some key words and looks for those keywords in our actual content. if keyword is found then we can map articles with keyword. This mapping can be placed in the cache. When the user is searching for an article with keywords we should look into our cache and fetch actual content for that keyword.
- If keyword is not found in our map, then we have to search for that keyword in our content databese. this is expensive operation but once done then we can update our map with the keyword and content.
- Apart from some well known keywords, user provided input will be very important. Because general pattern is, user will always serch for some specific key words more then once.

Security Consideration: Certainly security will be primary concern on the app and want to prevent unknowns security hazards. I have taken some steps here -

- I have implemented a well known middleware 'helmet' which brings multiple implementations by default. Please look at response and check how many headers response have. Most of them are coming because of helmet middle ware.
- I have implemented verification logic for the incoming data. Currently i am checking only length and presence of fields in the body but this will be inhanced and we should check other things also like if we have any script or anything in the message body.
- In Current implementation i am allowing localhost:3000 to allow post message to the app server this is because i will be implementing Front End UI app running on port 3000 on local host. Again it is dev implementation right now and prod implementation will have differnet value.

Extra Considerations:

- I have some extra headers in the response, one of them gives corelation id for the message. This will be useful to search log and many things.
- Another header I have is response time, which gives information how much time server took to response.
- I also have log implementation. Please look at ./log/application.log file.
- Currently we dont have user(s) data in the sytem. This is very important because we can implement login functionality and other features which was asked like RealTime update, User Preference and Subscription. All these can be done if we have user data with us. If time permits today after implemeting UI i will work on User implementation as well.
