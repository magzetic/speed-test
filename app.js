let db;

// Initialize SQL.js and load the database
window.onload = async () => {
  const SQL = await window.initSqlJs({
    locateFile: (filename) =>
      `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/${filename}`,
  });

  // Check if the contacts.sqlite file exists
  let response;
  try {
    response = await fetch('contacts.sqlite');
    if (!response.ok) throw new Error('Database file not found');
    const buffer = await response.arrayBuffer();
    db = new SQL.Database(new Uint8Array(buffer));
  } catch (error) {
    console.error('Loading database failed, creating a new one', error);
    db = new SQL.Database();
    db.run(`
            CREATE TABLE contacts (
                Name TEXT PRIMARY KEY,
                MobileNumber TEXT,
                Task TEXT,
                Amount REAL,
                DeadlineDate TEXT,
                Remark1 TEXT,
                Remark2 TEXT,
                Remark3 TEXT,
                Village TEXT
            );
        `);
  }

  // Display existing contacts
  displayContacts();
};

// Add a new contact
document
  .getElementById('contact-form')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const task = document.getElementById('task').value;
    const amount = document.getElementById('amount').value;
    const deadline = document.getElementById('deadline').value;
    const remark1 = document.getElementById('remark1').value;
    const remark2 = document.getElementById('remark2').value;
    const remark3 = document.getElementById('remark3').value;
    const village = document.getElementById('village').value;

    // Insert the new contact into the database
    const insertQuery = `
        INSERT INTO contacts (Name, MobileNumber, Task, Amount, DeadlineDate, Remark1, Remark2, Remark3, Village)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(insertQuery, [
      name,
      mobile,
      task,
      amount,
      deadline,
      remark1,
      remark2,
      remark3,
      village,
    ]);

    // Clear the form
    document.getElementById('contact-form').reset();

    // Refresh the displayed contacts
    displayContacts();
  });

// Display all contacts in the table
function displayContacts() {
  const query = 'SELECT * FROM contacts';
  const result = db.exec(query);
  const tableBody = document
    .getElementById('contacts-table')
    .getElementsByTagName('tbody')[0];

  // Clear the existing rows
  tableBody.innerHTML = '';

  // Populate the table with the results
  if (result.length > 0) {
    for (let row of result[0].values) {
      const newRow = tableBody.insertRow();

      row.forEach((cell) => {
        const newCell = newRow.insertCell();
        newCell.textContent = cell;
      });

      // Add action buttons
      const actionsCell = newRow.insertCell();
      actionsCell.classList.add('actions');
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.className = 'edit-button';
      actionsCell.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete-button';
      actionsCell.appendChild(deleteButton);

      // Event listeners for edit and delete buttons
      editButton.addEventListener('click', () => editContact(row));
      deleteButton.addEventListener('click', () => deleteContact(row[0])); // Assuming the first column is the unique identifier (e.g., Name)
    }
  }
}

// Edit contact functionality
function editContact(contact) {
  // Populate the form fields with the existing contact data
  document.getElementById('name').value = contact[0]; // Name
  document.getElementById('mobile').value = contact[1]; // Mobile Number
  document.getElementById('task').value = contact[2]; // Task
  document.getElementById('amount').value = contact[3]; // Amount
  document.getElementById('deadline').value = contact[4]; // Deadline Date
  document.getElementById('remark1').value = contact[5]; // Remark1
  document.getElementById('remark2').value = contact[6]; // Remark2
  document.getElementById('remark3').value = contact[7]; // Remark3
  document.getElementById('village').value = contact[8]; // Village
}

// Delete contact functionality
function deleteContact(name) {
  const deleteQuery = `DELETE FROM contacts WHERE Name = ?`;
  db.run(deleteQuery, [name]);

  // Refresh the displayed contacts
  displayContacts();
}
