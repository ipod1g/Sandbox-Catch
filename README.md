# Sandbox-Catch

![screenshot](https://github.com/ipod1g/Sandbox-Catch/assets/105120582/0868a88e-2b35-4b58-9c3c-cf4e3efff832)

Try the [Demo](https://sandbox-catch.vercel.app/) !

- 3D catch game where your ship have to board the falling pirates from the sky but avoid the bad pirates! Some are evil and will ruin your ship!

- Playable on both desktop and mobile devices!

## 👁️ Instruction

### How to play

- `A / leftArrow` or `D / rightArrow` to move left and right on desktop

- `Arrow buttons` will show up on mobile devices

Game lasts **60** seconds, with some of them giving `+50` points and some `-100` points, receive the pirates falling from the sky _wisely_!
At the end write the name for your record to see the leaderboard.

The leaderboard from the main menu will show **real time** top 100 scores - if a new top100 enters, it will show up on the screen.

## 🗄️ Architecture

![image](https://github.com/ipod1g/Sandbox-Catch/assets/105120582/6d68a124-dbf6-4fc1-934b-571c95a14847)

## Requirements of the application

### Catch game

- [x] The game displays the start menu. There will be 2 options: Start Game and Leaderboard

- [x] The game only lasts for 60 seconds.
- [x] The user is able to move the catcher left or right to catch the items
- [x] The items drop from top to bottom
- [x] Catching the image (p1-p4) in the assets pack add 50 points
- [x] Catching the image (e1-e2) in the assets pack minus 100 points
- [x] Once the game is finished, the user can input the name and see the ranking

### Leaderboard

- [x] The application will display the top 100 players in real time.
- [x] Each rank shows the player’s score and name.


![sandbox-catch-demo-v1-realtime](https://github.com/ipod1g/Sandbox-Catch/assets/105120582/e58a2457-bb98-4d75-904e-cdf6eec6a61f)


### Additional features
- Notify new top100 entry if you are at the leaderboard screen
- Responsive UI
- Pause game when window loses focus
- Wavy motion, ocean and clouds
- Loading UIs

---

###

# 🖥️ Frontend

## Tech stack

- Application: `react` & `typescript` & `vite`
- 3D canvas and physics engine: `THREE.js` & `react-three-fiber/drei/rapier`
- API layer: `axios` & `react-query`
- State management: `zustand` & `react-query`
- Styling: `tailwindcss`
- Deployment: `vercel`
- Other: `leva` - dev controls for 3D

## Project Structure

Most of the code lives in the `src` folder and looks like this

<details open>

<summary><b>File Structure</b></summary>
<br/>

```sh
src
|
+-- components                # shared components used across the entire application
|   |
|   +-- common                # common/shared components used across the entire application
|   |   |
|   |   +-- Button.tsx
|   |   +-- ...
|   |
|   +-- leaderboard           # components related to the leaderboard feature
|   |   |
|   |   +-- Leaderboard.tsx
|   |   +-- LeaderboardItem.tsx
|   |   +-- ...
|   |
|   +-- three                 # components related to the 3D features
|   |   |
|   |   +-- Experience.tsx
|   |   +-- ShipController.tsx
|   |   +-- ...
|   |
|   +-- ui                    # components specifically used for UI / view rendering and management
|       |
|       +-- MainMenu.tsx
|       +-- GameOverlay.tsx
|       +-- ...
|
+-- config            # all the global configuration, env, game variables etc. get exported from here and used in the app
|
+-- helpers           # helpers for development
|
+-- hooks             # shared hooks used across the entire application
|
+-- lib               # re-exporting different libraries preconfigured for the application
|
+-- stores            # global state stores
|
+-- types             # base types used across the application
|
+-- utils             # shared utility functions
```

</details>

###

# 🗃️ Backend

[Backend Repository](https://github.com/ipod1g/Sandbox-Catch-Backend)

## Tech stack

- Application: `express` & `node`
- Database (relational) & ORM: `postgres` & `supabase` & `drizzle`
- Cache & leaderboard ranking (hash & sortedSet): `redis`
- Deployment: `vercel` with `rimraf`

## API description

### Retrieve Leaderboard Entries

- **GET** - `/api/v1/leaderboard`

  Retrieve a range of leaderboard entries.

  **Parameters:**

  - range (optional, query): The range of leaderboard entries to retrieve.

  **Response:**

  <details open>
  <summary>
  <b>200 - Success response:</b>  An array of leaderboard entries.
  </summary>
  <br/>

  ```json
  [
    {
      "playerName": "John",
      "score": 100
    },
    {
      "playerName": "Alice",
      "score": 90
    }
  ]
  ```

  </details>

  <details open>
  <summary>
  <b>404 - Not found response:</b> Player with the given ID not found.
  </summary>
  <br/>

  ```json
  {
    "error": "No data found."
  }
  ```

  </details>

  <details open>
  <summary>
  <b>500 - Unexpected error response:</b> Internal server error.
  </summary>
  <br/>

  ```json
  {
    "error": "Internal Server Error."
  }
  ```

  </details>

### Insert User into Leaderboard

- **POST** - `/api/v1/leaderboard`

  Insert a user into the
  leaderboard and return with their ID.

  **Request Body:**

  - score (required, number): The score of the player.
    player (required, string): The name of the player.

  **Responses:**

    <details open>
    <summary>
    <b>201 - Success response:</b>  The inserted leaderboard entry.
    </summary>

    <br/>

  ```json
  {
    "id": 1,
    "score": 200,
    "player": "Player 1"
  }
  ```

    </details>

    <details open>
    <summary>
    <b>400 - Bad request response:</b> Invalid request body or data.
    </summary>
    <br/>

  ```json
  {
    "error": "Invalid score. Score must be a number."
  }
  ```

  </details>

  <details open>
  <summary>
  <b>500 - Unexpected error response:</b> Internal server error.
  </summary>
  <br/>

  ```json
  {
    "error": "Internal Server Error."
  }
  ```

  </details>

### Retrieve Player Rank

- **GET** - `/api/v1/leaderboard/rank/{id}`

  Retrieve the rank of a player by their ID.

  **Parameters:**

  - id (required, path): The ID of the player.

  **Responses:**

    <details open>

    <summary>
    <b>200 - Success response:</b>  The rank of the player.
    </summary>

    <br/>

  ```json
  {
    "rank": 1
  }
  ```

    </details>

    <details open>

    <summary>
    <b>404 - Not found response:</b> Player with the given ID not found.
    </summary>
    <br/>

  ```json
  {
    "error": "Player with ID '123' not found."
  }
  ```

   </details>

    <details open>
    <summary>
    <b>400 - Bad request response:</b> Invalid request body or data.
    </summary>
    <br/>

  ```json
  {
    "error": "Player ID required."
  }
  ```

  </details>

  <details open>
  <summary>
  <b>500 - Unexpected error response:</b> Internal server error.
  </summary>
  <br/>

  ```json
  {
    "error": "Internal Server Error."
  }
  ```

  </details>

## 🌐 How to deploy locally

### Environment

- Node.js >= 18
- pnpm >= 8

Setup the following environment variables and run with `pnpm run dev` (recommended)

### Frontend

> `.env`

```

NEXT_PUBLIC_SUPABASE_URL = "your supabase url"
NEXT_PUBLIC_SUPABASE_ANON_KEY = "your supabase anon key"

```

> terminal

```bash
pnpm install
pnpm run dev
```

### Backend

[Backend Repository](https://github.com/ipod1g/Sandbox-Catch-Backend)

You need to have a supabase and redis account to get the URLs

> `.env`

```
DATABASE_URL = "your supabase db url"
REDIS_URL = "your redis url"
```

> terminal

```bash
pnpm install
pnpm run generate
pnpm run migrate
pnpm run seed # (if you want 100 pre generated entries)
pnpm run dev
```
