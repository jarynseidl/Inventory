// Item class represents and item. Name and count

class Item {
  constructor(itemName, itemCount) {
    this.itemName = itemName;
    this.itemCount = itemCount;
  }
}
//UI class to handle UI tasks.

class UI {
  static displayItems() {
    const items = Store.getItems();

    items.forEach(item => UI.addItemToList(item));
  }

  static addItemToList(item) {
    const list = document.querySelector('#item-list');

    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${item.itemName}</td>
        <td>${item.itemCount}</td>`;

    if (item.itemCount == 0) {
      row.innerHTML =
        row.innerHTML +
        `
            <td><a href="#" class="btn btn-sm increment">+</a><a href="#" class="btn btn-sm decrement" disabled>-</a></td>
            <td><a href="#" class="btn btn-sm btn-danger delete">X</a></td>
            `;
    } else {
      row.innerHTML =
        row.innerHTML +
        `
            <td><a href="#" class="btn btn-sm increment">+</a><a href="#" class="btn btn-sm decrement">-</a></td>
            <td><a href="#" class="btn btn-sm btn-danger delete">X</a></td>
            `;
    }
    list.appendChild(row);
  }

  static deleteItem(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static incrementCount(el) {
    el.parentElement.previousElementSibling.innerHTML =
      parseInt(el.parentElement.previousElementSibling.innerHTML) + 1;
  }

  static decrementCount(el) {
    if (parseInt(el.parentElement.previousElementSibling.innerHTML) > 0) {
      el.parentElement.previousElementSibling.innerHTML =
        parseInt(el.parentElement.previousElementSibling.innerHTML) - 1;
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#item-form');
    container.insertBefore(div, form);
    //Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#itemName').value = '';
    document.querySelector('#itemCount').value = '';
  }
}

// Store class for persistence

class Store {
  static getItems() {
    let items;
    if (localStorage.getItem('items') === null) {
      items = [];
    } else {
      items = JSON.parse(localStorage.getItem('items'));
    }
    return items;
  }

  static addItem(item) {
    let items = Store.getItems();
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
  }

  static removeItem(itemName) {
    const items = Store.getItems();
    items.forEach((item, index) => {
      if (item.itemName === itemName) {
        items.splice(index, 1);
      }
    });

    localStorage.setItem('items', JSON.stringify(items));
  }

  static incrementCount(itemName) {
    const items = Store.getItems();
    items.forEach(item => {
      if (item.itemName == itemName) {
        item.itemCount++;
      }
    });

    localStorage.setItem('items', JSON.stringify(items));
  }

  static decrementCount(itemName) {
    const items = Store.getItems();
    items.forEach(item => {
      if (item.itemName == itemName && item.itemCount > 0) {
        item.itemCount--;
      }
    });

    localStorage.setItem('items', JSON.stringify(items));
  }
}

//Event: Display items
document.addEventListener('DOMContentLoaded', UI.displayItems);

//Event: Add an item
document.querySelector('#item-form').addEventListener('submit', e => {
  // prevent actual submit
  e.preventDefault();
  // get form values
  const itemName = document.querySelector('#itemName').value;
  const itemCount = document.querySelector('#itemCount').value;

  // Validate
  if (itemName == '' || itemCount == '' || isNaN(itemCount)) {
    // Show an error message
    UI.showAlert('Name and count required', 'danger');
  } else {
    const newItem = new Item(itemName, itemCount);

    //Add item to item list
    UI.addItemToList(newItem);

    //Add item to store
    Store.addItem(newItem);

    // Show a success message
    UI.showAlert('Item Added', 'success');

    // Clear fields
    UI.clearFields();
  }
});

//Event: Remove an item
document.querySelector('#item-list').addEventListener('click', e => {
  if (e.target.classList.contains('delete')) {
    // Remove book from UI
    UI.deleteItem(e.target);

    // Remove book from store
    Store.removeItem(
      e.target.parentElement.previousElementSibling.previousElementSibling
        .previousElementSibling.textContent
    );

    UI.showAlert('Item Removed', 'success');
  }
});
//Event: Increase count of item

document.querySelector('#item-list').addEventListener('click', e => {
  if (e.target.classList.contains('increment')) {
    // Increment store
    Store.incrementCount(
      e.target.parentElement.previousElementSibling.previousElementSibling
        .textContent
    );

    // Increment UI
    UI.incrementCount(e.target);
  }
});

//Event: Decrease count of item
document.querySelector('#item-list').addEventListener('click', e => {
  if (e.target.classList.contains('decrement')) {
    // Increment store
    Store.decrementCount(
      e.target.parentElement.previousElementSibling.previousElementSibling
        .textContent
    );

    // Increment UI
    UI.decrementCount(e.target);
  }
});
