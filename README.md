# VectorLogoZone Tools [<img alt="VectorLogoZone Logo" src="https://tools.vectorlogo.zone/favicon.svg" height="90" align="right" />](https://tools.vectorlogo.zone/)

These are some interactive tools and the backend APIs used by the main [VectorLogoZone](https://www.vectorlogo.zone/) website.

## Using the API

Unfortunately, rate-limits mean that I cannot run it as an open service.  However, it is
fairly easy to run your own instance.

## Running

It is a TypeScript node.js app, so (once you have set the [settings](#settings)):
```bash
npm install
npm run build
npm run start
```
See the `run.sh` for how I run it in development.

## Settings
All settings are stored in environment variables.  The deploy and run scripts get them from a `.env` file.

| name | description
|------|----------------
| TWITTER_BEARER_TOKEN | token for the Twitter API. Check [twitter_get_token.sh](bin/twitter_get_token.sh) to see how I got mine.
| USERNAME | (not currently used) the username to enter in the basic-auth dialog (default=`admin`)
| PASSWORD | (not currently used) the password to enter in the basic-auth dialog (default=`password`)

## Endpoints

 * `/api/twitter.json` - takes `id` parameter
 * `/api/github.json` - takes `id` parameter


## Contributing

Contributions are welcome!  Please follow the standard Github [Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962)

See the [to do list](TODO.md) for a list of things that are planned.

## License

[GNU Affero General Public License v3.0](LICENSE.txt)

## Credits

Website:

[![Cloudflare](https://www.vectorlogo.zone/logos/cloudflare/cloudflare-ar21.svg)](https://www.cloudflare.com/ "CDN")
[![Git](https://www.vectorlogo.zone/logos/git-scm/git-scm-ar21.svg)](https://git-scm.com/ "Version control")
[![Github](https://www.vectorlogo.zone/logos/github/github-ar21.svg)](https://github.com/ "Code hosting")
[![Google Analytics](https://www.vectorlogo.zone/logos/google_analytics/google_analytics-ar21.svg)](https://www.google.com/analytics "Traffic Measurement")
[![Handlebars](https://www.vectorlogo.zone/logos/handlebarsjs/handlebarsjs-ar21.svg)](http://handlebarsjs.com/ "Templating")
[![Koa](https://www.vectorlogo.zone/logos/koajs/koajs-ar21.svg)](https://koajs.com/ "Web framework")
[![Node.js](https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg)](https://nodejs.org/ "Application Server")
[![npm](https://www.vectorlogo.zone/logos/npmjs/npmjs-ar21.svg)](https://www.npmjs.com/ "JS Package Management")
[![pino](https://www.vectorlogo.zone/logos/getpinoio/getpinoio-ar21.svg)](https://www.getpino.io/ "Logging")
[![Shoelace CSS](https://www.vectorlogo.zone/logos/shoelacestyle/shoelacestyle-ar21.svg)](https://shoelace.style/ "CSS")
[![TypeScript](https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg)](https://www.typescriptlang.org/ "Programming Language")
[![Google Cloud Run](https://www.vectorlogo.zone/logos/google/google-ar21.svg)](https://cloud.google.com/run/ "Hosting")

API Data Sources:

[![Github](https://www.vectorlogo.zone/logos/github/github-ar21.svg)](https://github.com/ "Github profile image (raster)")
[![Twitter](https://www.vectorlogo.zone/logos/twitter/twitter-ar21.svg)](https://twitter.com/ "Twitter profile image (raster)")
[![SVG Logo Search](https://www.vectorlogo.zone/logos/vectorlogozone/vectorlogozone-ar21.svg)](https://search.vectorlogo.zone/ "SVG Logo Search")

To do:

[![SuperTinyIcons](https://www.vectorlogo.zone/logos/supertinyicons/supertinyicons-ar21.svg)](https://github.com/edent/SuperTinyIcons "tile versions")
[![SVGPorn](https://www.vectorlogo.zone/logos/svgporn/svgporn-ar21.svg)](https://svgporn.com/ "Icon versions of various logos")
[![InstantLogoSearch](https://www.vectorlogo.zone/logos/instantlogosearch/instantlogosearch-ar21.svg)](https://www.instantlogosearch.com/ "Logos")

* https://github.com/simple-icons/simple-icons
* facebook, , youtube
