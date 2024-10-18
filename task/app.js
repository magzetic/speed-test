window.onload = async () => {
    const SQL = await window.initSqlJs({ locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/${filename}` });

    try {
        const response = await fetch('contacts.sqlite');
        if (!response.ok) throw new Error("Database file not found");
        const buffer = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(buffer));
        console.log("Database loaded successfully.");
    } catch (error) {
        console.error("Loading database failed, creating a new one", error);
        db = new SQL.Database();  // Create an empty database

        // Create the table in the newly created database
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

    displayContacts();  // Display contacts, if any
};
