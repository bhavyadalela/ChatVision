import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useRef, useState } from "react";
import UserChat from './UserChat';
const Sidenav = () => {
    const [friendArr, setFriendArr] = useState([]);
    const [search, setSearch] = useState('');
    const [searchedUser, setSearchUser] = useState([]);
    const sliderRef = useRef(null);
    const friendsRef = useRef(null);
    const [sliderHandler, setSliderHandler] = useState(false);

    const getFriendData = async () => {
        try {
            const currId = JSON.parse(localStorage.getItem("userInfo"))._id;
            const { data } = await axios.get(`http://localhost:3000/api/users/${currId}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`
                }
            });
            const friendPromises = data.friends.map(async (friend) => {
                const { data } = await axios.get(`http://localhost:3000/api/users/${friend}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`
                    }
                });
                return data;
            });
            const friendData = await Promise.all(friendPromises);
            setFriendArr(friendData);
        }
        catch (err) {
            console.log(err);
        }
    }

    const searchUser = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(`http://localhost:3000/api/users?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`
                }
            });
            const serachPromise = data.map(async (user) => {
                const { data } = await axios.get(`http://localhost:3000/api/users/${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`
                    }
                });
                return data;
            });
            const searchData = await Promise.all(serachPromise);
            setSearchUser(searchData);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getFriendData();
    }, []);

    const slider = () => {
        if (!sliderHandler) {
            sliderRef.current.className = 'flex flex-col h-full w-full bg-[#21374f] -translate-x-0 transition-all duration-500 ease-in-out';
        }
        else {
            sliderRef.current.className = 'flex flex-col h-full w-full bg-[#21374f] -translate-x-full transition-all duration-500 ease-in-out';
        }
        setSliderHandler(!sliderHandler);
    }
    return (
        <>
            <div className="w-1/4 relative overflow-auto">
                <div className='absolute flex flex-col h-full w-full bg-[#21374f] transition-all duration-500 ease-in-out ' ref={friendsRef}>
                    <form onSubmit={searchUser}>
                        <div className='flex items-center text-white min-h-16 px-5 shadow-xl'>
                            <button className="border-2 border-[#21374f] p-2 rounded-md shadow-md bg-[#27415d] hover:bg-[#21374f]" onClick={slider}>Search</button>
                        </div>
                    </form>
                    {friendArr.map((friend, index) => (
                        <UserChat key={index} userReciever={friend} />
                    ))}
                </div>
                <div className='absolute flex-col h-full w-full bg-[#21374f] -translate-x-0 transition-all duration-500 ease-in-out overflow-auto' ref={sliderRef}>
                    <form onSubmit={searchUser}>
                        <div className='flex items-center text-white min-h-16 px-5 shadow-xl'>
                            <div className="flexw-full h-10 p-2 rounded-md shadow-md bg-[#243c57]  ">
                                <button onClick={slider}>
                                    <ArrowBackIcon />
                                </button>
                                <input type="text" className="bg-inherit w-1/2 mx-2 hover:bg-[#223448]  " placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                            </div>
                        </div>
                    </form>
                    {searchedUser.map((user, index) => (
                        <UserChat key={index} userReciever={user} />
                    ))}
                </div>
            </div>

        </>
    );
}

export default Sidenav;
