const fs = require('node:fs/promises');
const { getBooksData } = require('./get-books');

module.exports.validatingDeleteBookData = (bookData) => {

    if (!Object.keys(bookData).includes('id') || Object.keys(bookData).length > 1) {
        throw new Error("Erreur de validation : Seul l'ID du livre doit être fourni pour la suppression.");
    }
}

module.exports.deleteBook = async (bookId) => {

    let booksData = await getBooksData();

    let booksInformationsLines = [];

    for (let bookData of booksData) {

        if (bookData.id != bookId) {

            let bookInformationsLine = '';

            if (booksInformationsLines.length === 0) {
                bookInformationsLine = `id = ${bookData.id} #///# `;
            }
            else {
                bookInformationsLine = `\r\nid = ${bookData.id} #///# `;
            }
    
            let booksFields = ['title', 'author', 'language', 'publicationDate', 'themes', 'takenBy'];

            for (let field of booksFields) {
                bookInformationsLine += `${field} = ${bookData[field]} #///# `
            }

            bookInformationsLine = bookInformationsLine.slice(0, -7);

            booksInformationsLines.push(bookInformationsLine);
        }
    }

    try {
        await fs.writeFile('./data/books.txt', booksInformationsLines);
    } catch (error) {
        throw new Error("Erreur interne du serveur");
    }
}