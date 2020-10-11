import app from './app.js';
import '../styles/index.scss';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

app.init();