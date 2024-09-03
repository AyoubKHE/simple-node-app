const fs = require('node:fs/promises');
const { isBookFileEmpty } = require('./common');

module.exports.validatingCreateBookData = (bookData) => {
    let allowedFields = ['title', 'author', 'language', 'publicationDate', 'themes', 'takenBy'];

    if (allowedFields.length !== Object.keys(bookData).length) {
        throw new Error('Certains champs requis sont manquants. Veuillez vérifier et compléter les informations nécessaires.');
    }

    for (let field in bookData) {
        if (!allowedFields.includes(field)) {
            throw new Error(`Attention : Le champ '${field}' n'est pas valide.`);
        }
    }

}

module.exports.getNextBookId = async () => {
    let nextId = -1;

    try {
        let fileContent = await fs.readFile('./data/books.txt', 'utf8')

        if (fileContent === '') {
            return 1;
        }
        else {
            let ids = [];

            let booksInformationsLines = fileContent.split('\r\n');

            for (let bookInformationsLine of booksInformationsLines) {
                let bookInformationsArray = bookInformationsLine.split(' #///# ');

                let currentId = Number.parseInt(bookInformationsArray[0].split(' = ')[1]);
                ids.push(currentId);
            }

            nextId = Math.max(...ids);

            return nextId + 1;
        }

    } catch (error) {
        throw new Error("Erreur interne du serveur");
    }
}

module.exports.createBook = async (bookId, bookData) => {

    let bookInformationsLine = '';

    try {

        if (await isBookFileEmpty()) {
            bookInformationsLine = `id = ${bookId} #///# `;
        }
        else {
            bookInformationsLine = `\r\nid = ${bookId} #///# `;
        }
    } catch (error) {
        throw error;
    }

    for (let field in bookData) {
        bookInformationsLine += `${field} = ${bookData[field]} #///# `
    }

    bookInformationsLine = bookInformationsLine.slice(0, -7);

    try {
        await fs.appendFile('./data/books.txt', bookInformationsLine);
    } catch (error) {
        throw new Error("Erreur interne du serveur");
    }
}