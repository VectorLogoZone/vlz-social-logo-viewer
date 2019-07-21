import KoaRouter from 'koa-router';
import KoaBody from 'koa-body';

const router = new KoaRouter();

router.use(KoaBody({ multipart: true }));

router.get('/oauth.html', async (ctx) => {

    await ctx.render('oauth.hbs', { 
        query: JSON.stringify(ctx.query, null, 2),
        postData: 'request was a GET, not a POST',
        title: 'Oauth Callback Data' 
    });

});

router.post('/oauth.html', async (ctx) => {

    await ctx.render('oauth.hbs', {
        query: JSON.stringify(ctx.query, null, 2),
        postData: JSON.stringify(ctx.request.body, null, 2),
        title: 'Oauth Callback Data'
    });

});

export { router }