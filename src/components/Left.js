import React, { useEffect, useState } from "react";

import {
  Dropdown,
  Button,
  DropdownButton,
  ListGroup,
  Form,
  Modal,
  ProgressBar,
  ButtonGroup,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";
import {
  getStorage,
  ref as Refer,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useDispatch } from "react-redux";
export const Left = (props) => {
  const dispatch = useDispatch();
  const [users, setusers] = useState([]);
  const [activeusers, setactiveusers] = useState("");
  const [profilepic, setprofilepic] = useState(false);

  let navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [fileforUpload, setfileforUpload] = useState("");
  const [progress, setprogress] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const auth = getAuth();
  let handlelogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  let useArray = [];
  useEffect(() => {
    const db = getDatabase();
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      snapshot.forEach((item) => {
        if (props.id !== item.key) {
          useArray.push(item.val());
        } else {
          setprofilepic(item.val().img);
        }
      });
      setusers(useArray);
    });
  }, [props.id]);
  let handleactive = (id) => {
    setactiveusers(id);
    dispatch({ type: "ACTIVE_USER", payload: id });
  };

  let handleimg = (e) => {
    setfileforUpload(e.target.files[0]);
  };
  let handleFileupload = () => {
    console.log("file upoload");
    const storage = getStorage();
    const storageRef = Refer(
      storage,
      `userprofile/${auth.currentUser.uid}/${fileforUpload.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, fileforUpload);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setprogress(progress);
        if (progress == 100) {
          setfileforUpload("");
          setprogress(false);
          setShow(false);
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          const db = getDatabase();
          set(ref(db, "users/" + auth.currentUser.uid), {
            username: props.username,
            id: props.id,
            img: downloadURL,
          });
        });
      }
    );
  };
  return (
    <>
      <div className="left">
        <img className="w-5 " src={profilepic} />
        <DropdownButton
          as={ButtonGroup}
          id={`dropdown-variants-warning`}
          variant="dark"
          title={props.username}
        >
          <Dropdown.Item eventKey="2">
            <Button
              className="w-100"
              variant="primary" /**onClick={handleShow} */
            >
              Change Profile Picture
            </Button>
          </Dropdown.Item>
          <Button onClick={handlelogout}>Logout</Button>
          <Dropdown.Divider />
        </DropdownButton>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Chose a File for upload</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              type="file"
              onChange={handleimg}
              placeholder="Enter a fie"
            />
            {progress >= 1 ? (
              <ProgressBar now={progress} label={`${progress}%`} />
            ) : (
              ""
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleFileupload}>
              Upload
            </Button>
          </Modal.Footer>
        </Modal>
        <h3>Peoples</h3>
        {users.map((item) => (
          <ListGroup>
            <ListGroup.Item
              style={activeusers == item.id ? active : notactive}
              onClick={() => handleactive(item.id)}
            >
              {item.username}
            </ListGroup.Item>
          </ListGroup>
        ))}
      </div>
    </>
  );
};
let active = {
  color: "red",
};
let notactive = {
  color: "#000",
};

export default Left;
