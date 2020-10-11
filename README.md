# Whack-A-Mole

A simple whack-a-mole style game built using vanilla JavaScript, HTML5 and CSS. 

See how many moles you can whack before time runs out!

## Demo

https://xenodochial-einstein-2b7ca9.netlify.app

## Setup

Clone this repo and run the following commands from the project root to fire it up on http://localhost:8080.

### Installation

```
npm install
```

### Start Dev Server

```
npm start
```

### Build Prod Version

```
npm run build
```

## Notes

- For simplicity, this was done as a single-file vanilla JS app. 
- I used a more functional approach here, but the moles, timer and hit counter instances would easily convert to classes.
- In a v2, I would port this into React and break everything out into separate modules and functional components.
- This game is fully responsive, and also works in IE11+, Edge, Chrome, Firefox and Safari browsers.
- The project was bootstrapped using [Webpack Frontend Starterkit](https://github.com/wbkd/webpack-starter).