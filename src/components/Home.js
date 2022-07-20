import React from 'react'
import { useState } from 'react';
import '../Firebasconfig'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Left } from './Left';
import { Middle } from './Middle';
import { Right } from './Right';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";


import { Button, Col, Container, Row } from 'react-bootstrap'



function Home() {

    const { state } = useLocation();
    const [msg, setmsg] = useState(true)
    const [name, setname] = useState("")
    const [img, setimg] = useState("")
    const [varifyemail, setvarifyemail] = useState(false)
    const [time, settime] = useState("")
    const [ide, setid] = useState("")


    let navigate = useNavigate();

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setname(user.displayName)
            setimg(user.photoURL)

            settime(user.metadata.creationTime)
            setid(user.uid)

            // setname(user.displayName)

            if (user.emailVerified) {
                setvarifyemail(true)
            }
        } else {
            navigate("/login", { state: "login for contineu " })
        }
    });



    let handlelogout = () => {

        signOut(auth).then(() => {
            navigate("/login");
        }).catch((error) => {
            // An error happened.
        })
    }

    setTimeout(() => {
        setmsg(false)

    }, 2000);

    return (
        <>

            {/* {
                msg
                    ?
                    <h1>{state}</h1>
                    :
                    ""
            } */}


            <>

                <Row>
                    <Col lg={3}><Left username={name} img={img} id={ide} /> </Col>
                    <Col lg={6}><Middle /> </Col>
                    <Col lg={3}> <Right createtime={time} /> </Col>
                </Row>


            </>





        </>
    )
}

export default Home