# Raidfinder

This is my attempt at creating a simple raidfinder for Granblue Fantasy using Angular and Node.js.

## Screenshots
![](https://i.imgur.com/ya0iFV7.png)
![](https://i.imgur.com/8aeJzwU.png)

## Development server
### Running the app:
1. Download [node](https://nodejs.org/en/)
2. Install the angular CLI with the command `npm install -g @angular/cli`
3. Run `npm install` in the root folder, and the `server` folder
4. Add your Twitter API keys and tokens in the `server/server.js` file
5. Run `ng serve` in the root folder, and `npm start` in the `server` folder

## Deployment
### Server:
### Docker
1. Select the correct node version for your system architecture, (most likely `node:`)
2. Add your Twitter API keys and tokens in the `Dockerfile`
3. Run `docker build -t repo:tag .` to build the dockerimage
4. Run the docker image
### Heroku
1. Push the `server/` subfolder to your heroku reposity with `git subtree push --prefix path/to/app-subdir heroku master`
2. Add your Twitter API keys and token to the environment variables.

### Angular app
1. Add the URL to your server in the `apiUrl` property in `environment.prod.ts`
1. Run `ng build --prod`
2. Files will be in the `dist/` folder, move these to your static page server.


