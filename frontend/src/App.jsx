import { useState } from "react";

import Logo from "./assets/otp.png";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    number: "",
  });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const mongoose= async () => {
    const response = await fetch('https://vibtree.onrender.com/api/inventory', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ 
           number:form.number,
         }),
       });
       
       
     };
  const otp= async () => {
 const response = await fetch('https://vibtree.onrender.com/api/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        number:form.number,
      }),
    });
    mongoose();
    console.log(response);
    
  };

 
  const call= async () => {
    const response = await fetch('https://vibtree.onrender.com/api/call', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ 
           number:form.number,
         }),
       });
       mongoose();

       console.log(response);
     };
  return (
    <div className=" pt-[5%] m-7 div">
      <div className="card card-side bg-base-100 shadow-xl  shadow-purple-500 ">
        <figure>
          <img src={Logo} alt="otp" className=" w-[400px] h-[500px] img " />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Enter your Mobile number</h2>
          <p>Click the button to Generate otp .</p>
          <form className=" pb-[200px]"> 
            <input
              name="number"
              type="text"
              value={form.number}
              onChange={handleChange}
              required
              className="input input-bordered input-secondary w-full max-w-xs "
              placeholder="MobileNO"
            />
          </form>
          <div className="card-actions justify-end absolute top-[60%]">
            <button className="btn btn-primary" onClick={otp}>Mobile OTP</button>
            <button className="btn btn-primary" onClick={call}>VOice Message</button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
