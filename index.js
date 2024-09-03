const http = require('node:http');
const { getRequestBody, getBookById } = require('./utilities/common');
const { getBooksData } = require('./utilities/get-books');
const { validatingCreateBookData, getNextBookId, createBook } = require('./utilities/create-book');
const { validatingUpdateBookData, updateBook } = require('./utilities/update-book');
const { validatingDeleteBookData, deleteBook } = require('./utilities/delete-book');

const server = http.createServer(async (request, response) => {

    if (request.method === "GET") {

        if (request.url === "/books") {

            try {
                let booksData = await getBooksData();

                response.writeHead(200, { 'Content-Type': 'Application/json' });
                response.write(JSON.stringify(booksData));
                return response.end();
            } catch (error) {

                response.writeHead(500, { 'Content-Type': 'Application/json' });
                response.write(JSON.stringify(
                    {
                        message: error.message
                    }
                ));
                return response.end();
            }
        }
        else {
            response.writeHead(404, { 'Content-Type': 'Application/json' });
            response.write(JSON.stringify(
                {
                    message: `Le lien '${request.url}' est invalide. Veuillez vérifier l'URL et essayer de nouveau.`
                }
            ));
            return response.end();
        }
    }
    else if (request.method === "POST") {

        if (request.url === "/books") {
            try {
                let bookData = await getRequestBody(request);

                validatingCreateBookData(bookData);

                let nextBookId = await getNextBookId();

                await createBook(nextBookId, bookData);

                response.writeHead(201, { 'Content-Type': 'Application/json' });
                response.write(JSON.stringify({ message: 'Le livre est bien été crée' }));
                return response.end();

            } catch (error) {
                response.writeHead(500, { 'Content-Type': 'Application/json' });
                response.write(JSON.stringify(
                    {
                        message: error.message
                    }
                ));
                return response.end();
            }
        }
        else {
            response.writeHead(404, { 'Content-Type': 'Application/json' });
            response.write(JSON.stringify(
                {
                    message: `Le lien '${request.url}' est invalide. Veuillez vérifier l'URL et essayer de nouveau.`
                }
            ));
            return response.end();
        }
    }
    else if (request.method === "PUT") {

        if (request.url === "/books") {
            try {
                let receivedBookData = await getRequestBody(request);

                validatingUpdateBookData(receivedBookData);

                let storedBookData = await getBookById(receivedBookData.id);

                await updateBook(storedBookData, receivedBookData);

                response.writeHead(201, { 'Content-Type': 'Application/json' });
                response.write(JSON.stringify({ message: 'Le livre est bien été modifié' }));
                return response.end();

            } catch (error) {
                response.writeHead(500, { 'Content-Type': 'Application/json' });
                response.write(JSON.stringify(
                    {
                        message: error.message
                    }
                ));
                return response.end();
            }
        }
        else {
            response.writeHead(404, { 'Content-Type': 'Application/json' });
            response.write(JSON.stringify(
                {
                    message: `Le lien '${request.url}' est invalide. Veuillez vérifier l'URL et essayer de nouveau.`
                }
            ));
            return response.end();
        }
    }
    else if (request.method === "DELETE") {
        if (request.url === "/books") {
            try {
                let bookData = await getRequestBody(request);

                validatingDeleteBookData(bookData);

                // check if book exists
                await getBookById(bookData.id);

                await deleteBook(bookData.id);

                response.writeHead(201, { 'Content-Type': 'Application/json' });
                response.write(JSON.stringify({ message: 'Le livre est bien été supprimé' }));
                return response.end();

            } catch (error) {
                response.writeHead(500, { 'Content-Type': 'Application/json' });
                response.write(JSON.stringify(
                    {
                        message: error.message
                    }
                ));
                return response.end();
            }
        }
        else {
            response.writeHead(404, { 'Content-Type': 'Application/json' });
            response.write(JSON.stringify(
                {
                    message: `Le lien '${request.url}' est invalide. Veuillez vérifier l'URL et essayer de nouveau.`
                }
            ));
            return response.end();
        }
    }
    else {
        response.statusCode = 400;
        response.end("Méthode invalide");
    }
});


server.listen(3000, '127.0.0.1', () => {
    console.log('Server running at http://127.0.0.1:3000/');
});
