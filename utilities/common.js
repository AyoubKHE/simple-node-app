const fs = require('node:fs/promises');

module.exports.getRequestBody = async (request) => {

    try {
        let bookData = await new Promise((resolve, reject) => {

            const httpBodyBuffer = [];
            request.on("data", (part) => {
                httpBodyBuffer.push(part);
            });

            request.on("end", () => {
                try {
                    const bookData = JSON.parse(Buffer.concat(httpBodyBuffer).toString());
                    resolve(bookData);
                } catch (error) {
                    reject(error);
                }

            });
        })

        return bookData;
    } catch (error) {
        throw new Error("Erreur interne du serveur");
    }

}

module.exports.getBookById = async (bookId) => {
    try {
        let fileContent = await fs.readFile('./data/books.txt', 'utf8')

        if (fileContent === '') {
            throw new Error("Aucun livre n'a été trouvé dans la base de données.");
        }
        else {
            let booksInformationsLines = fileContent.split('\r\n');

            for (let bookInformationsLine of booksInformationsLines) {
                let bookInformationsArray = bookInformationsLine.split(' #///# ');

                let currentBookId = Number.parseInt(bookInformationsArray[0].split(' = ')[1]);
                if (currentBookId === bookId) {
                    let bookInformationsObject = {};

                    for (let bookInformation of bookInformationsArray) {
                        let informationKey = bookInformation.split(' = ')[0];

                        let informationValue = bookInformation.split(' = ')[1];

                        bookInformationsObject[informationKey] = informationValue;
                    }

                    return bookInformationsObject;
                }
            }

            throw new Error("Le livre est introuvable. Veuillez vérifier l'identifiant.");
        }

    } catch (error) {
        throw error;
    }
}

module.exports.isBookFileEmpty = async () => {
    try {
        let fileContent = await fs.readFile('./data/books.txt', 'utf8');

        return fileContent === '';

    } catch (error) {
        throw new Error("Erreur interne du serveur");
    }
}