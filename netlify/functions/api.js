import ServerlessHttp from "serverless-http";
import app from "../../app.js";

export const handler = ServerlessHttp(app, {
  request: (request, _event, _context) => {
    // Normalize the URL path
    request.url = request.url.replace(/^\/\.netlify\/functions\/api/, '');
    if (request.url === '') {
      request.url = '/';
    }
    return request;
  }
});