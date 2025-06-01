import Unda from "./components/home";
import NavBar from "./components/navbar";
import Customize from "./customize/page";
import Test from "./Test";

export default function Home() {
  return (
    <div>
      <NavBar />
      {/* <Unda /> */}
      <Customize />
      {/* <Test /> */}
    </div>
  );
}
