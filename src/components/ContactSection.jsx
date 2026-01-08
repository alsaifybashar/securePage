import React, { useState } from 'react';
import { sanitizeInput, validateInput } from '../utils/security';
import { submitLead } from '../services/api';

const ContactSection = () => {
    const [focused, setFocused] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Real-time security validation
        let isValid = true;
        let errorMessage = '';

        if (name === 'name' && !validateInput(value, 'no-sql')) {
            isValid = false;
            errorMessage = 'Pattern Rejected: Potential SQL Injection detected.';
        }
        if (name === 'email' && !validateInput(value, 'no-command')) {
            isValid = false;
            errorMessage = 'Pattern Rejected: Illegal characters detected.';
        }
        if (name === 'message' && !validateInput(value, 'no-sql')) {
            isValid = false;
            errorMessage = 'Security Alert: Malicious pattern detected in payload.';
        }

        if (!isValid) {
            setErrors(prev => ({ ...prev, [name]: errorMessage }));
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        // Final Security Check
        const hasErrors = Object.keys(errors).length > 0;
        const emptyFields = !formData.name || !formData.email || !formData.message;

        if (hasErrors || emptyFields) {
            setSubmitStatus('error');
            setIsSubmitting(false);
            return;
        }

        try {
            // Sanitization before sending
            const cleanData = {
                name: sanitizeInput(formData.name),
                email: sanitizeInput(formData.email),
                message: sanitizeInput(formData.message)
            };

            // Submit to backend API
            await submitLead(cleanData);

            setSubmitStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            console.error('Lead submission error:', err);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-wrapper">
            <div className="contact-header">
                <h2>Secure Your <span className="text-gradient">Future</span></h2>
                <p>Ready to turn vulnerability into strength? Initialize a secure channel below.</p>
            </div>

            <form className="secure-form glass-panel" onSubmit={handleSubmit}>
                <div className={`input-group ${focused === 'name' ? 'focused' : ''} ${errors.name ? 'error' : ''}`}>
                    <label>Identification</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        placeholder="Name / Organization"
                        className={errors.name ? 'input-error' : ''}
                    />
                    {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>

                <div className={`input-group ${focused === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''}`}>
                    <label>Comms Endpoint</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        placeholder="name@company.com"
                        className={errors.email ? 'input-error' : ''}
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>

                <div className={`input-group ${focused === 'message' ? 'focused' : ''} ${errors.message ? 'error' : ''}`}>
                    <label>Transmission Payload</label>
                    <textarea
                        rows="4"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocused('message')}
                        onBlur={() => setFocused(null)}
                        placeholder="Describe your security needs..."
                        className={errors.message ? 'input-error' : ''}
                    ></textarea>
                    {errors.message && <span className="error-msg">{errors.message}</span>}
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    <span>{isSubmitting ? 'Encrypted Upload...' : 'Initiate Uplink'}</span>
                    <div className="btn-highlight"></div>
                </button>

                {submitStatus === 'success' && (
                    <div className="status-msg success">
                        Transmission Securely Received.
                    </div>
                )}
                {submitStatus === 'error' && (
                    <div className="status-msg error">
                        Security Protocol Violation Detected. Request Aborted.
                    </div>
                )}

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
                    background: var(--card-surface);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-sm);
                    padding: 1rem;
                    color: var(--text-main);
                    font-family: var(--font-main);
                    transition: all 0.3s ease;
                }
                input::placeholder, textarea::placeholder {
                    color: var(--text-muted);
                }
                input:focus, textarea:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                    background: var(--card-surface);
                    box-shadow: 0 0 0 4px var(--accent-glow);
                }
                
                .submit-btn {
                    margin-top: 1rem;
                    background: var(--text-main);
                    color: var(--bg-darker);
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

                /* Validation Styles */
                .input-error {
                    border-color: #ef4444 !important; /* Red 500 */
                    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
                }
                .error-msg {
                    color: #ef4444;
                    font-size: 0.75rem;
                    margin-top: -0.25rem;
                    animation: fadeIn 0.3s ease;
                }
                .status-msg {
                    padding: 1rem;
                    border-radius: var(--radius-sm);
                    margin-top: 1rem;
                    font-size: 0.9rem;
                    text-align: center;
                    animation: fadeIn 0.5s ease;
                }
                .status-msg.success {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }
                .status-msg.error {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }
            `}</style>
        </div>
    );
};

export default ContactSection;
