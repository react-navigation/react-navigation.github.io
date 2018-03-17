# React Navigation website

## Run it locally

1. Clone the repository
2. `cd` into the `website` directory.
3. Run `yarn` (or `npm install`)
4. `yarn start`

## Make changes

* The `docs` directory contains the markdown files used to generate the website. Change them and refresh the page when running the documentation locally and you will see the changes reflected.
* If you want to add a new page, you need to add it to [sidebars.json](https://github.com/react-navigation/react-navigation.github.io/blob/source/website/sidebars.json) and then restart the server.

## Deploy it

Only collaborators on this repository can deploy. `cd` into the website directory and run the following command from the `source` branch:

```bash
GIT_USER=your_github_username \
STABLE_RELEASE=ya \
CURRENT_BRANCH=source \
USE_SSH=true \
yarn run publish-gh-pages
```

# Deploy a pre-release

```bash
GIT_USER=your_github_username \
GIT_REMOTE=pre \
CURRENT_BRANCH=source \
USE_SSH=true \
yarn run publish-gh-pages
```
