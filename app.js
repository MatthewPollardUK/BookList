// Book Class: Represents a book
class Book {
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handle UI tasks - add and remove books from list
class UI {
  static displayBooks(){

    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));

  } //close displayBooks
  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
       <td>${book.title} </td>
       <td>${book.author} </td>
       <td>${book.isbn} </td>
       <td><a href="#" class="btn bt-danger btn-sm delete">X</a> </td>
    `;
    list.appendChild(row);

      }

      static deleteBook(el){
        if(el.classList.contains('delete')){
          el.parentElement.parentElement.remove();

        }
      }

       static showAlert(message, className){
         const div = document.createElement('div');
         div.className = `alert alert-${className}`;
         div.appendChild(document.createTextNode(message));
         const container = document.querySelector('.container');
         const form = document.querySelector('#book-form');
         container.insertBefore(div, form);
         //Vanish in 3 seconds
         setTimeout(() => document.querySelector('.alert').remove(), 3000);
       }

      static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
      }
} //close UI class

//Store class: Handles storage
class Store {
  static getBooks(){
     let books;
     if(localStorage.getItem('books') === null){
       books = [];
     } else {
       books = JSON.parse(localStorage.getItem('books'));
     }
     return books;
  }

  static addBook(book){
   const books = Store.getBooks();

   books.push(book);

   localStorage.setItem('books', JSON.stringify(books));

 }
  static removeBook(isbn){
  //  console.log(typeof isbn)
    const books = Store.getBooks();

    books.forEach((book, index) => {
       if(book.isbn === isbn){
    books.splice(index, 1);
    } 
  //  console.log(`isbn passed in <b>${isbn}</b> indv book <b>${book.isbn}</b>`)

      });
    localStorage.setItem('books', JSON.stringify(books));
 }
}

//Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a book
document.querySelector('#book-form').addEventListener('submit',(e) => {
 //prevent actual submit
  e.preventDefault();
  // Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;


 //Validate
 if(title === '' || author === '' || isbn === ''){
  UI.showAlert('Please fill in all fields', 'danger');
 } else {
   //Instatiate book
  const book = new Book(title, author, isbn);

 //Add book to UI
  UI.addBookToList(book);

  // Add book to store
  Store.addBook(book);

  //show success message
  UI.showAlert('Book Added', 'success');

 //clear fields
  UI.clearFields();

 }



});

//Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {

// remove book from UI
  UI.deleteBook(e.target);

  // show delete message
  UI.showAlert('Book Removed', 'success');

//Remove from storage
const isbn =  e.target.parentElement.previousElementSibling.textContent;
const trimIsbn = isbn.trim();
Store.removeBook(trimIsbn);


});
