# Atlas - Travel Memories

A beautiful, private web application to view and organize your travel photos by location.

## Features

- 📍 View places organized by country and state (for Iran)
- 🗺️ Interactive world map with country outlines
- 🇮🇷 Special Iran map showing provinces/states
- 🖼️ Beautiful image gallery with metadata
- 🎨 Modern, dark-themed UI
- 🔒 Private - images are stored locally and gitignored
- ⚡ Fast and lightweight
- 🎯 Visual indicators for visited places (highlighted on map)

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create the images directory:

```bash
mkdir images
```

3. Create a `metadata.json` file in the `images` directory with your image metadata:

```json
[
  {
    "name": "Beautiful sunset in Tehran",
    "country": "Iran",
    "state": "Tehran",
    "date": "2024-01-15",
    "note": "Amazing sunset from our hotel",
    "filename": "tehran-sunset.jpg"
  },
  {
    "name": "Eiffel Tower",
    "country": "France",
    "date": "2023-06-20",
    "note": "Our first time in Paris",
    "filename": "paris-eiffel.jpg"
  }
]
```

4. Copy your image files to the `images` directory (matching the filenames in metadata.json). The images directory is gitignored to keep your photos private.

5. Run the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Image Metadata Format

Each image in `metadata.json` should have:

- `name`: Display name for the image
- `country`: Country name (e.g., "Iran", "France")
- `state`: (Optional) State/province name - **only used for Iran**
- `city`: (Optional) City name - **only used for non-Iran countries**
- `date`: Date in YYYY-MM-DD format
- `note`: (Optional) Additional notes about the image
- `filename`: Name of the image file in the images directory

**Note:**

- For **Iran**: Use `state` field (e.g., "Tehran", "Isfahan")
- For **other countries**: Use `city` field (e.g., "Paris", "Tokyo")
- You can have multiple images for the same place (same country+state or country+city)

## Notes

- The `images/` directory is gitignored to keep your photos private
- Places with images will appear highlighted/darker in the list and map
- **Country Flags**: Each country displays its flag emoji in the list
- **World Map**: Countries you've visited are highlighted in green. Click on them to view photos
- **Iran Map**: Click on Iran in the world map to see all provinces. Visited provinces are highlighted
- **Image Modal**: Click on a place (from list or map) to open a modal with all photos from that location
- Click on any photo in the modal to view it in full screen
- Countries without images appear in gray and are not clickable (except Iran, which is always clickable to show states)
- **Multiple Images**: You can have multiple images for the same place - they'll all be grouped together
