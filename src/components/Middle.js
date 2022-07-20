import React, { useEffect, useState } from "react";
import { Form, Button, Modal, ProgressBar, Card } from "react-bootstrap";
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import {
  getStorage,
  ref as Refer,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";

export const Middle = () => {
  let auth = getAuth();
  const userdata = useSelector((item) => item.activeusers.id);

  const [msg, setmsg] = useState("");
  const [usermsg, setusermsg] = useState("");
  const [show, setShow] = useState(false);
  const [fileforUpload, setfileforUpload] = useState("");
  const [progress, setprogress] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let handlemsg = (e) => {
    setmsg(e.target.value);
  };
  let handlesend = () => {
    // console.log("mesage send by", auth.currentUser.uid)
    // console.log("mesage recive by", userdata)

    const db = getDatabase();
    set(push(ref(db, "messages/")), {
      msg: msg,
      sender: auth.currentUser.uid,
      receiver: userdata,
    });
  };
  let msgarr = [];
  useEffect(() => {
    const db = getDatabase();
    const starCountRef = ref(db, "message/");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      snapshot.forEach((item) => {
        msgarr.push(item.val());
      });
      setusermsg(data);
    });
  }, []);

  let handleFileselect = (e) => {
    setfileforUpload(e.target.files[0]);
  };
  let handleFileupload = () => {
    console.log("file upoload");
    const storage = getStorage();
    const storageRef = Refer(storage, `test/${fileforUpload.name}`);
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
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  return (
    <>
      {/* // <><div className='middle'>
        //     <Card style={{ width: '18rem' }}>
        //         <Card.Img variant="top" src="holder.js/100px180" />
        //         <Card.Body>
        //             <Card.Title>Card Title</Card.Title>
        //             <Card.Text>
        //                 Some quick example text to build on the card title and make up the bulk of
        //                 the card's content.
        //             </Card.Text>
        //             <Button variant="primary">Go somewhere</Button>
        //         </Card.Body>
        //     </Card>

        // </div> */}
      <Form.Control
        onChange={handlemsg}
        type="email"
        placeholder="name@example.com"
      />
      <Button onClick={handlesend} className="w-50">
        Send
      </Button>
      <Button className="w-50" variant="primary" onClick={handleShow}>
        File
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chose a File for upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="file"
            onChange={handleFileselect}
            placeholder="Enter a file"
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
    </>
  );
};
