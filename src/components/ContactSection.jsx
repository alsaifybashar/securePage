import React, { useState } from 'react';

const ContactSection = () => {
    const [focused, setFocused] = useState(null);

    return (
        <div className="contact-wrapper">
            <div className="contact-header">
                <h2>Secure Your <span className="text-gradient">Future</span></h2>
                <p>Ready to turn vulnerability into strength? Initialize a secure channel below.</p>
            </div>

            <form className="secure-form glass-panel" onSubmit={(e) => e.preventDefault()}>
                <div className={`input-group ${focused === 'name' ? 'focused' : ''}`}>
                    <label>Identification</label>
                    <input
                        type="text"
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        placeholder="Name / Organization"
                    />
                </div>

                <div className={`input-group ${focused === 'email' ? 'focused' : ''}`}>
                    <label>Comms Endpoint</label>
                    <input
                        type="email"
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        placeholder="name@company.com"
                    />
                </div>

                <div className={`input-group ${focused === 'msg' ? 'focused' : ''}`}>
                    <label>Transmission Payload</label>
                    <textarea
                        rows="4"
                        onFocus={() => setFocused('msg')}
                        onBlur={() => setFocused(null)}
                        placeholder="Describe your security needs..."
                    ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                    <span>Initiate Uplink</span>
                    <div className="btn-highlight"></div>
                </button>

                <div className="security-footer">
                    <span>🔒 End-to-End Encrypted</span>
                    <span>256-bit AES</span>
                </div>
            </form>

            <style>{`
                .contact-wrapper {
                    max-width: 600px;
                    margin: 0 auto;
                }
                .contact-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }
                .contact-header h2 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }
                
                .secure-form {
                    padding: 3rem;
                    border-radius: var(--radius-lg);
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    position: relative;
                }
                .input-group label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: var(--text-muted);
                    transition: color 0.3s;
                }
                .input-group.focused label {
                    color: var(--accent-primary);
                }
                
                input, textarea {
                    background: rgba(0,0,0,0.2);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-sm);
                    padding: 1rem;
                    color: #fff;
                    font-family: var(--font-main);
                    transition: all 0.3s ease;
                }
                input:focus, textarea:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                    background: rgba(16, 185, 129, 0.05);
                    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
                }
                
                .submit-btn {
                    margin-top: 1rem;
                    background: var(--text-main);
                    color: #000;
                    border: none;
                    padding: 1.2rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.2s;
                }
                .submit-btn:hover {
                    transform: scale(1.02);
                }
                .btn-highlight {
                    position: absolute;
                    top: 0; left: -100%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
                    transition: left 0.5s;
                }
                .submit-btn:hover .btn-highlight {
                    left: 100%;
                }
                
                .security-footer {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    margin-top: 1rem;
                }
            `}</style>
        </div>
    );
};

export default ContactSection;
