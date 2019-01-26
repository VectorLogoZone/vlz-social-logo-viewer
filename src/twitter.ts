import KoaRouter from 'koa-router';

//import * as fs from 'fs';
//import * as path from 'path';
import rp from 'request-promise-native';

const router = new KoaRouter();

router.get('/api/twitter.json', async (ctx) => {

    const bearerToken = process.env['TWITTER_BEARER_TOKEN'];

    if (!bearerToken) {
        ctx.body = { success: false, message: 'Twitter bearer token not configured' };
        return;
    }

    const twitterId = ctx.query["id"];
    if (!twitterId || !twitterId.match( /^[A-Za-z0-9_]{1,15}$/ )) {
        ctx.body = { success: false, message: 'Missing or invalid Twitter ID ("id" parameter)'}
        return;
    }

    const options = {
        headers: { 'Authorization': 'Bearer ' + bearerToken },
        json: true,
        qs: { screen_name: twitterId },
        uri: 'https://api.twitter.com/1.1/users/show.json'
    };
    console.log(options);

    const url = (await rp(options)).profile_image_url;

    ctx.body = { success: true, message: "OK", twitterId, results: [ { url: url, description: "Twitter Profile Image", source: `https://twitter.com/${twitterId}` } ] };
});


export { router }