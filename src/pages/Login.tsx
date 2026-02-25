import { Form, Input, Card, Typography, Divider, Button, message } from "antd";
import { GoogleOutlined, RedEnvelopeOutlined } from "@ant-design/icons";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/Firebase";
import { LoginFormValues } from "../types/task";
import { useEffect } from "react";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { auth, currentUser } = useFirebase();
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleSignup = async (values: LoginFormValues) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      if (!userCredential) {
        return message.error("Problem in logging");
      }
      navigate("/dashboard");
    } catch (error: any) {
      const errorMessages: Record<string, string> = {
        "auth/invalid-credential": "Invalid Credentials",
        "auth/invalid-email": "Invalid email format",
        "auth/network-request-failed": "Network error, please try again",
      };
      message.error(
        errorMessages[error.code] || "Login failed, please try again.",
      );
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isAlreadyLoggedIn = result.user;
      if (isAlreadyLoggedIn) {
        navigate("/dashboard");
      }
      message.success("Logged in successfully!");
    } catch (error: any) {
      message.error("Error logging in with Google: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 relative">
      <BackgroundShapes />
      <Card className="w-full max-w-md shadow-lg rounded-xl p-6 bg-white relative z-10">
        <Header />
        <p className="text-center text-sm text-gray-500 mb-6">
          Streamline your workflow and track progress effortlessly with our task
          management app.
        </p>
        <Divider />
        <Title level={3} className="text-center -mt-3 mb-3">
          Login
        </Title>

        <Form
          layout="vertical"
          onFinish={handleSignup}
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
            Login
          </Button>
        </Form>

        <Footer handleGoogleSignIn={handleGoogleSignIn} />
      </Card>
    </div>
  );
};

const Header = () => (
  <div className="flex items-center justify-center gap-2 mb-4">
    <RedEnvelopeOutlined className="text-[#7B1984] text-2xl" />
    <Title level={3} className="text-[#7B1984] mb-0">
      TaskBuddy
    </Title>
  </div>
);

const Footer = ({ handleGoogleSignIn }: { handleGoogleSignIn: () => void }) => (
  <div className="text-center mt-4">
    <span>New here? </span>
    <Link to="/signup">
      <span className="text-[#7B1984] font-semibold cursor-pointer">
        Sign up
      </span>
    </Link>

    <Button
      className="mt-5 w-full !bg-black !border-none !rounded-lg flex items-center justify-center gap-2 py-2"
      onClick={handleGoogleSignIn}
    >
      <GoogleOutlined style={{ color: "#DB4437", fontSize: "20px" }} />
      <span className="text-white">Continue with Google</span>
    </Button>
  </div>
);

const BackgroundShapes = () => (
  <>
    <div className="absolute top-0 right-0 w-52 h-52 bg-purple-300 opacity-30 rounded-full z-0"></div>
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-purple-300 opacity-30 rounded-full z-0"></div>
    <div className="absolute top-11 left-0 hidden md:block w-64 h-64 bg-purple-300 opacity-30 rounded-full z-0"></div>
  </>
);

export default Login;
