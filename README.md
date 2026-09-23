# Meal Portion Counter

A lightweight meal-prep calculator for splitting ingredient weights across portions.

## Features

- Add a meal name, total weight, and number of portions
- Add ingredients with their weights
- Automatically calculate grams per portion as the user edits the list
- Save recipes to a local cookbook
- Load saved recipes back into the form
- When ingredient names change, choose between:
  - saving as a new recipe
  - overwriting the existing recipe
- When only ingredient weights change, the saved recipe is updated automatically
- Available in English and Czech
- Language preference is remembered in the browser

## Deployment

This project is a static site and can be deployed directly to Cloudflare Pages with no build step.

### Cloudflare Pages

1. Open Cloudflare Pages.
2. Create a new project.
3. Select the repository.
4. Choose the project root as the folder containing the static files.
5. Publish the site.

## Local usage

Open `index.html` in a browser, or serve the folder with any static file server.

## Notes

The app stores recipes in the browser using `localStorage`, so data is saved per browser and device.
