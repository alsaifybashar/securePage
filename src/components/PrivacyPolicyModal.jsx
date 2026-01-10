import React from 'react';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="privacy-modal-overlay" onClick={onClose}>
            <div className="privacy-modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <div className="privacy-header">
                    <h3>Privacy Notice – Early Access to SECUREPENT</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="privacy-body">
                    <section>
                        <h4>Data controller</h4>
                        <p>SECUREPENT AB, [company registration number], with registered office in [city], Sweden (“we”, “us”).</p>
                    </section>

                    <section>
                        <h4>What data we collect</h4>
                        <p>When you submit the early access form, we collect and process:</p>
                        <ul>
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Company</li>
                            <li>Job role</li>
                            <li>Any information you provide in the free-text fields</li>
                            <li>Your preferences regarding updates and communication</li>
                        </ul>
                    </section>

                    <section>
                        <h4>For what purposes and on what legal bases we use your data</h4>

                        <h5>Managing your early access request</h5>
                        <ul>
                            <li>To register your interest in SECUREPENT</li>
                            <li>To communicate with you about early access, onboarding and related product information</li>
                            <li>To understand our target audience and improve the product</li>
                        </ul>
                        <p className="legal-basis">Legal basis: our legitimate interest in responding to your request and developing our services (Art. 6(1)(f) GDPR).</p>

                        <h5>Sending ongoing updates and marketing (only if you opt in to “Subscribe to updates”)</h5>
                        <ul>
                            <li>To send product news, invitations, and other marketing communications not strictly necessary for handling your early access request</li>
                        </ul>
                        <p className="legal-basis">Legal basis: your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time by using the unsubscribe link or contacting us.</p>
                        <p>We do not sell your data or share it with third parties for their own marketing.</p>
                    </section>

                    <section>
                        <h4>Processors and transfers</h4>
                        <p>We may use technical service providers (for example hosting, CRM, analytics and form tools) that process personal data on our behalf as data processors, under data processing agreements. Some providers may be located outside the EU/EEA; in those cases we ensure appropriate safeguards, such as Standard Contractual Clauses.</p>
                    </section>

                    <section>
                        <h4>Retention</h4>
                        <p>We keep your data only as long as necessary for the purposes above:</p>
                        <ul>
                            <li>Data related to your early access request is normally stored for up to 24 months after your last interaction with us, unless a longer period is required by law or clearly justified (for example if you become a customer).</li>
                            <li>If you have given consent to updates/marketing, we keep your contact details for that purpose until you withdraw your consent or we no longer send such communications.</li>
                        </ul>
                    </section>

                    <section>
                        <h4>Your rights</h4>
                        <p>Under GDPR you have the right to:</p>
                        <ul>
                            <li>Request access to your personal data</li>
                            <li>Request rectification of inaccurate data</li>
                            <li>Request erasure or restriction of processing</li>
                            <li>Object to processing based on legitimate interests</li>
                            <li>Withdraw your consent at any time (for communications based on consent)</li>
                            <li>Receive your data in a portable format, where applicable</li>
                        </ul>
                        <p>To exercise these rights, contact us at <a href="mailto:privacy@securepent.com">privacy@securepent.com</a>.</p>
                        <p>You also have the right to lodge a complaint with your local supervisory authority. In Sweden this is the Swedish Authority for Privacy Protection (IMY).</p>
                    </section>
                </div>
            </div>

            <style>{`
                .privacy-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(5px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                }

                .privacy-modal-content {
                    width: 90%;
                    max-width: 800px;
                    max-height: 85vh;
                    background: var(--bg-dark);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-md);
                    display: flex;
                    flex-direction: column;
                    animation: slideUp 0.3s ease;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .privacy-header {
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid var(--glass-stroke);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--bg-darker);
                    border-radius: var(--radius-md) var(--radius-md) 0 0;
                }

                .privacy-header h3 {
                    margin: 0;
                    color: var(--text-main);
                    font-size: 1.25rem;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: 2rem;
                    line-height: 1;
                    cursor: pointer;
                    transition: color 0.2s;
                }

                .close-btn:hover {
                    color: var(--accent-primary);
                }

                .privacy-body {
                    padding: 2rem;
                    overflow-y: auto;
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                    line-height: 1.6;
                }

                /* Custom Scrollbar */
                .privacy-body::-webkit-scrollbar {
                    width: 8px;
                }
                .privacy-body::-webkit-scrollbar-track {
                    background: var(--bg-dark);
                }
                .privacy-body::-webkit-scrollbar-thumb {
                    background: var(--card-border);
                    border-radius: 4px;
                }
                .privacy-body::-webkit-scrollbar-thumb:hover {
                    background: var(--accent-primary);
                }

                .privacy-body section {
                    margin-bottom: 2rem;
                }

                .privacy-body h4 {
                    color: var(--text-main);
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                    border-left: 3px solid var(--accent-primary);
                    padding-left: 1rem;
                }

                .privacy-body h5 {
                    color: var(--text-main);
                    font-size: 1rem;
                    margin: 1.5rem 0 0.5rem;
                }

                .privacy-body ul {
                    margin: 1rem 0;
                    padding-left: 1.5rem;
                }

                .privacy-body li {
                    margin-bottom: 0.5rem;
                }

                .legal-basis {
                    font-style: italic;
                    color: var(--text-muted);
                    background: rgba(255, 255, 255, 0.03);
                    padding: 0.75rem;
                    border-radius: 4px;
                    border-left: 2px solid var(--text-muted);
                }

                .privacy-body a {
                    color: var(--accent-primary);
                    text-decoration: none;
                }

                .privacy-body a:hover {
                    text-decoration: underline;
                }

                @media (max-width: 600px) {
                    .privacy-body {
                        padding: 1.5rem;
                    }
                    .privacy-header {
                        padding: 1rem 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default PrivacyPolicyModal;
