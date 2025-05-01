# Faydrin-Public
![alt text](public/banner-trans.png)

Faydrin is a new, open-source social-media platform built for creatives, makers, and storytellers. 

If you want to base your project off Faydrin, you can and every technology I list has a free version, but;

First take a look at the project license and ensure the neccesary attributions. Secondly, here's the basic stuff you need:

[Node.js](https://nodejs.org/en)

[Supabase](https://supabase.com/) (To host your database)
I'm not going to step by step but you must set up the different tables in Supabase (I.e posts, comments, profiles) and configure the RLS. You can find tutorials online, and obviously using an alternative database service is feasible, but would require major reworking, specifically regarding authentacation considering that we use Supabase to sign in with it's authentaciation providers (I.e Google, Discord). I highly reccomend Supabase, in general.  

To begin, in your command prompt, run:
```
npm install
```
This will install all of the dependencies, most notably [Vite](https://vite.dev/) and [React](https://react.dev/). 

Next, fill out the relevant information. In `supabase-client.ts` put the URL supabase gives you, in `vite.config.ts`, you'll need to add your website's URL or localhost address. In `.env` you'll need your [Supabase](https://supabase.com/) anon key.

Finally, run:

```
npm run dev
```

This will host it to localhost for testing. You can use [Cloudflare](https://www.cloudflare.com/) or an alternative to tunnel that to a public domain, and I also won't go in depth on that, but you'll want to build it first:

```
npm run build
```

and then

```
npx serve dist --listen 5173
```

