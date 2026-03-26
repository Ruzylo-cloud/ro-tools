import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Terms of Service | RO Tools',
  description: 'Terms of Service for RO Tools by JM Valley Group.',
};

export default function TermsOfService() {
  return (
    <>
      {/* NAV */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>
          <Image src="/jmvg-logo.png" alt="JM Valley Group" width={84} height={42} style={{ borderRadius: '4px' }} />
          <div className={styles.navLogoText}>RO <span>Tools</span></div>
        </Link>
      </nav>

      {/* CONTENT */}
      <main className={styles.wrapper}>
        <h1 className={styles.pageTitle}>Terms of Service</h1>
        <p className={styles.lastUpdated}>Last updated: March 26, 2026</p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Acceptance of Terms</h2>
          <p className={styles.text}>
            By accessing and using RO Tools (&quot;the App&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the App.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Description of Service</h2>
          <p className={styles.text}>
            RO Tools is an internal business tool developed and maintained by JM Valley Group for use by its Jersey Mike&apos;s franchise operators, district managers, and administrators. The App provides tools for generating branded documents, managing store profiles, and supporting day-to-day operations.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Access &amp; Authorization</h2>
          <p className={styles.text}>
            Access to the App is restricted to authorized users with valid @jmvalley.com Google accounts. You are responsible for maintaining the security of your account. Unauthorized use of the App is strictly prohibited.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Ownership</h2>
          <p className={styles.text}>
            RO Tools and all associated content, features, and functionality are owned by JM Valley Group. All rights not expressly granted herein are reserved. You may not copy, modify, distribute, or reverse-engineer any part of the App.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Acceptable Use</h2>
          <p className={styles.text}>You agree to use the App only for its intended business purposes. You shall not:</p>
          <ul className={styles.list}>
            <li>Use the App for any unlawful or unauthorized purpose</li>
            <li>Attempt to gain unauthorized access to any part of the App or its systems</li>
            <li>Share your account credentials with unauthorized individuals</li>
            <li>Use the App to generate materials for any business other than JM Valley Group locations</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Disclaimer of Warranties</h2>
          <p className={styles.text}>
            The App is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. JM Valley Group does not warrant that the App will be uninterrupted, error-free, or free of viruses or other harmful components. Use of the App is at your own risk.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
          <p className={styles.text}>
            To the fullest extent permitted by law, JM Valley Group shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the App. This includes, without limitation, damages for loss of profits, data, or other intangible losses.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Modifications</h2>
          <p className={styles.text}>
            JM Valley Group reserves the right to modify or discontinue the App at any time, with or without notice. We may also update these Terms of Service from time to time. Continued use of the App after changes constitutes acceptance of the updated terms.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Termination</h2>
          <p className={styles.text}>
            JM Valley Group may terminate or suspend your access to the App at any time, for any reason, without prior notice. Upon termination, your right to use the App will immediately cease.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact Us</h2>
          <p className={styles.text}>
            If you have any questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:chrisr@jmvalley.com">chrisr@jmvalley.com</a>.
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <Image src="/jmvg-logo.png" alt="JM Valley Group" width={56} height={28} style={{ borderRadius: '3px' }} />
          <div className={styles.footerText}>RO <span>Tools</span></div>
        </div>
        <div className={styles.footerRight}>&copy; 2026 RO Tools. Built for Jersey Mike&apos;s Valley operators.</div>
      </footer>
    </>
  );
}
