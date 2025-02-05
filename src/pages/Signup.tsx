import { useCallback } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button, Form, Input, Card, Typography, Divider, message } from "antd";
import { GoogleOutlined, RedEnvelopeOutlined } from "@ant-design/icons";
import { useFirebase } from "../context/Firebase";
import { Link, useNavigate } from "react-router-dom";
import { SignupFormValues } from "../types/task";

const { Title } = Typography;

const Signup = () => {
    const navigate = useNavigate();
    const { auth } = useFirebase();
    const googleProvider = new GoogleAuthProvider();

    const signupUser = useCallback(
        async ({ email, password }: SignupFormValues) => {
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                navigate("/");
            } catch (error: any) {
                const errorMessages: Record<string, string> = {
                    "auth/email-already-in-use": "User already exists",
                    "auth/weak-password":
                    "Password should be at least 6 characters",
                    "auth/invalid-email": "Invalid email format",
                    "auth/network-request-failed":
                    "Network error, please try again",
                };
                message.error(
                    errorMessages[error.code] ||
                        "Signup failed, please try again."
                );
            }
        },
        [auth, navigate]
    );

    const signupWithGoogle = () => {
        signInWithPopup(auth, googleProvider);
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 relative">
            <div className="absolute top-0 right-0 z-0 w-48 h-48 bg-purple-300 rounded-full opacity-30"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-0 w-64 h-64 bg-purple-300 rounded-full opacity-30"></div>
            <div className="absolute top-11 left-0 transform -translate-y-1/2 z-0 hidden md:block w-64 h-64 bg-purple-300 rounded-full opacity-30"></div>

            <Card className="w-full max-w-md shadow-lg rounded-xl p-6 bg-white relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <RedEnvelopeOutlined
                        style={{ color: "#7B1984", fontSize: "28px" }}
                    />
                    <Title level={3} className="text-[#7B1984] mb-0">
                        TaskBuddy
                    </Title>
                </div>

                <p className="text-center text-sm text-gray-500">
                    Create an account and manage your tasks effortlessly.
                </p>

                <Divider />

                <h1 className="text-center text-2xl font-bold -mt-3 mb-3">
                    Sign up
                </h1>

                <Form
                    layout="vertical"
                    onFinish={signupUser}
                    autoComplete="off"
                    className="space-y-4"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your email!",
                            },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your password!",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" className="w-full">
                        Sign Up
                    </Button>
                </Form>

                <div className="text-center mt-4">
                    <span>Already have an account? </span>
                    <Link to="/">
                        <span className="text-[#7B1984] cursor-pointer font-semibold">
                            Log in
                        </span>
                    </Link>
                </div>

                <Button className="mt-5 w-full !bg-black !border-none !rounded-lg flex items-center justify-center gap-2 py-2" onClick={signupWithGoogle}>
                    <GoogleOutlined
                        style={{ color: "#DB4437", fontSize: "20px" }}
                    />
                    <span className="text-white">Continue with Google</span>
                </Button>
            </Card>
        </div>
    );
};

export default Signup;
