# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run start:lan`

Runs the app on your local network so other devices on the same Wi-Fi can open it.\
For example, if your PC IP is `10.171.199.220`, open this URL on your phone:

`http://10.171.199.220:3005`

Then create a QR code for that address and scan it from your phone. Use any free QR generator, for example:

`https://api.qrserver.com/v1/create-qr-code/?data=http://10.171.199.220:3005&size=300x300`

Make sure your phone and PC are on the same network and that port `3005` is not blocked by your firewall.

### QR shortcut for deployed app

If your app is deployed to GitHub Pages at `https://Aeju011.github.io/Aejaz-menu-pos`, the QR image link is:

`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2FAeju011.github.io%2FAejaz-menu-pos`

Use that link to print or share the menu QR directly, or open the app and tap the “Print QR” button for a poster-ready version.

## Public deployment

To make the menu available anywhere, deploy the app to a public static host.

### GitHub Pages

1. Create a GitHub repository and push this project.
2. Add your repo URL under `homepage` in `package.json` as:

```json
"homepage": "https://<your-github-username>.github.io/<repo-name>"
```

3. Run:

```bash
npm install
npm run deploy
```

4. Your app will be published at the `homepage` URL.

### Netlify

1. Sign up at https://app.netlify.com/ and connect your GitHub repository.
2. Set the build command to:

```bash
npm run build
```

3. Set the publish directory to:

```bash
build
```

The app will then be available at a public Netlify URL, and you can use that URL for a QR code.

### Why this is best

- `npm run start:lan` is only for local testing.
- A public host makes the QR work anywhere, not just on your Wi-Fi.
- Netlify and GitHub Pages both support React apps with client-side routing.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
