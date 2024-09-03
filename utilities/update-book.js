const fs = require('node:fs/promises');
const { getBooksData } = require('./get-books');
const { isBookFileEmpty } = require('./common');

module.exports.validatingUpdateBookData = (bookData) => {
    let allowedFields = ['id', 'title', 'author', 'language', 'publicationDate', 'themes', 'takenBy'];

    if (!Object.keys(bookData).includes('id')) {
        throw new Error('Le champ id est obligatoire dans la mis à jour.');
    }

    for (let field in bookData) {
        if (!allowedFields.includes(field)) {
            throw new Error(`Attention : Le champ '${field}' n'est pas valide.`);
        }
    }

}

module.exports.updateBook = async (storedBookData, receivedBookData) => {

    let booksData = await getBooksData();

    let booksInformationsLines = [];

    for (let bookData of booksData) {

        let bookInformationsLine = '';

        if (booksInformationsLines.length === 0) {
            bookInformationsLine = `id = ${bookData.id} #///# `;
        }
        else {
            bookInformationsLine = `\r\nid = ${bookData.id} #///# `;
        }

        let booksFields = ['title', 'author', 'language', 'publicationDate', 'themes', 'takenBy'];

        if (bookData.id != receivedBookData.id) {

            for (let field of booksFields) {
                bookInformationsLine += `${field} = ${bookData[field]} #///# `
            }
        }
        else {

            for (let field of booksFields) {
                if (Object.keys(receivedBookData).includes(field)) {
                    bookInformationsLine += `${field} = ${receivedBookData[field]} #///# `;
                }
                else {
                    bookInformationsLine += `${field} = ${storedBookData[field]} #///# `;
                }
            }
        }

        bookInformationsLine = bookInformationsLine.slice(0, -7);

        booksInformationsLines.push(bookInformationsLine);
    }

    try {
        await fs.writeFile('./data/books.txt', booksInformationsLines);
    } catch (error) {
        throw new Error("Erreur interne du serveur");
    }
}