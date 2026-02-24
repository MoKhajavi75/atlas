# Atlas - Travel Memories

A beautiful, private web application to view and organize your travel photos by location.

## Features

- Interactive world map with visited countries highlighted
- Dedicated Iran map showing provinces/states
- Image gallery with metadata (name, date, location, notes)
- RTL support for Persian/Arabic text
- Private — images are stored locally and never committed

## Setup

### Prerequisites

- Node >= 24
- pnpm >= 10

### Local development

1. Install dependencies:

```bash
pnpm install
```

2. Create the `images/` directory and add your `metadata.json`:

```bash
cp images/metadata.json.example images/metadata.json
```

3. Copy your photo files into `images/` (filenames must match `metadata.json`).

4. Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker

```bash
docker build -t atlas .
docker run -p 3000:3000 -v ./images:/app/images atlas
```

## Image Metadata Format

Each entry in `images/metadata.json`:

| Field      | Required | Description                                    |
| ---------- | -------- | ---------------------------------------------- |
| `name`     | yes      | Display name                                   |
| `country`  | yes      | Country name (e.g. `"Iran"`, `"France"`)       |
| `state`    | no       | Province — **Iran only** (e.g. `"Tehran"`)     |
| `city`     | no       | City — **non-Iran countries** (e.g. `"Paris"`) |
| `date`     | yes      | `YYYY-MM-DD`                                   |
| `note`     | no       | Optional caption                               |
| `filename` | yes      | File in `images/` directory                    |

```json
[
  {
    "name": "Sunset in Tehran",
    "country": "Iran",
    "state": "Tehran",
    "date": "2024-01-15",
    "note": "Amazing sunset from our hotel",
    "filename": "tehran-sunset.jpg"
  },
  {
    "name": "Eiffel Tower",
    "country": "France",
    "city": "Paris",
    "date": "2023-06-20",
    "filename": "paris-eiffel.jpg"
  }
]
```

Multiple entries sharing the same `country`+`state` or `country`+`city` are grouped into a single place.

## Notes

- Visited countries/provinces are highlighted on the map and clickable. Unvisited ones are grey and non-clickable (Iran is always clickable to browse provinces).
- Click a place to open the image gallery; click any photo for full-screen view.
