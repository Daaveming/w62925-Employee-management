const mysql = require('mysql');
const Pool = require('mysql/lib/Pool');

// Creating Poll connection
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    database        : process.env.DB_NAME,
});
    

//view employees
exports.view = (req, res) => {
    
// Connection to database
    pool.getConnection((err, connection) => {
        if(err) throw err; // connection failed
        console.log('Connected as ID' + connection.threadId);

        // use connection
        connection.query(`SELECT pracownicy.id, pracownicy.nr_osobowy, pracownicy.imie, pracownicy.nazwisko, pracownicy.nr_telefonu1, pracownicy.nr_telefonu2, pracownicy.email, pracownicy.id_dzialu, pracownicy.id_stanowisko, pracownicy.data_zatrudnienia, pracownicy.data_zwolnienia, pracownicy.status, pracownicy.komentarz, stanowiska.nazwa AS stanowisko, dzialy.nazwa AS dzial FROM pracownicy JOIN stanowiska ON pracownicy.id_stanowisko = stanowiska.id JOIN dzialy ON pracownicy.id_dzialu = dzialy.id WHERE status = 'Aktywny'`, (err, rows) => {
        // when have connection, release 
        connection.release();
           
        if(!err) {
            let deletedEmployee = req.query.removed;
            res.render('home', {rows, deletedEmployee});
        } else {
            console.log(err);
        }
        console.log('Dane z tabeli pracownicy: \n', rows);
        });
    });    
}

//find employee by search
exports.find = (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err; // connection failed
        console.log('Connected as ID' + connection.threadId);

        let searchTerm = req.body.search;

        // use connection
        connection.query('SELECT * FROM pracownicy WHERE pracownicy.imie LIKE ? OR pracownicy.nazwisko LIKE ?', ['%' + searchTerm + '%','%' + searchTerm + '%'], (err, rows) => {
        // when have connection, release 
        connection.release();
           
        if(!err) {
            res.render('home', {rows});
        } else {
            console.log(err);
        }
        console.log('Dane z tabeli pracownicy: \n', rows);
        });
    }); 
}


exports.form = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err; // connection failed
        console.log('Connected as ID' + connection.threadId);
        
        connection.query('SELECT * FROM stanowiska', (err, stanowiska) => {
            if(err) throw err;
            connection.query('SELECT * FROM dzialy', (err, dzialy) => {
                if(err) throw err;
                res.render('add-employee', {stanowiska, dzialy});    
            })
        })
        connection.release();
        //console.log(stanowiska);
        
    });
    
}

// add new employee
exports.create = (req, res) => {
   const{nr_osobowy, imie, nazwisko, nr_telefonu1, nr_telefonu2, email, dzial,status, stanowisko, data_zatrudnienia, data_zwolnienia, komentarz} = req.body;
    console.log(req.body);
   pool.getConnection((err, connection) => {
    if(err) throw err; // connection failed
    console.log('Connected as ID' + connection.threadId);

    let searchTerm = req.body.search;

    // use connection
    connection.query(`INSERT INTO pracownicy SET pracownicy.nr_osobowy = ${nr_osobowy}, pracownicy.imie = '${imie}', pracownicy.nazwisko = '${nazwisko}', pracownicy.nr_telefonu1 = '${nr_telefonu1}', pracownicy.nr_telefonu2 = '${nr_telefonu2}', pracownicy.email = '${email}', pracownicy.id_dzialu = ${dzial}, pracownicy.status = '${status}', pracownicy.id_stanowisko = ${stanowisko}, data_zatrudnienia = '${data_zatrudnienia}', data_zwolnienia = '${data_zwolnienia || null}', pracownicy.komentarz = '${komentarz}'`,
    (err, rows) => {
    // when have connection, release 
    connection.release();
       
    if(!err) {
        res.render('add-employee', {alert: 'Poymyślnie dodano nowego pracownika'});
    } else {
        console.log(err);
    }
    console.log('Dane z tabeli pracownicy: \n', rows);
    });
}); 
}

// edit employee
exports.edit = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err; // connection failed
        console.log('Connected as ID' + connection.threadId);

        // use connection
        connection.query('SELECT * FROM pracownicy WHERE pracownicy.id = ?',[req.params.id], (err, rows) => {
        // when have connection, release 
        connection.release();
           
        if(!err) {
            connection.query('SELECT * FROM stanowiska', (err, stanowiska) => {
                if(err) throw err;
                connection.query('SELECT * FROM dzialy', (err, dzialy) => {
                    if(err) throw err;
                    // console.log(stanowiska)
                    res.render('edit-employee', {rows, stanowiska, dzialy});    
                })
            })
        } else {
            console.log(err);
        }
        // console.log('Dane z tabeli pracownicy: \n', rows);
        });
    });
}

// update employee

exports.update = (req, res) => {
    const {nr_osobowy, imie, nazwisko, nr_telefonu1, nr_telefonu2, email, dzial, stanowisko, status, data_zwolnienia, komentarz} = req.body;
    console.log(req.body);
    pool.getConnection((err, connection) => {
        if(err) throw err; // connection failed
        console.log('Connected as ID' + connection.threadId);

        // use connection
        connection.query('UPDATE pracownicy SET pracownicy.nr_osobowy = ?, pracownicy.imie = ?, pracownicy.nazwisko = ?, pracownicy.nr_telefonu1 = ?, pracownicy.nr_telefonu2 = ?,  pracownicy.email = ?, pracownicy.id_dzialu = ?, pracownicy.id_stanowisko = ?, pracownicy.status = ?, pracownicy.data_zwolnienia = ?, pracownicy.komentarz = ? WHERE pracownicy.id = ?',[nr_osobowy, imie, nazwisko, nr_telefonu1, nr_telefonu2, email, dzial, stanowisko, status, data_zwolnienia, komentarz, req.params.id], (err, rows) => {
        // when have connection, release 
        connection.release();
           
        if(!err) { 
            pool.getConnection((err, connection) => {
                if(err) throw err; // connection failed
                console.log('Connected as ID' + connection.threadId);
        
                // use connection
                connection.query('SELECT * FROM pracownicy WHERE pracownicy.id = ?',[req.params.id], (err, rows) => {
                // when have connection, release 
                connection.release();
                   
                if(!err) {
                    connection.query('SELECT * FROM stanowiska', (err, stanowiska) => {
                        if(err) throw err;
                        connection.query('SELECT * FROM dzialy', (err, dzialy) => {
                            if(err) throw err;
                            // console.log(stanowiska)
                            res.render('edit-employee', {rows, stanowiska, dzialy, alert:`Dane pracownika ${nazwisko} ${imie} zostały zaktualizowane.`});    
                        })
                    })
                    
                } else {
                    console.log(err);
                }
                // console.log('Dane z tabeli pracownicy: \n', rows);
                });
            })   
        } else {
            console.log(err);
        }
        // console.log('Dane z tabeli pracownicy: \n', rows);
        });
    });
}



//delete employee from database
exports.delete = (req, res) => {
//     pool.getConnection((err, connection) => {
//         if(err) throw err; // connection failed
//         console.log('Connected as ID' + connection.threadId);
        
//         connection.query('DELETE FROM employees WHERE id = ?',[req.params.id], (err, rows) => {   // get querry
//         connection.release();  // when have connection, release 
//         if(!err) {
//             res.redirect('/');
//         } else {
//             console.log(err);
//         }
//         console.log('Dane z tabeli employees: \n', rows);
//         });
//     });

        pool.getConnection((err, connection) => {
            if(err) throw err; // connection failed
            
            connection.query(`UPDATE pracownicy SET pracownicy.status = 'Usunięto' WHERE pracownicy.id = ?`,[req.params.id], (err, rows) => {   // get querry
            connection.release();  // when have connection, release 
            if(!err) {
                let deletedEmployee =  encodeURIComponent ('Pomyślnie usunięto pracownika');
                res.redirect('/?removed='+ deletedEmployee);
            } else {
                console.log(err);
            }
            console.log('Dane z tabeli pracownicys: \n', rows);
            });
        });
}

//view all employee
exports.viewall = (req, res) => {
    
    // Connection to database
        pool.getConnection((err, connection) => { 
            if(err) throw err; // connection failed
            console.log('Connected as ID' + connection.threadId);
    
            // use connection
            connection.query('SELECT * FROM pracownicy', (err, rows) => {
            // when have connection, release 
            connection.release();
               
            if(!err) {
                res.render('view-employee', {rows});
            } else {
                console.log(err);
            }
            console.log('Dane z tabeli pracownicy: \n', rows);
            });
        });    
    }


    //view single employee
exports.viewemployee = (req, res) => {
    
    // Connection to database
        pool.getConnection((err, connection) => { 
            if(err) throw err; // connection failed
            console.log('Connected as ID' + connection.threadId);
    
            // use connection
            connection.query('SELECT pracownicy.id, pracownicy.nr_osobowy, pracownicy.imie, pracownicy.nazwisko, pracownicy.nr_telefonu1, pracownicy.nr_telefonu2, pracownicy.email, pracownicy.id_dzialu, pracownicy.id_stanowisko, pracownicy.data_zatrudnienia, pracownicy.data_zwolnienia, pracownicy.status, pracownicy.komentarz, stanowiska.nazwa AS stanowisko, dzialy.nazwa AS dzial FROM pracownicy JOIN stanowiska ON pracownicy.id_stanowisko = stanowiska.id JOIN dzialy ON pracownicy.id_dzialu = dzialy.id WHERE pracownicy.id = ?',[req.params.id], (err, rows) => {
            // when have connection, release 
            connection.release();
               
            if(!err) {
                res.render('view-employee', {rows});
            } else {
                console.log(err);
            }
            console.log('Dane z tabeli pracownicy: \n', rows);
            });
        });    
    }

    //view deleted
exports.viewdeleted = (req, res) => {
    
    // Connection to database
        pool.getConnection((err, connection) => { 
            if(err) throw err; // connection failed
            console.log('Connected as ID' + connection.threadId);
    
            // use connection
            connection.query(`SELECT pracownicy.id, pracownicy.nr_osobowy, pracownicy.imie, pracownicy.nazwisko, pracownicy.nr_telefonu1, pracownicy.nr_telefonu2, pracownicy.email, pracownicy.id_dzialu, pracownicy.id_stanowisko, pracownicy.data_zatrudnienia, pracownicy.data_zwolnienia, pracownicy.status, pracownicy.komentarz, stanowiska.nazwa AS stanowisko, dzialy.nazwa AS dzial FROM pracownicy JOIN stanowiska ON pracownicy.id_stanowisko = stanowiska.id JOIN dzialy ON pracownicy.id_dzialu = dzialy.id WHERE status = 'Usunięto'`, (err, rows) => {
            // when have connection, release 
            connection.release();
               
            if(!err) {
                res.render('view-deleted', {rows});
            } else {
                console.log(err);
            }
            console.log('Dane z tabeli pracownicy: \n', rows);
            });
        });    
    }