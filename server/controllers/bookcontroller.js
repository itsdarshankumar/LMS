const db = require("../../database.js", { root: "." });
const { use } = require("bcrypt/promises");
const express = require("express");
const res = require("express/lib/response");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//books views
exports.book = (req, res) => {
  console.log("view requested");
  db.query("SELECT * FROM books WHERE avail = 1", (err, rows) => {
    if (!err) {
      if (rows[0] === undefined) {
        res.send("Sorry no books in library");
      } else {
        res.send(rows.bookname);
      }
    } else {
      console.log(err);
    }
  });
};

//book checkout
exports.booksubmit = (req, res) => {
  console.log("checkout posted");
  const { bookid, username } = req.body;
  db.query(
    "SELECT * FROM books WHERE bookid=" + db.escape(bookid) + " AND avail=1",
    (err, rows) => {
      if (!err) {
        if (rows[0] === undefined) {
          res.send("book unavailiable for checkout");
        } else {
          db.query(
            "SELECT * FROM requests WHERE username=" +
              db.escape(username) +
              " AND returned = 0 AND bookid=" +
              db.escape(bookid),
            (err, rows) => {
              if (!err) {
                if (rows[0] === undefined) {
                  db.query(
                    "INSERT INTO requests(bookid,username,status,returned) VALUES(" +
                      db.escape(bookid) +
                      db.escape(username) +
                      ",2,2)",
                    (err, rows) => {
                      if (!err) {
                        res.send("checkout done, waiting for approval!");
                      } else {
                        console.log(err);
                      }
                    }
                  );
                } else {
                  res.send("you already have this book");
                }
              }
            }
          );
        }
      } else {
        console.log(err);
      }
    }
  );
};

//book approval render
exports.bookapprovalrender = (req, res) => {
  console.log("admin request");
  db.query("SELECT * FROM requests WHERE status=2 OR status=0", (err, rows) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
};
//book approval protocol
exports.bookresolve = (req, res) => {
  const { id, status } = req.body;
  if (status === 1) {
    let book_name = bookname(id);
    let prevnumber = selectbooknumber(book_name);
    let number = prevnumber - 1;
    updatenumber(book_name, number);
  }
  db.query(
    "UPDATE TABLE requests SET status=" +
      db.escape(status) +
      ",resolveby=" +
      db.escape(req.session.userinfo) +
      ",returned=0" +
      " WHERE id=" +
      db.escape(id)
  );
};
//past all resolved
exports.pastresolve = (req, res) => {
  db.query(
    "SELECT * FROM requests WHERE status != 2 ORDER BY id DESC",
    (err, rows) => {
      if (!err) {
        console.log(rows);
      } else {
        console.log(err);
      }
    }
  );
};
//past user resolved
exports.userresolved = (req, res) => {
  const { username } = req.body;
  db.query(
    "SELECT * FROM requests WHERE username=" +
      db.escape(username) +
      "ORDER BY id DESC",
    (err, rows) => {
      if (!err) {
        console.log(rows);
      } else {
        console.log(err);
      }
    }
  );
};
//add books
exports.addbook = (req, res) => {
  const { bookname, number } = req.body;
  db.query(
    "SELECT * FROM books WHERE bookname=" + db.escape(bookname),
    (err, rows) => {
      if (err) throw err;
      if (rows[0] === undefined) {
        db.query(
          "INSERT INTO books (bookname,number) VALUES(" +
            db.escape(bookname) +
            "," +
            db.escape(number) +
            ")",
          (err, rows) => {
            if (!err) {
              res.send("book added");
            } else {
              console.log(err);
            }
          }
        );
      } else {
        number = number + rows[0].number;
        db.query(
          "UPDATE TABLE books SET number=" +
            db.escape(number) +
            "WHERE bookname=" +
            db.escape(bookname),
          (err, rows) => {
            if (err) throw err;
            console.log("updated number of an existing books");
          }
        );
      }
    }
  );
};
//update book
exports.updatebooks = (req, res) => {
  const { bookname } = req.body;
  db.query(
    "UPDATE TABLE books SET avail=" +
      db.escape(avail) +
      " WHERE bookname=" +
      db.escape(bookname),
    (err, rows) => {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
    }
  );
};

//Auto algos
const selectbooknumber = (bookname) => {
  db.query(
    "SELECT * FROM books WHERE bookname=" + db.escape(bookname),
    (err, rows) => {
      if (err) throw err;
      return rows[0].number;
    }
  );
};

const updatenumber = (bookname, number) => {
  db.query(
    "UPDATE TABLE books SET number=" +
      db.escape(number) +
      "WHERE bookname=" +
      db.escape(bookname),
    (err, rows) => {
      if (err) throw err;
      console.log("booknumber updated");
    }
  );
};

const bookname = (id) => {
  db.query("SELECT * FROM requests WHERE id=" + db.escape(id), (err, rows) => {
    if (err) throw err;
    return rows[0].bookname;
  });
};
