---
id: version-4.x-contributing
title: React Navigation contributor guide
sidebar_label: Contributing
original_id: contributing
---

Want to help improve React Navigation? Your help would be greatly appreciated!

Here are some of the ways to contribute to the project:

- [Reporting Bugs](#reporting-bugs)
- [Improving the Documentation](#improving-the-documentation)
- [Responding to Issues](#responding-to-issues)
- [Bug Fixes](#bug-fixes)
- [Suggesting a Feature](#suggesting-a-feature)
- [Big Pull Requests](#big-pull-requests)

And here are a few helpful resources to aid in getting started:

- [Issue Template](#issue-template)
- [Pull Request Template](#pull-request-template)
- [Forking the Repository](#forking-the-repository)
- [Code Review Guidelines](#code-review-guidelines)
- [Run the Example App](#run-the-example-app)
- [Run the Website](#run-the-website)
- [Run Tests](#run-tests)

## Contributing

### Reporting Bugs

You can't write code without writing the occasional bug. Especially as React Navigation is moving quickly, bugs happen. When you think you've found one here's what to do:

1. Search the existing issues for one like what you're seeing. If you see one, add a 👍 reaction (please no +1 comments). Read through the comments and see if you can provide any more valuable information to the thread
2. If there are no other issues like yours then create a new one. Be sure to follow the [issue template](https://github.com/react-navigation/react-navigation-4/blob/master/.github/ISSUE_TEMPLATE.md).

Creating a high quality reproduction is critical. Without it we likely can't fix the bug and, in an ideal situation, you'll find out that it's not actually a bug of the library but simply done incorrectly in your project. Instant bug fix!

### Improving the Documentation

Any successful projects needs quality documentation and React Navigation is no different.

Read more about the documentation on the [react-navigation/react-navigation.github.io repository](https://github.com/react-navigation/react-navigation.github.io).

### Responding to Issues

Another great way to contribute to React Navigation is by responding to issues. Maybe it's answering someone's question, pointing out a small typo in their code, or helping them put together a reproduction. If you're interested in a more active role in React Navigation start with responding to issues - not only is it helpful but it demonstrates your commitment and knowledge of the code!

### Bug Fixes

Find a bug, fix it up, all day long you'll have good luck! Like it was mentioned earlier, bugs happen. If you find a bug do the following:

1. Check if a pull request already exists addressing that bug. If it does give it a review and leave your comments
2. If there isn't already a pull request then figure out the fix! If it's relatively small go ahead and fix it and submit a pull request. If it's a decent number of changes file an issue first so we can discuss it (see the [Big Pull Requests](#big-pull-requests) section)
3. If there is an issue related to that bug leave a comment on it, linking to your pull request, so others know it's been addressed.

Check out the [help wanted](https://github.com/react-navigation/react-navigation-4/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) and [good first issue](https://github.com/react-navigation/react-navigation-4/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) tags to see where you can start helping out!

### Suggesting a Feature

Is there something you want to see from React Navigation? Please [create a feature request on Canny](https://react-navigation.canny.io/feature-requests).

### Big Pull Requests

For any changes that will add/remove/modify multiple files in the project (new features or bug fixes) hold off on writing code right away. There's a few reasons for that

1. Big pull requests take a lot of time to review and it's sometimes hard to pick up the context
2. Often you may not have to make as big of a change as you expect

With that in mind, here's the suggestion

1. Open an issue and clearly define what it is you want to accomplish and how you intend to accomplish it
2. Discuss that solution with the community and maintainers. Provide context, establish edge cases, and figure out the design
3. Decide on a plan of action
4. Write the code and submit the PR
5. Review the PR. This can take some time but, if you followed the steps above, hopefully it won't take too much time.

The reason we want to do this is to save everyone time. Maybe that feature already exists but isn't documented? Or maybe it doesn't fit with the library. Regardless, by discussing a major change up front you're saving your time and others time as well.

### Interface Changes & Types

If you ever find yourself making a change to the project's public interface (the API) then you should make sure to update the corresponding library definitions for Flow. These "libdefs" specify our API's types so that library users can typecheck their code. An example of a qualifying change would be adding a new navigation option.

The libdef (located at `flow/react-navigation.js`) will need to be updated such that running `flow` in the `example` folder produces no errors.

1. Follow the instructions in the [Run the Example App](#run-the-example-app) section to prepare the `NavigationPlayground` example and install `flow` into the example's local `node_modules/.bin` folder.
2. Run `flow` to see any current errors.
3. If no errors occur as a result of an API change, that indicates that we don't have any coverage in the `NavigationPlayground` example project for your API change. This is frequently the case - for instance, if you add a new navigation option. In this case, you must add an example use of your new feature to `NavigationPlayground` so that you can test your libdef changes, and so that we can keep your feature properly tested and typed in perpetuity.
4. Once you are seeing errors, go ahead and update the libdef (located at `flow/react-navigation.js`) so that there are no longer any errors when you run `flow` from within `example`.
5. Include the libdef changes in the PR for your new feature. Make sure to flag to the maintainers that your PR has a libdef change, so that when the next version of the library is released, we make sure to upload the updated libdef to the `flow-typed` repo.

## Information

### Issue Template

Before submitting an issue, please take a look at the [issue template](https://github.com/react-navigation/react-navigation-4/blob/master/.github/ISSUE_TEMPLATE.md) and follow it. This is in place to help everyone better understand the issue you're having and reduce the back and forth to get the necessary information.

Yes, it takes time and effort to complete the issue template. But that's the only way to ask high quality questions that actually get responses.

Would you rather take 1 minute to create an incomplete issue report and wait months to get any sort of response? Or would you rather take 20 minutes to fill out a high quality issue report, with all the necessary elements, and get a response in days? It's also a respectful thing to do for anyone willing to take the time to review your issue.

### Pull Request Template

Much like the issue template, the [pull request template](https://github.com/react-navigation/react-navigation-4/blob/master/.github/PULL_REQUEST_TEMPLATE.md) lays out instructions to ensure your pull request gets reviewed in a timely manner and reduces the back and forth. Make sure to look it over before you start writing any code.

### Forking the Repository

- Fork [`react-navigation`](https://github.com/react-navigation/react-navigation) on GitHub
- Run these commands in the terminal to download locally and install it:

```bash
git clone https://github.com/<USERNAME>/react-navigation.git
cd react-navigation
git remote add upstream https://github.com/react-navigation/react-navigation.git
yarn install
```

### Code Review Guidelines

Look around. Match the style of the rest of the codebase. This project uses ESLint to ensure consistency throughout the project. You can check your project by running

```bash
yarn lint
```

If any errors occur you'll either have to manually fix them or you can attempt to automatically fix them by running `yarn lint --fix`.

### Run the Example App

The [NavigationPlayground](https://github.com/react-navigation/react-navigation-4/tree/master/example) example app includes a variety of patterns and is used as a simple way for contributors to manually integration test changes. See the [README](https://github.com/react-navigation/react-navigation-4/blob/master/example/README.md) for instructions to run it.

### Run the Website

For development mode and live-reloading:

```bash
cd website
yarn install
yarn start
```

To run the website in production mode with server rendering:

```bash
yarn prod
```

If you've made any changes to the `docs` directory you'll need to run `yarn build-docs` from the root of the project before they're picked up by the website.

### Run Tests

React Navigation has tests implemented in [Jest](https://facebook.github.io/jest/). To run either of these, from the React Navigation directory, run either of the following commands (after installing the `node_modules`) to run tests or type-checking.

```bash
yarn test
```

These commands will be run by our CI and are required to pass before any contributions are merged.
