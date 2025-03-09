const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');  
const path = require('path');

const app = express();

app.use(express.json());  
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Serve static files from the uploads directory


const pool = mysql.createPool({
    connectionLimit: 10,
    user: "root",
    host: "localhost",
    password: "Admin123",
    database: "demo",
    debug: false,
});

// Registration 
app.post('/register', async (req, res) => {
    console.log('Received registration data:', req.body);
    const { fname, lname, email, password } = req.body;

    if (!fname || !lname || !email || !password) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);  

    // Check if email already exists
    const query = 'SELECT * FROM users WHERE email = ?';
    pool.query(query, [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: 'Database error' });
        } else if (result.length > 0) {
            return res.send({ message: 'Email already exists. Use a different email address' });
        } else {

            const insertQuery = 'INSERT INTO users (fname, lname, email, password) VALUES (?, ?, ?, ?)';
            pool.query(insertQuery, [fname, lname, email, hashedPassword], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ message: 'Database error' });
                } else {
                    console.log('New user registered: ${fname} ${lname}, Email: ${email}');
                    return res.send({ message: 'ACCOUNT CREATED SUCCESSFULLY' });
                }
            });
        }
    });
});




// login 

app.post("/login", async (req, res) => {
    console.log("Received login request:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Email and password are required" });
    }

    pool.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send({ message: "Database error" });
        }

        if (result.length === 0) {
            return res.status(401).send({ message: "Wrong email or password!" });
        }

        const user = result[0];

    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Wrong email or password!" });
        }

        console.log("User logged in:", user);

        res.send({
            id: user.id,
            fname: user.fname,
            email: user.email,
            password: user.password,
        });
    });
});


// get user details

app.get("/users", (req, res) => {
    console.log(" users details")
    pool.query("SELECT * FROM users", (err, result) => {
    if (err) {
    console.log(err);
    } else {
    res.send(result);
    }
    });
    });

      //delete  id

  app.delete("/del/:id", (req, res) => {
    console.log("deleted the id sucessfully", req.body)
      const id = req.params.id;
      pool.query("DELETE FROM users WHERE id = ?", id, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      });
    });


    //get single user details

    app.get("/person/:id", (req, res) => {
        console.log("get single user details");
        const userId = req.params.id;
        pool.query("SELECT * FROM users WHERE id = ?", [userId], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result[0]);
            }
        });
    });


    // Update user details
    app.put("/users/:id", (req, res) => {
        console.log("Updating user details:", req.body);
        const userId = req.params.id;
        const { fname, lname, email } = req.body;

        if (!fname || !lname || !email) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const updateQuery = "UPDATE users SET fname = ?, lname = ?, email = ? WHERE id = ?";
        pool.query(updateQuery, [fname, lname, email, userId], (err, result) => {
            if (err) {
                console.error("Error updating user:", err);
                return res.status(500).send({ message: "Error updating user" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).send({ message: "User not found" });
            }
            res.send({ message: "User updated successfully" });
        });
    });

    //Add new  product 
 
    const multer = require('multer');
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      // Generate a unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
  });
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  

  const fileFilter = (req, file, cb) => {

    if (
      file.mimetype.startsWith('image/') &&
      /\.(jpg|jpeg|png|gif)$/i.test(file.originalname)
    ) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only JPG, JPEG, PNG, and GIF image files are allowed.'), false); // Reject the file
    }
  };
  

  const upload = multer({ storage: storage, fileFilter: fileFilter });
  
  // Handle POST request to add a new product
  app.post('/product', upload.single('image'), (req, res) => {
    console.log("image upload sucessfull", req.body);
    const { name, price, des, model_no} = req.body;
    const image = req.file.filename;
  
    // Insert the new product into the database
    const sql = 'INSERT INTO product (name, price, image, des, model_no) VALUES (?, ?, ?, ?, ?)';
    pool.query(sql, [name, price, image, des, model_no], (err, result) => {
    if (err) {
    console.error('Error adding product: ', err);
    res.status(500).json({ error: 'Failed to add product' });
    return;
    }
    res.json({ message: 'Product added successfully',});
    });
    });



    //Get all product details

    app.get("/getproducts", (req, res) => {
        console.log("get all product details");
        pool.query("SELECT * FROM product", (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });


    // get a single product details
    
    app.get("/product/:pid", (req, res) => {
        const pid = req.params.pid;
        console.log("Fetching product with ID:", pid);
        pool.query("SELECT * FROM product WHERE pid = ?", [pid], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                res.status(500).json({ error: "Database error" });
            } else {
                if (result.length > 0) {
                    res.send(result[0]);
                } else {
                    res.status(404).json({ error: "Product not found" });
                } 
            }
        });
    });

    // Update product details
    app.put("/updateproduct/:pid", upload.single('image'), (req, res) => {
        const pid = req.params.pid;
        const { name, price, des, model_no } = req.body;
        
        console.log("Updating product:", pid, req.body);

        let sql;
        let params;

        if (req.file) {
            // If there's a new image
            sql = "UPDATE product SET name = ?, price = ?, des = ?, model_no = ?, image = ? WHERE pid = ?";
            params = [name, price, des, model_no, req.file.filename, pid];
        } else {
            // If no new image
            sql = "UPDATE product SET name = ?, price = ?, des = ?, model_no = ? WHERE pid = ?";
            params = [name, price, des, model_no, pid];
        }

        pool.query(sql, params, (err, result) => {
            if (err) {
                console.error("Error updating product:", err);
                res.status(500).json({ error: "Failed to update product" });
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).json({ error: "Product not found" });
                return;
            }
            res.json({ message: "Product updated successfully" });
        });
    });





    //delete product

    app.delete("/delete/:pid", (req, res) => {
        const pid = req.params.pid;
        pool.query("DELETE FROM product WHERE pid = ?", [pid], (err, result) => {
            if (err) {                                                                                                                      
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });

    


app.listen(3001, () => {
    console.log("Backend is successfully running");
});
