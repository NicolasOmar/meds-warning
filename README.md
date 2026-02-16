<!-- README -->
# MedsWarning
A web system to help users manage and track their medication expiration dates and send reminders to renew those that have expired.

## Table of contents
- [Purpose](#purpose)
- [Status](#status)
- [Project Stack](#project-stack)
- [What do I need?](#what-do-i-need)
- [Setup](#setup)
- [How to run it](#how-to-run-it)
- [Folder structure](#folder-structure)
- [Branches and Environments](#branches-and-environments)
- [Roadmap](#roadmap)
- [License](#license)

## Purpose
After developing several React-based applications with a similar tooling stack, I wanted to expand my skills in several concepts (such as `server-side rendering`) and libraries (such as `zod`, `prisma`, and `shadcn`).

Also, I wanted to unify this new stack into a tool, though for a common issue, the expiration date.

The tool's objective is to <u>create notifications across several channels that warn the user which meds are about to expire</u> and avoid unpleasant situations (sometimes we need a pill for a headache, and if it is consumed after that date, its effect can be reduced to zero or provoke side effects).

## Status
![Project version][badge-repo-version]
[![Code Coverage][badge-code-coverage]][link-code-coverage]
[![Quality Gate Status][badge-soundcloud-quality]][link-soundcloud-status]
[![Maintainability Rating][badge-soundcloud-maintanibility]][link-soundcloud-status]
[![Security Rating][badge-soundcloud-security]][link-soundcloud-status]
[![Technical Debt][badge-soundcloud-tech-debt]][link-soundcloud-status]
[![Known Vulnerabilities][badge-snyk-status]][link-snyk-status]
![GitHub Repo stars][badge-github-repo-stars]
![GitHub commit activity][badge-github-commits]
![GitHub last commit][badge-github-last-commit]
[![Semantic Commits][badge-semantic-commits]][link-semantic-commits]

[badge-repo-version]: https://img.shields.io/github/package-json/v/nicolasomar/meds-warning?label=version&logo=npm&color=success
[badge-code-coverage]: https://img.shields.io/codecov/c/github/nicolasomar/meds-warning?label=coverage&logo=codecov
[link-code-coverage]: https://app.codecov.io/gh/NicolasOmar/meds-warning
[badge-soundcloud-quality]: https://sonarcloud.io/api/project_badges/measure?project=NicolasOmar_meds-warning&metric=alert_status
[badge-soundcloud-maintanibility]: https://sonarcloud.io/api/project_badges/measure?project=NicolasOmar_meds-warning&metric=sqale_rating
[badge-soundcloud-security]: https://sonarcloud.io/api/project_badges/measure?project=NicolasOmar_meds-warning&metric=security_rating
[badge-soundcloud-tech-debt]: https://sonarcloud.io/api/project_badges/measure?project=NicolasOmar_meds-warning&metric=sqale_index
[link-soundcloud-status]: https://sonarcloud.io/summary/new_code?id=NicolasOmar_meds-warning
[badge-snyk-status]: https://snyk.io/test/github/nicolasomar/meds-warning/badge.svg
[link-snyk-status]: https://snyk.io/test/github/nicolasomar/meds-warning
[badge-github-repo-stars]: https://img.shields.io/github/stars/nicolasomar/meds-warning?label=stars&logo=github&labelColor=535353&style=flat
[badge-github-commits]: https://img.shields.io/github/commit-activity/m/nicolasomar/meds-warning?logo=github
[badge-github-last-commit]: https://img.shields.io/github/last-commit/nicolasomar/meds-warning?logo=github
[badge-semantic-commits]: https://img.shields.io/badge/using-conventional%20commits-e10079?logo=conventional-commits
[link-semantic-commits]: https://github.com/semantic-release/semantic-release

## Project Stack
![nextjs dependency][badge-dependency-next]
![react dependency][badge-dependency-react]
![lucide-react dependency][badge-dependency-lucide-react]
![typescript dependency][badge-dependency-typescript]
![prisma dependency][badge-dependency-prisma]
![postgres dependency][badge-dependency-postgres]
![tailwind dependency][badge-dependency-tailwind]
![zod dependency][badge-dependency-zod]
![mailgin dependency][badge-dependency-mailgun]
![vitest dependency][badge-dependency-vitest]
![react testing library dependency][badge-dependency-react-testing-library]
![eslint dependency][badge-dependency-eslint]
![prettier dependency][badge-dependency-prettier]
![lint-staged dependency][badge-dependency-lint-staged]
![husky dependency][badge-dependency-husky]
![semantic-release dependency][badge-dependency-semantic-release]
![commitlint dependency][badge-dependency-commitlint]

[badge-dependency-next]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/next/main?logo=next.js
[badge-dependency-react]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/react/main?logo=react
[badge-dependency-lucide-react]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/lucide-react/main?logo=lucide
[badge-dependency-typescript]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/typescript/main?logo=typescript
[badge-dependency-tailwind]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/tailwindcss/main?logo=tailwindcss
[badge-dependency-postgres]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/pg/main?logo=postgresql
[badge-dependency-prisma]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/prisma/main?logo=prisma
[badge-dependency-zod]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/zod/main?logo=zod
[badge-dependency-mailgun]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/mailgun.js/main?logo=mailgun
[badge-dependency-vitest]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/vitest/main?logo=vitest
[badge-dependency-react-testing-library]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/@testing-library/react/main?logo=testinglibrary
[badge-dependency-eslint]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/eslint/main?logo=eslint
[badge-dependency-prettier]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/prettier/main?logo=prettier
[badge-dependency-lint-staged]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/lint-staged/main?logo=lint-staged
[badge-dependency-husky]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/husky/main?logo=husky
[badge-dependency-semantic-release]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/semantic-release/main?logo=semantic-release
[badge-dependency-commitlint]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/@commitlint/cli/main?logo=commitlint

## What do I need?
Before cloning this repo, I recommend installing the following software:
- [Node](https://nodejs.org/en/download/) >= `24.4.0` to install packages.
- A [PostgreSQL database](https://www.postgresql.org/download/) on your local machine or in a cloud service.
- A [Mailgun account](https://www.mailgun.com/) to access its API key and sender email address.

## Setup
After cloning the repo, install the node packages in the project's root file.
```sh
git clone https://github.com/NicolasOmar/meds-warning.git
cd meds-warning
npm run setup
```

At last, create an `.env` file at your project's root with the following content.
```env
DATABASE_URL=HERE_GOES_YOUR_DATABASE_CONNECTION_STRING
MAILGUN_API_KEY=HERE_GOES_YOUR_MAILGUN_API_KEY
MAILGUN_DOMAIN=HERE_GOES_YOUR_MAILGUN_DOMAIN
JWT_SECRET=HERE_GOES_YOUR_JWT_SECRET
TEST_PASSWORD=HERE_GOES_YOUR_TEST_PASSWORD
```

> TEST_PASSWORD is only for a placeholder text in certain scenarios; its data will not impact any database.

> MAILGUN_DOMAIN is the [domain you configured in Mailgun](https://help.mailgun.com/hc/en-us/articles/202464990-How-can-I-start-sending-email) in order to make the mailing sevice work.

## How to run it
To run it, simply execute
```sh
npm start
```
In case you want to execute it as a single instance (using a production-like build)
```sh
npm start:prod
```

## Folder structure
In case you have cloned the repo, it will show you the following folders:
- `.github:` [Github Actions](https://github.com/features/actions/) files used to run post-merge commits like unit test coverage collection.
- `.husky:` Dedicated to [Husky](https://typicode.github.io/husky/) configuration files.
- `actions:` Dedicated to [React's Server Functions](https://nextjs.org/docs/app/getting-started/updating-data). Organized by entity.
- `app:` Location of system's routes structure based on [NextJs App Router](https://nextjs.org/docs/app/getting-started/layouts-and-pages).
- `components:` Location of all used components:
  - `base:` Those installed from [shadcn](https://ui.shadcn.com/).
  - `custom:` Implementations of base components with logic included to handle specific tasks.
  - `forms:` Form components with their own input structure and action call. Those are client components due to the [useActionState](https://react.dev/reference/react/useActionState) hook.
- `prisma:` Location of prisma implementation with its `models/entities` and migrations to mirror the entities relationship in the database.
- `shared`: Location of shared pieces of reusable code to be used across the system.
  - `constants:`: Dedicated to labels, strings, regular expressions, and configuration objects.
  - `functions:`: Dedicated to generalistic functions that can be used across the application.
  - `ts:` Dedicated to typescript interfaces, types, enums, and other features.

## Branches and Environments
After my previous experience with [semantic-release](https://semantic-release.gitbook.io/semantic-release/) in [other projects](https://github.com/NicolasOmar/reactive-bulma/issues/3), I decided to give the following meaning to the project's versions after `v4.0.0`:
- Major versions (`5.0.0`, `6.0.0`, and beyond) will refer to milestone achievements and significant changes that will need extra attention before the update.
- Minor versions (`4.1.0`, `4.2.0`, and so on) will refer to bug fixes that required several important code changes or specific new features.
- Patch versions (`4.0.1`, `4.0.2`, and so on) will refer to bug fixes that required small code changes or weekly dependency updates.

To check the current project's status, go to the [Roadmap](#roadmap) section.

### Branching

Given the mentioned release logic, `main` is the only static branch, and each developed feature or fix will have a unique branch with its PR and a merge commit following [semantic versioning](https://semver.org/) and [semantic commits](https://github.com/semantic-release/semantic-release#commit-message-format) specifications.

## Roadmap
The first version/release ([`v1.0`](https://github.com/NicolasOmar/meds-warning/milestone/1)) was created to investigate, pick, and integrate several libraries as project technical foundations, which took the shape of a proof of concept that you can review [here](https://meds-warning.vercel.app/).

Right now, I have listed the first series of features related to the project's objective. which will be shipped as part of [release `v2.0`](https://github.com/NicolasOmar/meds-warning/milestone/2)

Right before delivering the last feature, I will work on at least a third series of improvements in order to create a solid solution for any user.

I will keep you posted on any updates, which will be forthcoming shortly.

Nowadays, I am updating the rest of the dependencies every week, creating a PR alongside its related branch and PR to maintain track of those updates.

If you want the actual short-term status, go to the [project board](https://github.com/users/NicolasOmar/projects/4) (powered by `GitHub Projects`).

## License
**GPL 3.0**