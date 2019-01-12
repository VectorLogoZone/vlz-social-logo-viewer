# To Do

 * caching results for Github
 * caching results for Twitter

## Twitter
https://developer.twitter.com/en/docs/accounts-and-users/user-profile-images-and-banners.html
https://api.twitter.com/1.1/users/show.json

```bash
curl -u 'consumer_key:consumer_secret' --data 'grant_type=client_credentials' https://api.twitter.com/oauth2/token

curl --header 'Authorization: bearer $BEARER_TOKEN' \ 
    'https://api.twitter.com/1.1/users/show.json?screen_name=fileformat'
  
```

## Data Model

remote_logo:
 * logohandle
 * remote_site 
 * remote_id
 * description (banner/profile/etc)
 * url
 * content-type
 * md5sum
 * bytes
