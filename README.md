## Whack-A-Mole

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

- For the sake of simplicity and time, this was done as a single-file vanilla JS app. 
- I used a more functional approach here, but the game, hit counter and timer instances could also easily be converted to classes.
- In a v2, I'd probably port this into React and set up the game board, timer, hit counter and moles as functional components.
- This game is mobile-friendly, and also works in IE11+, Edge, Chrome, Firefox and Safari browsers.
- This project was bootstrapped using [Webpack Frontend Starterkit](https://github.com/wbkd/webpack-starter).