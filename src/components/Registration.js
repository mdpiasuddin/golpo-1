import React, { useState } from 'react'
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import '../Firebasconfig'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import './registration.css'
function Registration() {
    let navigate = useNavigate();
    const [username, setusername] = useState("")
    const [eusername, seteusername] = useState("")
    const [email, setemail] = useState("")
    const [eemail, seetemail] = useState("")
    const [password, setpassword] = useState("")
    const [epassword, setepassword] = useState("")
    const [cpassword, setcpassword] = useState("")
    const [ecpassword, setecpassword] = useState("")
    const [mac, setmac] = useState("")
    const [sameemail, setsameemail] = useState("")
    const [loading, setloading] = useState(false)
    const [fill, setfill] = useState("")
    let handleusername = (e) => {
        setusername(e.target.value)
    }
    let handleemail = (e) => {
        setemail(e.target.value)
    }
    let handlepassword = (e) => {
        setpassword(e.target.value)
    }
    let handlecpassword = (e) => {
        setcpassword(e.target.value)
    }

    let handlesubmit = (e) => {
        e.preventDefault()
        if (username == "") {
            seteusername("pleas enter your name")
        } else if (email == "") {
            seetemail("Pleas Enter your email")
        }
        else if (password == "") {
            setepassword("Pleas Enter your password")
        }
        else if (cpassword == "") {
            setecpassword("Pleas Enter your password")
        } else if (password != cpassword) {
            setmac("password does not match")

        } else {
            setloading(true)
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email, password)
                .then((user) => {
                    updateProfile(auth.currentUser, {
                        displayName: username,
                        photoURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRormNx-cWkV0Ggs-j5Jnk6g6x7JSyVqRh7uA&usqp=CAU"

                    }).then(() => {

                        const db = getDatabase();
                        set(ref(db, 'users/' + user.user.uid), {
                            username: username,
                            email: email,
                            id: user.user.uid,
                            img: user.user.photoURL
                        }).then(() => {
                            setusername("")
                            seteusername("")
                            setemail("")
                            seetemail("")
                            setpassword("")
                            setepassword("")
                            setcpassword("")
                            setecpassword("")
                            setmac("")
                            console.log(user.user)
                            setloading(false)

                            navigate("/login", { state: "Account Create sucessfully" }
                            );
                        })

                    }).catch((error) => {

                    })

                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    if (errorCode.includes("email")) {
                        setsameemail("Email already taken")
                    }

                });
        }
    }
    return (
        <>
            <Container>
                <Alert variant="primary" className='text-center mt-3 hed'>
                    Registration
                </Alert>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter your name" onChange={handleusername} value={username} />
                        {
                            eusername
                                ?
                                <Form.Text className="text-muted err">
                                    {eusername}
                                </Form.Text>
                                :
                                ""
                        }
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email" onChange={handleemail} value={email} />
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
                        <Form.Control type="password" placeholder="Enter your Password" onChange={handlepassword} value={password} />
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
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Pleas confirm Password" onChange={handlecpassword} value={cpassword} />
                        {
                            ecpassword
                                ?
                                <Form.Text className="text-muted err">
                                    {ecpassword}
                                </Form.Text>
                                :
                                ""
                        }
                        {
                            mac
                                ?
                                <Form.Text className="text-muted err">
                                    {mac}
                                </Form.Text>
                                :
                                ""
                        }
                        {
                            sameemail
                                ?
                                <Alert variant="primary" className='text-center mt-3 hed'>
                                    {sameemail}
                                </Alert>
                                :
                                ""
                        }
                    </Form.Group>
                    {
                        loading
                            ?
                            < Button variant="primary" className='b' type="submit" >
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </Button>
                            :
                            < Button variant="primary" onClick={handlesubmit} className='b' type="submit">
                                Submit
                            </Button>
                    }

                    <div className='text-center mt-3'>
                        <Form.Text className="text-muted mt-3">
                            Alredy have an account pleas <Link to="/Login">Login</Link>
                        </Form.Text>
                    </div>

                </Form>
            </Container>
        </>
    )
}

export default Registration