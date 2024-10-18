// Wait for the page to load and initialize the database
window.onload = async () => {
    let db;  // To hold the database instance

    // Initialize SQL.js
    const SQL = await window.initSqlJs({ 
        locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/${filename}` 
    });

    try {
        // Try to fetch the contacts.sqlite file
        const response = await fetch('contacts.sqlite');
        if (!response.ok) throw new Error("Database file not found");

        // Load the file into SQL.js
        const buffer = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(buffer));
        console.log("Database loaded successfully.");
    } catch (error) {
        console.error("Loading database failed, creating a new one", error);
        // Create a new empty database in memory
        db = new SQL.Database();  

        // Create the contacts table
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

    // Function to display contacts on the page
    function displayContacts() {
        const res = db.exec("SELECT * FROM contacts");
        const contactsTable = document.getElementById("contactsTable");
        contactsTable.innerHTML = ""; // Clear the existing table rows

        if (res.length > 0) {
            res[0].values.forEach((row) => {
                const tr = document.createElement("tr");
                row.forEach((col) => {
                    const td = document.createElement("td");
                    td.textContent = col;
                    tr.appendChild(td);
                });
                contactsTable.appendChild(tr);
            });
        } else {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 9;
            td.textContent = "No contacts found.";
            tr.appendChild(td);
            contactsTable.appendChild(tr);
        }
    }

    // Call displayContacts on page load
    displayContacts();

    // Handle form submissions for adding a new contact
    document.getElementById("addContactForm").addEventListener("submit", (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById("name").value;
        const mobile = document.getElementById("mobile").value;
        const task = document.getElementById("task").value;
        const amount = document.getElementById("amount").value;
        const deadlineDate = document.getElementById("deadlineDate").value;
        const remark1 = document.getElementById("remark1").value;
        const remark2 = document.getElementById("remark2").value;
        const remark3 = document.getElementById("remark3").value;
        const village = document.getElementById("village").value;

        // Insert the new contact into the database
        try {
            db.run(`
                INSERT INTO contacts (Name, MobileNumber, Task, Amount, DeadlineDate, Remark1, Remark2, Remark3, Village)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [name, mobile, task, amount, deadlineDate, remark1, remark2, remark3, village]);
        } catch (error) {
            console.error("Error inserting contact:", error);
        }

        // Clear form fields
        document.getElementById("addContactForm").reset();

        // Refresh the contact list
        displayContacts();
    });

    // Function to manage existing contacts (future implementation)
    // You can add features here for editing, deleting, or filtering contacts
};
