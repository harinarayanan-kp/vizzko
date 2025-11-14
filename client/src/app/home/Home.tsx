import Link from "next/link"
import "./home.css"

export default function HomePage() {
    return (
        <main className="home-main luxury">
            <header className="home-nav" role="navigation" aria-label="Main navigation">
                <Link href="/" className="navbar-home-nav-logo">
                    Vizzko
                </Link>
                <nav className="home-nav-links" aria-label="Primary">
                    <Link href="/customize" className="home-nav-link">Customize</Link>
                    <Link href="/login" className="home-nav-link">Login</Link>
                    <Link href="/about" className="home-nav-link">About</Link>
                </nav>
            </header>
            <section className="home-hero">
                <div className="home-hero-content">
                    <h1 className="home-title3">The Creator's Choice</h1>
                    <p className="home-subtitle">Exquisite apparel. Thoughtful design. Premium presentation.</p>
                    <div className="home-cta-row">
                        <Link href="/customize" className="home-get-started-btn">Start Designing</Link>
                        <Link href="/signup" className="home-secondary-btn">Create Account</Link>
                    </div>
                </div>

                <div className="home-image-container1" aria-hidden="true">
                    <div className="image-row">
                        <img src="/home/image1.png" alt="Preview 1" />
                        <img src="/home/image2.png" alt="Preview 2" />
                        <img src="/home/image3.png" alt="Preview 3" />
                    </div>
                </div>
            </section>

            <section className="home-features">
                <div className="feature">
                    <h3>Real-time 3D</h3>
                    <p>Preview designs on realistic 3D models with instant updates.</p>
                </div>
                <div className="feature">
                    <h3>Intuitive Editor</h3>
                    <p>Upload, place, and style your artwork in a few clicks.</p>
                </div>
                <div className="feature">
                    <h3>Fast Fulfillment</h3>
                    <p>Optimized printing and shipping so customers get their orders fast.</p>
                </div>
            </section>

            <section className="home-showcase">
                <h2 className="section-title">Creator Showcase</h2>
                <p className="section-sub">Real designs from creators using Vizzko.</p>
                <div className="showcase-grid">
                    <img src="/home/image1.png" alt="Showcase 1" />
                    <img src="/home/image2.png" alt="Showcase 2" />
                    <img src="/home/image3.png" alt="Showcase 3" />
                </div>
            </section>

            <section className="home-testimonials">
                <h2 className="section-title">What creators say</h2>
                <div className="testimonials-row">
                    <blockquote className="testimonial">
                        <p>"Vizzko made launching my merch effortless — the 3D previews are amazing."</p>
                        <cite>— Alex P., Designer</cite>
                    </blockquote>
                    <blockquote className="testimonial">
                        <p>"Sales doubled after I added realistic mockups to my product pages."</p>
                        <cite>— Maya R., Founder</cite>
                    </blockquote>
                    <blockquote className="testimonial">
                        <p>"The editor is intuitive and fast. Customers love the quality."</p>
                        <cite>— Sam K., Creator</cite>
                    </blockquote>
                </div>
            </section>

            <section className="home-pricing">
                <h2 className="section-title">Pricing</h2>
                <div className="pricing-grid">
                    <div className="plan">
                        <h3>Starter</h3>
                        <p className="price">Free</p>
                        <ul>
                            <li>Basic editor</li>
                            <li>Standard mockups</li>
                            <li>Email support</li>
                        </ul>
                        <Link href="/signup" className="home-secondary-btn">Start Free</Link>
                    </div>
                    <div className="plan popular">
                        <h3>Creator</h3>
                        <p className="price">$12/mo</p>
                        <ul>
                            <li>3D previews</li>
                            <li>Priority fulfillment</li>
                            <li>Analytics</li>
                        </ul>
                        <Link href="/signup" className="home-get-started-btn">Get Creator</Link>
                    </div>
                    <div className="plan">
                        <h3>Scale</h3>
                        <p className="price">Contact</p>
                        <ul>
                            <li>Custom printing</li>
                            <li>Bulk discounts</li>
                            <li>Dedicated support</li>
                        </ul>
                        <Link href="/contact" className="home-secondary-btn">Contact Us</Link>
                    </div>
                </div>
            </section>

            <section className="home-faq">
                <h2 className="section-title">Frequently asked</h2>
                <div className="faq-list">
                    <details>
                        <summary>Can I upload my own artwork?</summary>
                        <p>Yes — JPG, PNG and vector SVGs are supported. Position and resize directly in the editor.</p>
                    </details>
                    <details>
                        <summary>Do you ship worldwide?</summary>
                        <p>We ship to most countries. Shipping costs and times vary by destination.</p>
                    </details>
                    <details>
                        <summary>Is there a trial?</summary>
                        <p>Yes — the Starter plan is free to try with no time limit.</p>
                    </details>
                </div>
            </section>

            <section className="home-final-cta">
                <div className="final-cta-inner">
                    <h2>Ready to create?</h2>
                    <p>Start designing and selling in minutes — join thousands of creators.</p>
                    <div className="home-cta-row">
                        <Link href="/customize" className="home-get-started-btn">Get Started</Link>
                        <Link href="/signup" className="home-secondary-btn">Create Free Account</Link>
                    </div>
                </div>
            </section>

            <footer className="home-footer">
                <p>© {new Date().getFullYear()} Vizzko — Built for creators</p>
            </footer>
        </main>
    )
}