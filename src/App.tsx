import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Table from "react-bootstrap/esm/Table";
import "./App.css";

function App() {
  return (
    <div className="App">
      <nav>
        <p className="uppercase">Physicians</p>

        <ul>
          <li>Hibbert, Julius</li>
          <li>Krieger, Algernop</li>
          <li>Riviera, Nick</li>
        </ul>

        <Button variant="primary">Log Out</Button>
      </nav>

      <main>
        <h1>Dr. Algernop Krieger</h1>
        <p>krieger@notablehealth.com</p>
        <Form>
          <Form.Group>
            <Form.Control type="date" />
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
            <tr>
              <td>1</td>
              <td>Sterling Archer</td>
              <td>8:00 AM</td>
              <td>New Patient</td>
              <td>x</td>
            </tr>
          </tbody>
        </Table>
      </main>
    </div>
  );
}

export default App;
