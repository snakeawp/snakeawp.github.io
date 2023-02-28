import { createServer } from 'cors-anywhere';

createServer({
    originWhitelist: [], // Permite todos os hosts
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(8080, 'localhost', () => {
    console.log('CORS Anywhere está rodando na porta 8080!');
});