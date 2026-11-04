import { Link } from 'react-router-dom'
import { SPARKTREE_URL, WHATSAPP } from '../data'
import { WaIcon } from './ui'

export default function Footer() {
  return (
    <>
      <footer className="foot">
        <div className="wrap">
          <div className="top">
            <div>
              <Link className="brand" to="/">
                <img src="/img/logo.jpg" alt="" />
                <span>
                  Soujanya <em>Hegde</em>
                </span>
              </Link>
              <div className="tag">
                Stages, smiles <em>&amp;</em> spotlights.
              </div>
              <p style={{ color: 'rgba(248,241,230,.6)', fontSize: '.92rem', maxWidth: '34ch' }}>
                Celebrity host, event planner, corporate trainer and influencer — Mangaluru, Karnataka.
              </p>
            </div>
            <div>
              <h4>Explore</h4>
              <ul>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/journey">Journey</Link></li>
                <li><Link to="/awards">Awards</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4>Ventures</h4>
              <ul>
                <li><a href={SPARKTREE_URL} target="_blank" rel="noopener">SparkTree Foundation</a></li>
                <li><a href="https://www.instagram.com/letzparty_decorstore/" target="_blank" rel="noopener">Let'Z Party</a></li>
                <li><a href="https://www.instagram.com/sareerun.mangalore/" target="_blank" rel="noopener">Sarees Run Mangalore</a></li>
                <li><Link to="/chatroom">Chatroom with Soujanya</Link></li>
              </ul>
            </div>
            <div>
              <h4>Connect</h4>
              <ul>
                <li><a href="https://www.instagram.com/hegdesoujanya/" target="_blank" rel="noopener">Instagram</a></li>
                <li><a href="https://www.youtube.com/@chatroomwithsoujanya" target="_blank" rel="noopener">YouTube</a></li>
                <li><a href="https://www.facebook.com/destroyer9611/" target="_blank" rel="noopener">Facebook</a></li>
                <li><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div className="bot">
            <span>© 2026 Mrs. Soujanya Hegde. All rights reserved.</span>
            <span>Crafted with elegance ✦</span>
          </div>
        </div>
      </footer>
      <a className="fab" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
        <WaIcon />
      </a>
    </>
  )
}
