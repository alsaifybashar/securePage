import React, { useState } from 'react';
import { sanitizeInput, validateInput } from '../utils/security';
import { submitLead } from '../services/api';
import PrivacyPolicyModal from './PrivacyPolicyModal';

const ContactSection = () => {
    const [focused, setFocused] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        jobTitle: '',
        message: '', // How can we help you
        privacyAgreed: false
    });
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;

        // Validation Logic
        let isValid = true;
        let errorMessage = '';

        if (type !== 'checkbox') {
            if (['firstName', 'lastName', 'company', 'jobTitle'].includes(name) && !validateInput(value, 'no-sql')) {
                isValid = false;
                errorMessage = 'Invalid input: Potential injection detected.';
            }
            if (name === 'email' && !validateInput(value, 'no-command')) {
                isValid = false;
                errorMessage = 'Invalid email format.';
            }
            if (name === 'message' && !validateInput(value, 'no-sql')) {
                isValid = false;
                errorMessage = 'Security Alert: Malicious pattern detected.';
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
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        // Required fields check
        const requiredFields = ['firstName', 'lastName', 'company', 'jobTitle', 'message'];
        const emptyFields = requiredFields.some(field => !formData[field]) || !formData.email;
        const hasErrors = Object.keys(errors).length > 0;

        if (!formData.privacyAgreed) {
            setErrors(prev => ({ ...prev, privacyAgreed: 'You must agree to the privacy policy.' }));
            setIsSubmitting(false);
            return;
        }

        if (hasErrors || emptyFields) {
            setSubmitStatus('error');
            setIsSubmitting(false);
            return;
        }

        try {
            // Sanitization
            const cleanData = {
                firstName: sanitizeInput(formData.firstName),
                lastName: sanitizeInput(formData.lastName),
                email: sanitizeInput(formData.email),
                company: sanitizeInput(formData.company),
                jobTitle: sanitizeInput(formData.jobTitle),
                message: sanitizeInput(formData.message),
                privacyAgreed: formData.privacyAgreed
            };

            await submitLead(cleanData);

            setSubmitStatus('success');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                company: '',
                jobTitle: '',
                message: '',
                privacyAgreed: false
            });
        } catch (err) {
            console.error('Lead submission error:', err);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to check if form is valid for "Send" button text
    const isFormFilled = formData.firstName && formData.lastName && formData.email &&
        formData.company && formData.jobTitle && formData.message && formData.privacyAgreed;

    return (
        <div className="contact-wrapper">
            <PrivacyPolicyModal
                isOpen={isPrivacyModalOpen}
                onClose={() => setIsPrivacyModalOpen(false)}
            />

            <div className="contact-header">
                <h2>Secure Your <span className="text-gradient">Future</span></h2>
                <p>Ready to turn vulnerability into strength?</p>
            </div>

            <form className="secure-form glass-panel" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className={`input-group ${focused === 'firstName' ? 'focused' : ''} ${errors.firstName ? 'error' : ''}`}>
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            onFocus={() => setFocused('firstName')}
                            onBlur={() => setFocused(null)}
                            placeholder="Jane"
                            className={errors.firstName ? 'input-error' : ''}
                            maxLength={50}
                        />
                    </div>

                    <div className={`input-group ${focused === 'lastName' ? 'focused' : ''} ${errors.lastName ? 'error' : ''}`}>
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            onFocus={() => setFocused('lastName')}
                            onBlur={() => setFocused(null)}
                            placeholder="Doe"
                            className={errors.lastName ? 'input-error' : ''}
                            maxLength={50}
                        />
                    </div>
                </div>

                <div className={`input-group ${focused === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''}`}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        placeholder="jane.doe@company.com"
                        className={errors.email ? 'input-error' : ''}
                        maxLength={100}
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>

                <div className="form-row">
                    <div className={`input-group ${focused === 'company' ? 'focused' : ''} ${errors.company ? 'error' : ''}`}>
                        <label>Company</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            onFocus={() => setFocused('company')}
                            onBlur={() => setFocused(null)}
                            placeholder="Acme Corp"
                            className={errors.company ? 'input-error' : ''}
                            maxLength={100}
                        />
                    </div>

                    <div className={`input-group ${focused === 'jobTitle' ? 'focused' : ''} ${errors.jobTitle ? 'error' : ''}`}>
                        <label>Job Title</label>
                        <input
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            onFocus={() => setFocused('jobTitle')}
                            onBlur={() => setFocused(null)}
                            placeholder="CISO"
                            className={errors.jobTitle ? 'input-error' : ''}
                            maxLength={100}
                        />
                    </div>
                </div>

                <div className={`input-group ${focused === 'message' ? 'focused' : ''} ${errors.message ? 'error' : ''}`}>
                    <label>How can we help you</label>
                    <textarea
                        rows="4"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocused('message')}
                        onBlur={() => setFocused(null)}
                        placeholder="Tell us about your security needs..."
                        className={errors.message ? 'input-error' : ''}
                        maxLength={1000}
                    ></textarea>
                    {errors.message && <span className="error-msg">{errors.message}</span>}
                </div>

                <div className="checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="privacyAgreed"
                            checked={formData.privacyAgreed}
                            onChange={handleChange}
                        />
                        <span className="checkbox-custom"></span>
                        <span className="label-text">
                            I agree that the data is handled according to the <button type="button" className="text-link" onClick={() => setIsPrivacyModalOpen(true)}>privacy policy*</button>
                        </span>
                    </label>
                    {errors.privacyAgreed && <span className="error-msg">{errors.privacyAgreed}</span>}
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    <span>
                        {isSubmitting
                            ? 'Sending...'
                            : isFormFilled
                                ? 'Send'
                                : 'Contact'
                        }
                    </span>
                    <div className="btn-highlight"></div>
                </button>

                {submitStatus === 'success' && (
                    <div className="status-msg success">
                        Message Sent Successfully.
                    </div>
                )}
                {submitStatus === 'error' && (
                    <div className="status-msg error">
                        Request Aborted. Please check fields.
                    </div>
                )}

                <div className="security-footer">
                    <span>End-to-End Encrypted</span>
                </div>
            </form>

            <style>{`
                .contact-wrapper {
                    max-width: 700px;
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
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
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
                
                input[type="text"], 
                input[type="email"], 
                textarea {
                    background: var(--card-surface);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-sm);
                    padding: 1rem;
                    color: var(--text-main);
                    font-family: var(--font-main);
                    transition: all 0.3s ease;
                    width: 100%;
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

                /* Checkbox Styling */
                .checkbox-group {
                    margin-top: 0.5rem;
                }
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    gap: 0.8rem;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    position: relative;
                }
                .checkbox-label input {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                    height: 0;
                    width: 0;
                }
                .checkbox-custom {
                    height: 20px;
                    width: 20px;
                    background-color: var(--card-surface);
                    border: 1px solid var(--card-border);
                    border-radius: 4px;
                    display: inline-block;
                    position: relative;
                    transition: all 0.2s;
                }
                .checkbox-label:hover .checkbox-custom {
                    border-color: var(--accent-primary);
                }
                .checkbox-label input:checked ~ .checkbox-custom {
                    background-color: var(--accent-primary);
                    border-color: var(--accent-primary);
                }
                .checkbox-custom:after {
                    content: "";
                    position: absolute;
                    display: none;
                    left: 6px;
                    top: 2px;
                    width: 6px;
                    height: 11px;
                    border: solid var(--bg-darker);
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }
                .checkbox-label input:checked ~ .checkbox-custom:after {
                    display: block;
                }
                
                .text-link {
                    background: none;
                    border: none;
                    padding: 0;
                    margin: 0;
                    color: var(--accent-primary);
                    text-decoration: underline;
                    cursor: pointer;
                    font-size: inherit;
                    font-family: inherit;
                }
                .text-link:hover {
                    color: var(--text-main);
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
                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                .security-footer {
                    display: flex;
                    justify-content: center;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    margin-top: 1rem;
                }

                .input-error {
                    border-color: #ef4444 !important;
                    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
                }
                .error-msg {
                    color: #ef4444;
                    font-size: 0.75rem;
                    margin-top: 0.25rem;
                    display: block;
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

                @media (max-width: 768px) {
                    .contact-wrapper {
                        padding: 0;
                    }
                    .contact-header h2 {
                        font-size: 2rem;
                    }
                    .secure-form {
                        padding: 1.5rem;
                    }
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    input[type="text"], 
                    input[type="email"], 
                    textarea {
                        padding: 0.875rem;
                        font-size: 16px; /* Prevents zoom on iOS */
                    }
                    .checkbox-label {
                        font-size: 0.85rem;
                        align-items: flex-start;
                    }
                    .label-text {
                        line-height: 1.4;
                    }
                }

                @media (max-width: 480px) {
                    .contact-header h2 {
                        font-size: 1.75rem;
                    }
                    .secure-form {
                        padding: 1.25rem;
                        gap: 1rem;
                    }
                    .submit-btn {
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ContactSection;
