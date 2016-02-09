# Rmindr

> *"Reminders for everyone every way"*

## Web App
#### [rmindr.herokuapp.com](http://rmindr.herokuapp.com)

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Contributing](#contributing)

## Usage

> This web application will allow users to configure a wide variety of customizable reminders to be received at specified times in the future.

## Requirements

- Node.js 4.2.1
- Express.js 4.13.3
- kue 0.10.4
- moment-timezone 0.4.1
- nodemailer 1.10.0
- Redis 3.0.5

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```

### Deployment

This project is deployed on Heroku, using Heroku Redis and kue.js to implement a priority job queue.

### Roadmap

View the project roadmap [here](https://github.com/dougshamoo/rmindr/issues)


## Contributing

See our [contribution guide](CONTRIBUTING.md) for guidelines.