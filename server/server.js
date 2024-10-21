const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const {Pool}=require('pg');

const app=express();
const port=3001;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'crud_db',
    password: 'root',
    port: 5432,
});

// Check database connection
pool.connect()
    .then(() => {
        console.log('Database connected successfully!');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

    app.listen(port, () => {
        console.log(`Server running on url http://localhost:${port}`);
    });
    


app.get("/api/students", async (req, res) => {
    const sql = "SELECT * FROM students";

    try {
        const result = await pool.query(sql);
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Error retrieving students');
    }
});


app.post("/api/student/add",async (req,res)=>{
    let details={
        stname:req.body.stname,
        course:req.body.course,
        fee:req.body.fee,
    }

    const sql = "INSERT INTO students (stname, course, fee) VALUES ($1, $2, $3)";

    try {
        await pool.query(sql, [details.stname, details.course, details.fee]);
        res.send({ status: true, message: "Student created successfully!" });
    } catch (error) {
        console.error(error);
        res.send({ status: false, message: "Student creation failed!" });
    }
});

app.put("/api/student/update/:id", async (req, res) => {
    const studentId = req.params.id;
    const { stname, course, fee } = req.body;

    const sql = "UPDATE students SET stname = $1, course = $2, fee = $3 WHERE id = $4";

    try {
        const result = await pool.query(sql, [stname, course, fee, studentId]);
        
        if (result.rowCount > 0) {
            res.send({ status: true, message: "Student updated successfully!" });
        } else {
            res.status(404).send({ status: false, message: "Student not found!" });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send({ status: false, message: "Student update failed!" });
    }
});

app.delete("/api/student/delete/:id", async (req, res) => {
    const studentId = req.params.id;

    const sql = "DELETE FROM students WHERE id = $1";

    try {
        const result = await pool.query(sql, [studentId]);

        if (result.rowCount > 0) {
            res.send({ status: true, message: "Student deleted successfully!" });
        } else {
            res.status(404).send({ status: false, message: "Student not found!" });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send({ status: false, message: "Student deletion failed!" });
    }
});