import KoaRouter from 'koa-router';
//import KoaBody from 'koa-body';

const router = new KoaRouter();
/*
router.use(KoaBody({ multipart: true }));

router.get('/oauth/callback', async (ctx) => {
    ctx.log.info( {
        req: ctx.req,
        body: ctx.request.body,
    }, 'oauth callback');

    ctx.body = { success: true };
});

router.get('/oauth/landing.html', async (ctx) => {

    await ctx.render('oauth/landing.hbs', { 
        query: JSON.stringify(ctx.query, null, 2),
        postData: 'request was a GET, not a POST',
        title: 'Oauth Callback Data' 
    });

});

router.post('/oauth/landing.html', async (ctx) => {

    await ctx.render('oauth/landing.hbs', {
        query: JSON.stringify(ctx.query, null, 2),
        postData: JSON.stringify(ctx.request.body, null, 2),
        title: 'Oauth Callback Data'
    });

});
*/

export { router }
