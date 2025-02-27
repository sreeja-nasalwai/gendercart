
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { FloatingLabel } from "react-bootstrap";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUpComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [gender, setGender] = useState('male'); // Default category value
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the email ends with @gmail.com
        if (!email.endsWith("@gmail.com")) {
            toast.error('Email must be a @gmail.com address');
            return;
        }

        // Check if the mobile number is exactly 10 digits
        if (mobileNumber.length !== 10) {
            toast.error('Mobile number must be exactly 10 digits');
            return;
        }

        // Check if the password meets the criteria
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password)) {
            toast.error('Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 special character, and 1 digit');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3002/signup/', {
                email,
                password,
                username,
                mobileNumber,
                gender, // Include category in the request
            });

            if (response.data.message === 'User already exists') {
                toast.error('User already exists');
            } else {
                const token = response.data.token;
                localStorage.setItem('jsonwebtoken', token);
                toast.success('Signed up successfully');
                navigate('/login');
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error('Sign up failed. Please try again.');
        }
    };

    const handleMobileNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,10}$/.test(value)) {
            setMobileNumber(value);
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        checkPasswordStrength(value, username);
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        checkPasswordStrength(password, value);
    };

    const checkPasswordStrength = (password, username) => {
        const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (strongPasswordRegex.test(password)) {
            if (isPasswordSimilarToUsername(password, username)) {
                setPasswordStrength('weak');
            } else {
                setPasswordStrength('strong');
            }
        } else if (password.length >= 8) {
            setPasswordStrength('weak');
        } else {
            setPasswordStrength('not valid');
        }
    };

    const isPasswordSimilarToUsername = (password, username) => {
        if (!username) return false;
        const usernameLower = username.toLowerCase();
        const passwordLower = password.toLowerCase();
        return passwordLower.includes(usernameLower) || usernameLower.includes(passwordLower);
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card mt-5">
                        <div className="card-body">
                            <h1 className="text-center mb-4">Sign Up</h1>
                            <form onSubmit={handleSubmit}>
                                <FloatingLabel label="Email :" className="mb-3">
                                    <input type="email" id="email" className="form-control" placeholder="Enter your email" required onChange={(e) => setEmail(e.target.value)} />
                                </FloatingLabel>
                                <FloatingLabel label="Password :" className="mb-3">
                                    <input type="password" id="pass" className="form-control" placeholder="Enter your password" required onChange={handlePasswordChange} />
                                    {password && (
                                        <div className={`mt-2 ${passwordStrength === 'strong' ? 'text-success' : 'text-danger'}`}>
                                            Password is {passwordStrength}
                                        </div>
                                    )}
                                </FloatingLabel>
                                <FloatingLabel label="UserName :" className="mb-3">
                                    <input type="text" id="username" className="form-control" placeholder="Enter your username" required onChange={handleUsernameChange} />
                                </FloatingLabel>
                                <FloatingLabel label="Mobile Number :" className="mb-3">
                                    <input type="text" id="mobileNumber" className="form-control" placeholder="Enter your phone number" required onChange={handleMobileNumberChange} value={mobileNumber} />
                                </FloatingLabel>
                                <FloatingLabel label="Category :" className="mb-3">
                                    <select className="form-control" onChange={(e) => setGender(e.target.value)} value={gender}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="kids">Kids</option>
                                    </select>
                                </FloatingLabel>
                                <div className="mb-3 form-check">
                                    <input type="checkbox" className="form-check-input" id="agreeCheckbox" required />
                                    <label className="form-check-label" htmlFor="agreeCheckbox">
                                        By continuing, I agree to the <Link to="/term">Terms And Conditions</Link> of FashionFusion
                                    </label>
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-dark btn-lg">Sign Up</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpComponent;
