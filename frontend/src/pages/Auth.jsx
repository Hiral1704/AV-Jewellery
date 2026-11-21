import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useStore } from '../context/StoreContext';


// Reusable Authentication Layout
const Shell = ({ title, children }) => (
    <main className="section auth-section">
        <div className="auth-card">

            <p className="eyebrow">
                A.V. JEWELLERY ACCOUNT
            </p>

            <h1>{title}</h1>

            {children}

        </div>
    </main>
);


// ==================== LOGIN ====================

export function Login() {
    const { login } = useStore();
    const nav = useNavigate();

    const [form, set] = useState({
        email: '',
        password: ''
    });

    const [err, setErr] = useState('');

    return (
        <Shell title="Welcome back.">

            <form
                onSubmit={async e => {
                    e.preventDefault();
                    setErr('');

                    try {
                        await login(form);
                        nav('/profile');
                    } catch (x) {
                        setErr(x.message);
                    }
                }}
            >

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={form.email}
                    onChange={e =>
                        set({
                            ...form,
                            email: e.target.value
                        })
                    }
                />


                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={form.password}
                    onChange={e =>
                        set({
                            ...form,
                            password: e.target.value
                        })
                    }
                />


                {/* Error Message */}
                {err && (
                    <p className="form-error">
                        {err}
                    </p>
                )}


                {/* Forgot Password */}
                <Link
                    className="forgot"
                    to="/forgot-password"
                >
                    Forgot password?
                </Link>


                {/* Login Button */}
                <button className="btn-dark full">
                    Login
                </button>

            </form>


            {/* Signup Link */}
            <p className="auth-foot">
                New to A.V.?

                <Link to="/signup">
                    Create an account
                </Link>
            </p>

        </Shell>
    );
}


// ==================== SIGNUP ====================

export function Signup() {
    const { signup } = useStore();
    const nav = useNavigate();

    const [form, set] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    const [err, setErr] = useState('');

    return (
        <Shell title="Create an account.">

            <form
                onSubmit={async e => {
                    e.preventDefault();
                    setErr('');

                    try {
                        await signup(form);
                        nav('/profile');
                    } catch (x) {
                        setErr(x.message);
                    }
                }}
            >

                {/* Full Name */}
                <input
                    placeholder="Full name"
                    required
                    value={form.name}
                    onChange={e =>
                        set({
                            ...form,
                            name: e.target.value
                        })
                    }
                />


                {/* Email */}
                <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={form.email}
                    onChange={e =>
                        set({
                            ...form,
                            email: e.target.value
                        })
                    }
                />


                {/* Phone Number */}
                <input
                    type="tel"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={e =>
                        set({
                            ...form,
                            phone: e.target.value
                        })
                    }
                />


                {/* Password */}
                <input
                    type="password"
                    minLength="8"
                    placeholder="Password (8+ characters)"
                    required
                    value={form.password}
                    onChange={e =>
                        set({
                            ...form,
                            password: e.target.value
                        })
                    }
                />


                {/* Error Message */}
                {err && (
                    <p className="form-error">
                        {err}
                    </p>
                )}


                {/* Signup Button */}
                <button className="btn-dark full">
                    Create account
                </button>

            </form>


            {/* Login Link */}
            <p className="auth-foot">
                Already have an account?

                <Link to="/login">
                    Login
                </Link>
            </p>

        </Shell>
    );
}


// ==================== FORGOT PASSWORD ====================

export function ForgotPassword() {
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');

    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');

    const api =
        import.meta.env.VITE_API_URL ||
        'http://localhost:5000/api';

    return (
        <Shell title="Reset your password.">

            <form
                onSubmit={async e => {
                    e.preventDefault();
                    setErr('');

                    try {
                        const endpoint =
                            step === 1
                                ? 'forgot-password'
                                : 'reset-password';

                        const body =
                            step === 1
                                ? { email }
                                : { email, token, password };

                        const r = await fetch(
                            `${api}/auth/${endpoint}`,
                            {
                                method: 'POST',

                                headers: {
                                    'Content-Type':
                                        'application/json'
                                },

                                body: JSON.stringify(body)
                            }
                        );

                        const d = await r.json();

                        if (!r.ok) {
                            throw Error(d.message);
                        }

                        setMsg(d.message);

                        // Move to password reset step
                        if (step === 1) {
                            if (d.devToken) {
                                setToken(d.devToken);
                            }

                            setStep(2);
                        }

                    } catch (x) {
                        setErr(x.message);
                    }
                }}
            >

                {/* Step 1: Email */}
                {step === 1 ? (
                    <input
                        type="email"
                        required
                        placeholder="Your registered email"
                        value={email}
                        onChange={e =>
                            setEmail(e.target.value)
                        }
                    />
                ) : (

                    /* Step 2: Token and New Password */
                    <>
                        <input
                            placeholder="Reset token"
                            required
                            value={token}
                            onChange={e =>
                                setToken(e.target.value)
                            }
                        />

                        <input
                            type="password"
                            minLength="8"
                            placeholder="New password"
                            required
                            value={password}
                            onChange={e =>
                                setPassword(e.target.value)
                            }
                        />
                    </>
                )}


                {/* Success Message */}
                {msg && (
                    <p className="success-msg">
                        {msg}
                    </p>
                )}


                {/* Error Message */}
                {err && (
                    <p className="form-error">
                        {err}
                    </p>
                )}


                {/* Submit Button */}
                <button className="btn-dark full">
                    {step === 1
                        ? 'Generate reset token'
                        : 'Update password'}
                </button>

            </form>


            {/* Back to Login */}
            <p className="auth-foot">
                <Link to="/login">
                    Back to login
                </Link>
            </p>

        </Shell>
    );
}


// ==================== PROFILE ====================

export function Profile() {
    const {
        user,
        token,
        setUser,
        logout
    } = useStore();

    const nav = useNavigate();

    const [name, setName] = useState(
        user?.name || ''
    );

    const [phone, setPhone] = useState(
        user?.phone || ''
    );

    const [msg, setMsg] = useState('');


    // If user is not logged in
    if (!user) {
        return (
            <main className="section">

                <h1>My Profile</h1>

                <p>
                    Please log in to view your profile.
                </p>

                <Link
                    className="btn-dark"
                    to="/login"
                >
                    Login
                </Link>

            </main>
        );
    }


    return (
        <main className="section profile">

            {/* Profile Header */}
            <p className="eyebrow">
                YOUR A.V. ACCOUNT
            </p>

            <h1>My Profile</h1>


            {/* Profile Update Form */}
            <form
                className="auth-card"

                onSubmit={async e => {
                    e.preventDefault();

                    const r = await fetch(
                        `${
                            import.meta.env.VITE_API_URL ||
                            'http://localhost:5000/api'
                        }/auth/me`,
                        {
                            method: 'PUT',

                            headers: {
                                'Content-Type':
                                    'application/json',

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                name,
                                phone
                            })
                        }
                    );

                    const d = await r.json();

                    if (r.ok) {
                        setUser(d.user);

                        localStorage.setItem(
                            'av_user',
                            JSON.stringify(d.user)
                        );

                        setMsg('Profile updated');
                    } else {
                        setMsg(d.message);
                    }
                }}
            >

                {/* Name */}
                <label>Name</label>

                <input
                    value={name}
                    onChange={e =>
                        setName(e.target.value)
                    }
                    required
                />


                {/* Email */}
                <label>Email</label>

                <input
                    value={user.email}
                    disabled
                />


                {/* Phone */}
                <label>Phone</label>

                <input
                    value={phone}
                    onChange={e =>
                        setPhone(e.target.value)
                    }
                />


                {/* Save Button */}
                <button className="btn-dark">
                    Save profile
                </button>


                {/* Status Message */}
                {msg && (
                    <p className="success-msg">
                        {msg}
                    </p>
                )}

            </form>


            {/* Profile Actions */}
            <div className="profile-links">

                <Link
                    className="btn-outline"
                    to="/orders"
                >
                    My Orders
                </Link>


                {/* Logout Button */}
                <button
                    className="btn-outline"
                    onClick={() => {
                        logout();
                        nav('/');
                    }}
                >
                    Logout
                </button>

            </div>

        </main>
    );
}