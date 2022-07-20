
import React, { useState } from 'react'
import { Container, Row, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../Firebasconfig'
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Login() {


    const [email, setemail] = useState("")
    const [eemail, seteemail] = useState("")
    const [password, setpassword] = useState("")
    const [epassword, setepassword] = useState("")
    const [resetemail, setresetemail] = useState("")
    const [eresetemail, esetresetemail] = useState("")
    const [samepassword, setsamepassword] = useState("")
    const [msg, setmsg] = useState(true)

    const [loading, setloading] = useState(false)
    let navigate = useNavigate();
    const auth = getAuth();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let handlechange = (e) => {
        setemail(e.target.value)
    }

    let handlepassword = (e) => {
        setpassword(e.target.value)
    }

    let handlesubmit = (e) => {
        e.preventDefault()
        if (email == "") {
            seteemail("Pleas Enter your email")
        } else if (password == "") {
            setepassword("Pleas give your Password")
        } else {
            setloading(true)

            signInWithEmailAndPassword(auth, email, password)
                .then((user) => {
                    console.log(user)
                    setemail("")
                    setepassword("")
                    setloading(false)
                    navigate("/", { state: "Welcome to golpoadda" });

                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode)

                });
        }
    }

    const { state } = useLocation();

    const notify = () => toast(state);
    const notify2 = () => toast("Pleas checkque your email");

    if (msg) {
        if (state) {
            notify()
            setmsg(false)
        }

    }
    let handlere = (e) => {
        setresetemail(e.target.value)
    }
    let handlereset = () => {
        if (resetemail == "") {
            eresetemail("pleas give an email")
        } else {
            sendPasswordResetEmail(auth, resetemail)
                .then(() => {
                    setShow(false)
                    notify2()
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode)
                    if (errorCode.includes("wrong-password")) {
                        setsamepassword("Email already taken")
                    }
                });
        }

    }

    return (
        <Container>
            <Row>

                <ToastContainer />

                <Alert variant="primary" className='text-center mt-3 hed'>
                    Login Here
                </Alert>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={handlechange} value={email} />

                        {
                            eemail
                                ?
                                <Form.Text className="text-muted err">
                                    {eemail}
                                </Form.Text>
                                :
                                ""
                        }

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={handlepassword} value={password} />
                        {
                            epassword
                                ?
                                <Form.Text className="text-muted err">
                                    {epassword}
                                </Form.Text>
                                :
                                ""
                        }
                    </Form.Group>

                    <Button variant="primary" type="submit" className='w-100' onClick={handlesubmit}>
                        {
                            loading
                                ?
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                                :
                                "Login"
                        }
                        {
                            samepassword
                                ?
                                <Alert variant="primary" className='text-center mt-3 hed'>
                                    {samepassword}
                                </Alert>
                                :
                                ""
                        }
                    </Button>
                    <div className='text-center mt-3'>
                        <Form.Text className="text-muted mt-3">
                            Alredy dont have an account pleas <Link to="/Registration">Registration</Link>
                        </Form.Text>
                    </div>

                    <div className='text-center mt-3'>
                        <Form.Text className="text-muted mt-3">Forget password?
                            <Button variant="danger" onClick={handleShow} size="sm">
                                Reset password
                            </Button>


                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Reset Password</Modal.Title>
                                </Modal.Header>
                                <Modal.Body> <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" onChange={handlere} />

                                </Form.Group>
                                    {resetemail}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={handlereset}>
                                        Reset
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Form.Text>
                    </div>
                </Form>
            </Row>
        </Container>
    )
}

export default Login