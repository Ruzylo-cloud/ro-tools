import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Privacy Policy | RO Tools',
  description: 'Privacy Policy for RO Tools by JM Valley Group.',
};

export default function PrivacyPolicy() {
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
        <h1 className={styles.pageTitle}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: March 26, 2026</p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Introduction</h2>
          <p className={styles.text}>
            RO Tools (&quot;the App&quot;) is an internal business tool built and operated by JM Valley Group (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). This Privacy Policy explains how we collect, use, and protect your information when you use the App.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Information We Collect</h2>
          <p className={styles.text}>When you sign in and use RO Tools, we collect the following information:</p>
          <ul className={styles.list}>
            <li>Google account information (name and email address) provided through Google OAuth sign-in</li>
            <li>Store profile data you enter, including store number, address, phone numbers, and team member names</li>
            <li>Your assigned role within the application (Operator, District Manager, or Administrator)</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
          <p className={styles.text}>We use the information we collect to:</p>
          <ul className={styles.list}>
            <li>Authenticate your identity and restrict access to authorized @jmvalley.com users</li>
            <li>Auto-fill your store details into branded documents such as catering flyers and marketing materials</li>
            <li>Manage store profiles and user roles within the application</li>
            <li>Generate professional, print-ready documents for your business operations</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Google API Data</h2>
          <p className={styles.text}>
            RO Tools accesses Google Drive, Google Sheets, and Google Docs via user-authorized OAuth tokens. We only read and write files that you explicitly authorize through the Google consent flow. We do not access any Google data beyond what is required for the App&apos;s functionality.
          </p>
          <p className={styles.text} style={{ marginTop: '12px' }}>
            RO Tools&apos; use and transfer of information received from Google APIs adheres to the{' '}
            <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Storage &amp; Security</h2>
          <p className={styles.text}>
            All data is stored on Google Cloud Platform infrastructure located in the United States. Data is encrypted at rest and in transit. Access to stored data is restricted to authenticated, authorized users only. We implement industry-standard security measures to protect your information.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Sharing</h2>
          <p className={styles.text}>
            We do not sell, trade, or rent your personal information to third parties. Your data is used solely for the internal business purposes described in this policy. We may share data only as required by law or to protect the rights and safety of JM Valley Group.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Retention</h2>
          <p className={styles.text}>
            We retain your data for as long as your account remains active and you are associated with JM Valley Group. If you leave the organization or request deletion of your data, we will remove your information within a reasonable timeframe.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Changes to This Policy</h2>
          <p className={styles.text}>
            We may update this Privacy Policy from time to time. Any changes will be reflected by the &quot;Last updated&quot; date at the top of this page. Continued use of the App after changes constitutes acceptance of the updated policy.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact Us</h2>
          <p className={styles.text}>
            If you have any questions about this Privacy Policy or your data, please contact us at{' '}
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
