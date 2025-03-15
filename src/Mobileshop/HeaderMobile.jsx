import React, { useState, useRef, useEffect } from "react";
import './HeaderMobile.css';
import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Swal from "sweetalert2";
import Logo1 from './assets/logo111.png';

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export function HeaderMobile() {
    const navigate = useNavigate();
    const drawerRef = useRef(null); // Create a reference to the drawer

    const Home = () => navigate('/');
    const Cart = () => navigate('/');
    const tws1 = () => navigate('/CustomerManagement');
    //const tws1 = () => navigate('/NewMobile');
    const tws2 = () => navigate('/UsedMobile');
    const tws3 = () => navigate('/DemoMobile');
    const tws4 = () => navigate('/Gifts');
    const tws5 = () => navigate('/ContactUs');

    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => setIsOpen(!isOpen);

    const fetchUser = async () => {
        console.log("🟢 Đang gọi getUser với email:");
        try {
            const q = query(collection(db, "users"), where("email", "==", "toancoi50@gmail.com")); // Thay bằng email user đăng nhập
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data(); // Lấy dữ liệu user đầu tiên tìm thấy
                setUser(userData);
                console.log(userData);
            } else {
                console.log("User not found");
            }
        } catch (error) {
            console.error("Error fetching user: ", error);
        }
    };

    const Loginbtn = async () => {
        const { value: email } = await Swal.fire({
            title: "Login",
            input: "email",
            inputLabel: "Your email address",
            inputPlaceholder: "Enter your email address"
        });
        if (email) {
            const { value: password } = await Swal.fire({
                title: "Enter your password",
                input: "password",
                inputLabel: "Password",
                inputPlaceholder: "Enter your password",
                inputAttributes: {
                    maxlength: "10",
                    autocapitalize: "off",
                    autocorrect: "off"
                }
            });
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid email or password",
                footer: '<a href="#">Create new account</a>'
            });
        }
    }

    // Handle clicks outside the drawer
    useEffect(() => {
        fetchUser();

        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
                integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
                crossOrigin="anonymous" referrerPolicy="no-referrer" />

            <Navbar expand="xxxl" className="bg-body-tertiary">
                <div className="header">
                    <div className="nav-back">
                        <div className="toggle-button">
                            <button className="button" onClick={toggleDrawer}>
                                <i className="fa-solid openmenu fa-bars"></i>
                            </button>
                        </div>
                        <nav>
                            <div onClick={Home}>
                                <img className="logo" src={Logo1} alt="" />
                            </div>
                            <ul id="sidemenu">
                                <li onClick={tws1}>{user && <p className="username"> {user.userName} </p>}</li>
                                <li onClick={tws2}><p>Used Mobile</p></li>
                                <li onClick={tws3}><p>Demo Mobile</p></li>
                                <li onClick={tws4}><p>Gift with Mobile</p></li>
                                <li onClick={tws5}><p>Contact Us</p></li>
                            </ul>
                            <div className="nav-right">
                                <i className="fa-solid search-icon search-icon fa-magnifying-glass"></i>
                                <input type="search" className="nav-search" placeholder="search" />
                                <i onClick={Loginbtn} className="fa-solid fa-user"></i>
                                <i onClick={Cart} className="fa-solid fa-bag-shopping"></i>
                            </div>
                        </nav>
                    </div>
                </div>

                <div className={`drawer ${isOpen ? 'open' : ''}`} id="navbarScroll" ref={drawerRef}>
                    <Nav className="ul" navbarScroll>
                        <Nav.Link className="li" onClick={tws1}><p className="p">New Mobile</p></Nav.Link>
                        <Nav.Link className="li" onClick={tws2}><p className="p">Used Mobile</p></Nav.Link>
                        <Nav.Link className="li" onClick={tws3}><p className="p">Demo Mobile</p></Nav.Link>
                        <Nav.Link className="li" onClick={tws4}><p className="p">Gift With Mobile</p></Nav.Link>
                        <Nav.Link className="li" onClick={tws5}><p className="p">Contact Us</p></Nav.Link>
                    </Nav>
                </div>
            </Navbar>
        </>
    );
}
