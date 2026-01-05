# MedsWarning
A web system to help users manage and track their medication expiration dates and remind them to renew them.

## Table of contents
- [Purpose](#purpose)
- [Status](#status)
- [Dependencies](#dependencies)
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

## Dependencies
![nextjs dependency][badge-dependency-next]
![react dependency][badge-dependency-react]
![prisma dependency][badge-dependency-prisma]
![postgres dependency][badge-dependency-postgres]
![tailwind dependency][badge-dependency-tailwind]
![zod dependency][badge-dependency-zod]
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
[badge-dependency-tailwind]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/tailwindcss/main?logo=tailwindcss
[badge-dependency-postgres]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/pg/main?logo=postgresql
[badge-dependency-prisma]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/prisma/main?logo=prisma
[badge-dependency-zod]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/zod/main?logo=zod
[badge-dependency-vitest]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/vitest/main?logo=vitest
[badge-dependency-react-testing-library]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/my-pets/dev/@testing-library/react/main?logo=testinglibrary
[badge-dependency-eslint]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/eslint/main?logo=eslint
[badge-dependency-prettier]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/prettier/main?logo=prettier
[badge-dependency-lint-staged]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/lint-staged/main?logo=lint-staged
[badge-dependency-husky]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/husky/main?logo=husky
[badge-dependency-semantic-release]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/semantic-release/main?logo=semantic-release
[badge-dependency-commitlint]: https://img.shields.io/github/package-json/dependency-version/nicolasomar/meds-warning/dev/@commitlint/cli/main?logo=commitlint

## What do I need?
Before cloning this repo, I recommend installing the following software:
- [Node](https://nodejs.org/en/download/) >= `24.4.0` to install packages

## Setup
After cloning the repo, install the node packages in the project's root file.
```sh
git clone https://github.com/NicolasOmar/meds-warning.git
cd meds-warning
npm install
```

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
TBA

## Branches and Environments
TBA

## Roadmap
At this moment, I am organizing the main features into several stories that will give shape to at least 3 main versions.

Aside from thinking about objectives, I have the following first steps.
- I already created the main scaffolding using NextJS with TypeScript and am deploying the starter pack to Vercel (the link will be available in the near future).
- My next step will be to look for the toolset to be used in my day-to-day (I will create an issue for that also) and implement it.
- From that point, I will be integrating some third-party services for code quality control and dependency health (among other services to be used).

Will keep you posted on any updates, which will be forthcoming shortly.

## License
**GPL 3.0**