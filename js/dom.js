const UNCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

function makeBook(title, author, year, isCompleted) {

    const textTitle = document.createElement("h3");
    textTitle.innerText = title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = author;

    const textYear = document.createElement("p");
    textYear.classList.add("year");
    textYear.innerText = year;

    const textContainer = document.createElement("article");
    textContainer.classList.add("book_item")
    textContainer.append(textTitle, textAuthor, textYear);
    
    if(isCompleted) {
        textContainer.append(
            createNotFinishButton(),
            createDeleteButton()
        );  
    } else {
        textContainer.append(
            createFinishButton(),
            createDeleteButton() 
        );
    }
    return textContainer;
}

function createNotFinishButton() {
    return createButton("incompleted", function(event){
        undoTaskFromCompleted(event.target.parentElement);
    });
}

function createFinishButton() {
    return createButton("completed", function(event){
        addTaskToCompleted(event.target.parentElement);
    });
}

function createDeleteButton() {
    return createButton("deleted", function(event){
        removeTaskFromCompleted(event.target.parentElement);
    });
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);

    button.addEventListener("click", function (event) {
        eventListener(event);
    });

    return button;
}

function addBook() {
    const uncompletedBOOKList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const completedBOOKList = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = "Author: " + document.getElementById("inputBookAuthor").value;
    const bookYear = "Year: " + document.getElementById("inputBookYear").value;
    const readed = document.getElementById("inputBookIsComplete").checked;
    const book = makeBook(bookTitle, bookAuthor, bookYear, readed);
    const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, readed);
  
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    if (readed) {
        completedBOOKList.append(book);
    } else {
        uncompletedBOOKList.append(book);
    }
    updateDataToStorage();
}

function addTaskToCompleted(taskElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const taskTitle = taskElement.querySelector(".book_item > h3").innerText;
    const taskAuthor = taskElement.querySelector(".book_item > p").innerText;
    const taskYear = taskElement.querySelector(".year").innerText;
    const newBook = makeBook(taskTitle, taskAuthor, taskYear, true);
    
    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = true;

    newBook[BOOK_ITEMID] = book.id;
    listCompleted.append(newBook);
    taskElement.remove();
    updateDataToStorage();
}

function removeTaskFromCompleted(taskElement) {
    /*let confirmDelete = confirm("Sure to deleted book?");
    const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    if (confirmDelete == true) {
        taskElement.remove();
    } else {
        return false;
    }
    updateDataToStorage();*/
    const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
            taskElement.remove();
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })
    updateDataToStorage();
}

function undoTaskFromCompleted(taskElement){
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const taskTitle = taskElement.querySelector(".book_item > h3").innerText;
    const taskAuthor = taskElement.querySelector(".book_item > p").innerText;
    const taskYear = taskElement.querySelector(".year").innerText;

    const newBook = makeBook(taskTitle, taskAuthor, taskYear, false);
    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    listUncompleted.append(newBook);
    taskElement.remove();
    updateDataToStorage();
}

function bookSearch(keyword) {
    const filter = keyword.toUpperCase();
    const titlebooks = document.getElementsByTagName("h3");

    for (let i = 0; i < titlebooks.length; i++) {
        const titleText = titlebooks[i].textContent || titlebooks[i].innerText;

        if (titleText.toUpperCase().includes(filter)) {
            titlebooks[i].closest(".book_item").style.display = "";
        } else {
            titlebooks[i].closest(".book_item").style.display = "none";
        }
    }
}