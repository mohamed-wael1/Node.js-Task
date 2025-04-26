const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://Admin:11223344@cluster0.clmfh7z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Database connection error:", err));

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  level: String,
  address: String,
});

const doctorSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String,
});

const Student = mongoose.model("Student", studentSchema);
const Doctor = mongoose.model("Doctor", doctorSchema);

app.get("/add-student-hardcoded", async (req, res) => {
  const student = new Student({
    name: "Mohamed",
    age: 20,
    level: "2rd year",
    address: "Port Said",
  });

  await student.save();
  res.send("Hardcoded student has been saved");
});

app.post("/add-student", async (req, res) => {
  const { name, age, level, address } = req.body;
  const student = new Student({ name, age, level, address });
  await student.save();
  res.send("Student from request body has been saved");
});

app.get("/add-doctor", async (req, res) => {
  const { name, age, phone } = req.query;
  const doctor = new Doctor({ name, age, phone });
  await doctor.save();
  res.send("Doctor has been saved from query parameters");
});

app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.delete("/delete-student/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.send("Student has been deleted");
});

app.put("/update-doctor-name", async (req, res) => {
  const { oldName, newName } = req.query;
  const doctor = await Doctor.findOneAndUpdate(
    { name: oldName },
    { name: newName }
  );
  if (doctor) {
    res.send("Doctor's name has been updated");
  } else {
    res.send("Doctor with the given name was not found");
  }
});

app.get("/all", async (req, res) => {
  const students = await Student.find();
  const doctors = await Doctor.find();
  res.json({ students, doctors });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
