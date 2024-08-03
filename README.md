# LuxorLabs Frontend Challenge

A simple bidding system built with Next.js and Tailwind CSS.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/) (version 14 or later).
- You have a PostgreSQL database setup.

## Installation

To install and set up the project, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/en-mac/luxorlabs-frontend-challenge.git
    cd luxorlabs-frontend-challenge
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up the environment variables**:
    Create a `.env` file in the `luxorlabs-frontend-challenge` directory and add your database connection string:
    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/mydb
    ```

4. **Run database migrations**:
    ```bash
    npm run migrate
    ```

5. **Seed the database**:
    ```bash
    npm run seed
    ```

6. **Start the development server**:
    ```bash
    npm run dev
    ```

## Usage

To use the project, open your browser and navigate to `http://localhost:3000`.

### Features

- **Create Collection**: Add new collections.
- **Edit/Delete Collection**: Update or delete existing collections.
- **Place Bid**: Place bids on collections.
- **Accept/Reject Bid**: Accept a bid and automatically reject others.

## API Endpoints

### Collections

- **GET /api/collections**: Get all collections.
- **POST /api/collections**: Create a new collection.
- **GET /api/collections/[id]**: Get bids for a specific collection.
- **PUT /api/collections/[id]**: Update a specific collection.
- **DELETE /api/collections/[id]**: Delete a specific collection.

### Bids

- **POST /api/collections/[id]**: Place a bid on a collection.
- **PUT /api/bids/[id]**: Update a specific bid.
- **DELETE /api/bids/[id]**: Delete a specific bid.
- **POST /api/bids/accept**: Accept a bid and reject others.

