# Redmine Burndown Chart

### Introduction

Redmine Burndown Chart is standalone tool to visualize queries results as burndown chart. Tool uses Redmine REST API that mean you must enable CORS for Redmine with plugin like [this](http://www.redmine.org/plugins/redmine_cors).

You can find online version [here](http://shiroari.github.io/redmine-burndown-chart/).

### Screenshots

<img src="docs/images/screenshot.png">

### Settings

**The application settings are saving to browser local storage!**

To get access to redmine data the application needs a redmine location and a user's [API key](http://www.redmine.org/projects/redmine/wiki/Rest_api#Authentication).

How to get API key:

1\. Open your account page by link at page header.

<img src="docs/images/apikey-guide.png" width="500px">

2\. Click `Show` link to see your API key and copy it.

<img src="docs/images/apikey.png" width="500px">

3\. Open the application and click `cog` icon in the `Presets` list. Enter a redmine location and your API key.

<img src="docs/images/settings.png" width="500px">

### Restrictions

1. The application needs created queries in Redmine.
1. The work remaining is counted by `estimated hours` field.
1. Tasks are binded to timeline by `updated` date field.
1. Supported status names: `Closed`, `Reject`, `Review`, `Testing`, `Autotest`, `Reopened`, `In Progress`.
1. Saturday and Sunday are ignored.
