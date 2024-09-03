const fs = require('node:fs/promises');

module.exports.getBooksData = async () => {

    try {
        let fileContent = await fs.readFile('./data/books.txt', 'utf8');

        let finalResponse = [];

        let booksInformationsLines = fileContent.split('\r\n');

        for (let bookInformationsLine of booksInformationsLines) {
            let bookInformationsArray = bookInformationsLine.split(' #///# ');

            let bookInformationsObject = {};

            for (let bookInformation of bookInformationsArray) {
                let informationKey = bookInformation.split(' = ')[0];

                let informationValue = bookInformation.split(' = ')[1];

                bookInformationsObject[informationKey] = informationValue;
            }

            finalResponse.push(bookInformationsObject);
        }

        return finalResponse;

    } catch (error) {
        throw new Error("Erreur interne du serveur");
    }
}