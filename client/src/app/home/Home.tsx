import Link from "next/link"
import "./home.css"


export default function HomePage() {
    return <div className="home-main">
        <div className="home-nav">
            <Link href="/home" className="navbar-home-nav-logo">
                Vizzko
            </Link>
            <div className="home-nav-links">
                <Link href="/customize">
                 Customize
                </Link>
                <div className="home-nav-link">
                    Login
                </div>
                <div className="home-nav-link">
                    About
                </div>
            </div>
        </div>
        <div className="home-title3">
            The Creator's Choice
        </div>
        <button className="home-get-started-btn">
            Get Started
        </button>
        <div className="home-image-container1">
            image container
        </div>
    </div>
}