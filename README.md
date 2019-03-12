# React Navigation website

Want to help improve the documentation? That would be so very much appreciated. Some information on that below.

## Philosophy of documentation

- *Document the ugly parts as much as the good parts.* It's better for users to know that we don't have a good solution to the problem they have and get the preferred workarounds from us than have to scour the dark and moist corners of StackOverflow.
- *Provide runnable examples where possible.* Learning through interacting with the code is a reason why REPLs are so popular. Thanks to [Snack](https://snack.expo.io) we can provide the same kind of experience for React Navigation users too.
- *Be honest about the tradeoffs and limitations.* We explain the pitch and anti-pitch of React Navigation and provide alternative libraries if React Navigation might not be a good fit. We should provide a similar level of honesty at finer levels of granularity as well.

## Things anyone can do

### Run it locally

1. Clone the repository
2. `cd` into the `website` directory.
3. Run `yarn` (or `npm install`)
4. `yarn start`

### Make changes

* The `docs` directory contains the markdown files used to generate the website. Change them and refresh the page when running the documentation locally and you will see the changes reflected.
* If you want to add a new page, you need to add it to [sidebars.json](https://github.com/react-navigation/react-navigation.github.io/blob/source/website/sidebars.json) and then restart the server.

## Things you need to be a collaborator to do

### Download the latest translations

- Configure `CROWDIN_DOCUSAURUS_PROJECT_ID` and `CROWDIN_DOCUSAURUS_API_KEY` environment variables (ask @brentvatne if you need access).
- `cd website` and run `yarn crowdin-upload` and then `yarn crowdin-download`

### Deploy it

*Before deploying, be sure to download the latest translations!*

Only collaborators on this repository can deploy. `cd` into the website directory and run the following command from the `source` branch:

```bash
GIT_USER=your_github_username \
STABLE_RELEASE=true \
CURRENT_BRANCH=source \
USE_SSH=true \
yarn run publish-gh-pages
```
