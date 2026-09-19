import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <strong>{siteConfig.name}</strong>
          <p>{siteConfig.tagline}</p>
<<<<<<< HEAD
          <small className="muted-copy">© {new Date().getFullYear()} ZoneCheckr.com</small>
        </div>
=======
          <small className="muted-copy">
            © {new Date().getFullYear()} ZoneCheckr.com
          </small>
        </div>

>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
        <div className="footer-links">
          <Link href="/tools">Tools</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
