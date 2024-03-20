import { useState, useRef, useContext } from 'react';
import axios from "axios";
import socket from '../socket';
import { ChatContext } from '../context/ChatProvider';

function SignIn() {
    const { setUser } = useContext(ChatContext);

    const [tf, setTf] = useState(true);
    const [first, setFirst] = useState({
        greet: "Welcome Back",
        subHeading: "Join the conversation and explore new horizons with our chat community.",
        method: "Login"
    });
    const textL = useRef('');
    const [Heading, setHeading] = useState('Sign In')
    const WelDiv = useRef('');
    const accDiv = useRef('');
    const textS = useRef('');
    const textM = useRef('');
    const Uname = useRef('');

    const [Name, SetName] = useState('');
    const [Email, SetEmail] = useState('');
    const [Password, SetPassword] = useState('');

    const Change = () => {
        if (tf) {
            accDiv.current.className = "md:w-1/2  z-10  -translate-y-full md:-translate-x-full md:translate-y-0 transition-all ease-in-out duration-700 ";
            WelDiv.current.className = "md:w-1/2 h-1/2  md:h-full bg-cover bg-[url('./assets/SignIn.svg')] font-black z-20 translate-y-full md:translate-x-full   md:translate-y-0 transition-all ease-in-out duration-700";
            setTimeout(() => {
                setHeading("Login")
                Uname.current.className += " hidden"
            }, 200);
            textL.current.className = "text-5xl transition-all blur-sm duration-200 blur-md duration-300 blur-lg duration-500 blur-3xl duration-700 ";
            textS.current.className = "h-1/5 py-2 flex px-10 text-md transition-all blur-sm duration-200 blur-md duration-300 blur-lg duration-500 blur-3xl duration-700 ";
            textM.current.className = "text-xl hover:text-blue-300 transition-all blur-sm duration-200 blur-md duration-300 blur-lg duration-500 blur-3xl duration-700 ";
            setTimeout(() => {
                textL.current.className = "text-5xl transition-all blur-none duration-500   ";
                textS.current.className = " h-1/5 py-2 flex px-10 text-md  transition-all blur-none duration-500    ";
                textM.current.className = "text-xl hover:text-blue-300 transition-all blur-none duration-500     ";
                setFirst({
                    greet: "Hello, Friend",
                    subHeading: "Enter your personal detailes and get started!",
                    method: "Create Account"
                })
            }, 250)
            setTf(false);
        }
        else {
            accDiv.current.className = "md:w-1/2  z-10 translate-y-1/6 md:translate-x-1/6 md:translate-y-0 transition-all ease-in-out duration-700 ";
            WelDiv.current.className = "md:w-1/2 h-1/2  md:h-full bg-cover bg-[url('./assets/SignIn.svg')] font-black z-20 translate-y-1/6 md:-translate-x-1/6   md:translate-y-0 transition-all ease-in-out duration-700";
            setTimeout(() => {
                setHeading("Create Account")
                Uname.current.className = "bg-slate-200 w-3/5 rounded-xl px-3 py-2 focus:outline-none"
            }, 200);
            textL.current.className = "text-5xl transition-all blur-sm duration-200 blur-md duration-300 blur-lg duration-500 blur-3xl duration-700 ";
            textS.current.className = "h-1/5 py-2 flex px-10 text-md transition-all blur-sm duration-200 blur-md duration-300 blur-lg duration-500 blur-3xl duration-700 ";
            textM.current.className = "text-xl hover:text-blue-300 transition-all blur-sm duration-200 blur-md duration-300 blur-lg duration-500 blur-3xl duration-700 ";
            setTimeout(() => {
                textL.current.className = "text-5xl transition-all blur-none duration-500";
                textS.current.className = " h-1/5 py-2 flex px-10 text-md  transition-all blur-none duration-500";
                textM.current.className = "text-xl hover:text-blue-300 transition-all blur-none duration-500 ";
                setFirst({
                    greet: "Welcome Back",
                    subHeading: "Join the conversation and explore new horizons with our chat community.",
                    method: "SignIn"
                })
            }, 250)
            setTf(true);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (tf) {
            console.log("Create")
            if (!Name || !Email || !Password) {
                alert("Please fill all the fields");
                return;
            }
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                };
                const { data } = await axios.post(
                    "http://localhost:3000/api/users",
                    { name: Name, password: Password, email: Email },
                    config
                );

                localStorage.setItem("userInfo", JSON.stringify(data));
                setUser(data)
                socket.connect();
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            console.log("Login")
            if (!Email || !Password) {
                alert("Please fill all the fields");
                return;
            }
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                };
                const { data } = await axios.post(
                    "http://localhost:3000/api/users/login",
                    { email: Email, password: Password },
                    config
                );

                localStorage.setItem("userInfo", JSON.stringify(data));
                setUser(data)
                socket.connect();
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <>
            <div className='h-screen flex justify-center items-center '>
                <div className='md:h-4/5 h-full md:w-2/3  w-full  md:flex    shadow-2xl'>
                    <div ref={WelDiv} className='z-20 md:w-1/2 h-1/2  md:h-full bg-cover bg-[url("./assets/SignIn.svg")] font-black' >
                        <div className='flex flex-col justify-center items-center md:h-full h-full  text-white text-center  '>
                            <div className='text-5xl ' ref={textL}>
                                {first.greet}
                            </div>
                            <div className='h-1/5 py-2 flex px-10 text-md ' ref={textS}>
                                {first.subHeading}
                            </div>
                            <div className='text-xl hover:text-blue-300' ref={textM}>
                                <button onClick={Change}>
                                    {first.method}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='md:w-1/2  z-10' ref={accDiv}>
                        <div className='flex flex-col md:py-20 items-center h-full '>
                            <div className=' text-5xl font-black' >
                                {Heading}
                            </div>
                            <div className='py-7 flex flex-col items-center w-full'>
                                <button >
                                </button>
                                <div className='w-full'>
                                    <form className='py-14 w-full flex flex-col justify-center items-center gap-5 h-full ' onSubmit={handleSubmit}>
                                        <input className='bg-slate-200 w-3/5 rounded-xl px-3 py-2 focus:outline-none' placeholder='Username' onChange={(e) => SetName(e.target.value)} ref={Uname}></input>
                                        <input type={"email"} className='bg-slate-200 w-3/5 rounded-xl px-3 py-2 focus:outline-none' placeholder='Email' onChange={(e) => SetEmail(e.target.value)}></input>
                                        <input type={"Password"} className='bg-slate-200 w-3/5 rounded-xl px-3 py-2 focus:outline-none' placeholder='Password' onChange={(e) => SetPassword(e.target.value)}></input>
                                        {tf ? <button className='font-black' >Create</button > : <button className='font-black'>Send</button>}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignIn
