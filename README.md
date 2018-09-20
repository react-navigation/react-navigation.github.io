# React Navigation website

## Run it locally

1. Clone the repository
2. `cd` into the `website` directory.
3. Run `yarn` (or `npm install`)
4. `yarn start`

## Make changes

* The `docs` directory contains the markdown files used to generate the website. Change them and refresh the page when running the documentation locally and you will see the changes reflected.
* If you want to add a new page, you need to add it to [sidebars.json](https://github.com/react-navigation/react-navigation.github.io/blob/source/website/sidebars.json) and then restart the server.

## Download the latest translations

- Configure `CROWDIN_DOCUSAURUS_PROJECT_ID` and `CROWDIN_DOCUSAURUS_API_KEY` environment variables (ask @brentvatne if you need access).
- `cd website` and run `yarn crowdin-upload` and then `yarn crowdin-download`

## Deploy it

*Before deploying, be sure to download the latest translations!*

Only collaborators on this repository can deploy. `cd` into the website directory and run the following command from the `2.x` branch:

```bash
GIT_USER=your_github_username \
STABLE_RELEASE=true \
CURRENT_BRANCH=your_branch_name \
USE_SSH=true \
yarn run publish-gh-pages
```

# Deploy a pre-release

```bash
GIT_USER=your_github_username \
CURRENT_BRANCH=your_branch_name \
USE_SSH=true \
yarn run publish-gh-pages
```
