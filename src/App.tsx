import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Table from "react-bootstrap/esm/Table";
import "./App.css";

function getTodaysDateString(): string {
  const date = new Date();
  date.setHours(0, -date.getTimezoneOffset(), 0, 0);
  return date.toISOString().slice(0, 10);
}

function App() {
  const apiBaseUrl = "https://rest-api-487f.onrender.com";
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>();
  const [dateFilter, setDateFilter] = useState<string>(getTodaysDateString());
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: doctors } = await axios.get<Doctor[]>(
        `${apiBaseUrl}/doctors`
      );
      setDoctors(doctors);

      const firstDoctor = doctors[0];
      setSelectedDoctor(firstDoctor);

      const { data: appointments } = await axios.get<Appointment[]>(
        `${apiBaseUrl}/doctors/appointments`,
        {
          params: { doctorId: firstDoctor.id, dateTime: dateFilter },
        }
      );
      setAppointments(appointments);
    };

    fetchData();
  }, [dateFilter]);

  return (
    <div className="App">
      <nav>
        <p className="uppercase">Physicians</p>

        <ul>
          {doctors.map((doctor) => (
            <li key={doctor.id}>{`${doctor.lastName}, ${doctor.firstName}`}</li>
          ))}
        </ul>

        <Button variant="primary">Log Out</Button>
      </nav>

      <main>
        <h1>
          {selectedDoctor &&
            `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
        </h1>
        <p>{selectedDoctor?.email}</p>
        <Form>
          <Form.Group>
            <Form.Control
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            />
          </Form.Group>
        </Form>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Time</th>
              <th>Kind</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{`${appointment.patientFirstName} ${appointment.patientLastName}`}</td>
                <td>{new Date(appointment.dateTime).toLocaleTimeString()}</td>
                <td>{appointment.appointmentKind.description}</td>
                <td>x</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </main>
    </div>
  );
}

export default App;

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Appointment {
  id: number;
  dateTime: string;
  patientFirstName: string;
  patientLastName: string;
  appointmentKind: { description: string };
}
