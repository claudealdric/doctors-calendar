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
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDoctor) {
        const { data: appointments } = await axios.get<Appointment[]>(
          `${apiBaseUrl}/doctors/appointments`,
          {
            params: { doctorId: selectedDoctor.id, dateTime: dateFilter },
          }
        );
        setAppointments(appointments);
      }
    };
    fetchData();
  }, [dateFilter, selectedDoctor]);

  const deleteAppointment = async (id: number) => {
    await axios.delete(`${apiBaseUrl}/doctors/appointments/${id}`);
    setAppointments(
      [...appointments].filter((appointment) => appointment.id !== id)
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <nav
          id="sidebar"
          className="col-md-2 d-none d-md-block bg-light sidebar pt-3"
        >
          <div className="sidebar-sticky">
            <ul className="nav flex-column">
              <p className="uppercase bold">Physicians</p>
              {doctors.map((doctor) => (
                <li key={doctor.id} className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    onClick={() => setSelectedDoctor(doctor)}
                  >{`${doctor.lastName}, ${doctor.firstName}`}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <Button variant="primary">Log Out</Button>
          </div>
        </nav>

        <main className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          <h1>
            {selectedDoctor &&
              `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
          </h1>
          <p>{selectedDoctor?.email}</p>
          <Form.Control
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
          />

          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Time</th>
                <th>Kind</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={appointment.id}>
                  <td>{index + 1}</td>
                  <td>{`${appointment.patientFirstName} ${appointment.patientLastName}`}</td>
                  <td>{new Date(appointment.dateTime).toLocaleTimeString()}</td>
                  <td>{appointment.appointmentKind.description}</td>
                  <td className="text-center">
                    <a
                      href="#"
                      onClick={() => deleteAppointment(appointment.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-x-lg"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                        />
                        <path
                          fillRule="evenodd"
                          d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
                        />
                      </svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </main>
      </div>
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
