import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const contactRef = useRef(null);
  const formRef = useRef(null);
  const socialRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Create GSAP animations for the contact section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: contactRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      }
    });

    // Main section animation
    tl.fromTo(
      contactRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    // Form animation with staggered fields
    gsap.fromTo(
      formRef.current.querySelectorAll('input, textarea, button'),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );

    // Social links animation
    gsap.fromTo(
      socialRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: socialRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      }
    );

    // Parallax effect for the background
    gsap.to(contactRef.current, {
      backgroundPosition: '50% 0%',
      ease: 'none',
      scrollTrigger: {
        trigger: contactRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    // We don't prevent default here to allow the mailto to work
    setIsSubmitting(true);
    
    // Show success message
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after email client opens
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setSubmitSuccess(false);
      }, 3000);
    }, 500);
  };

  // Create the mailto link with the form data
  const mailtoLink = `mailto:aary742006@gmail.com?subject=Message from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
  )}`;

  return (
    <section 
      id="contact" 
      ref={contactRef}
      className="py-24 relative bg-ctp-crust bg-opacity-90"
      style={{ 
        backgroundImage: 'radial-gradient(circle, rgba(156, 160, 176, 0.1) 0%, rgba(30, 32, 48, 0) 70%)',
        backgroundSize: '120% 120%',
        backgroundPosition: '50% 50%'
      }}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-bold text-ctp-text mb-8 text-center">
          Get In <span className="text-ctp-mauve">Touch</span>
        </h2>
        <p className="text-ctp-subtext0 text-center mb-12 max-w-2xl mx-auto">
          Feel free to reach out for collaborations, opportunities, or just to say hello!
        </p>

        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          {/* Contact Form */}
          <div className="w-full md:w-2/3" ref={formRef}>
            <form 
              action={mailtoLink}
              method="post"
              encType="text/plain"
              onSubmit={handleSubmit}
              className="bg-ctp-mantle p-6 md:p-8 rounded-lg shadow-lg"
            >
              <div className="mb-6">
                <label htmlFor="name" className="block text-ctp-subtext1 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md bg-ctp-surface0 border border-ctp-overlay0 focus:outline-none focus:border-ctp-lavender focus:ring-1 focus:ring-ctp-lavender text-ctp-text"
                  placeholder="Your Name"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-ctp-subtext1 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md bg-ctp-surface0 border border-ctp-overlay0 focus:outline-none focus:border-ctp-lavender focus:ring-1 focus:ring-ctp-lavender text-ctp-text"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-ctp-subtext1 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-md bg-ctp-surface0 border border-ctp-overlay0 focus:outline-none focus:border-ctp-lavender focus:ring-1 focus:ring-ctp-lavender text-ctp-text resize-none"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-md transition-all duration-300 ease-in-out ${
                  isSubmitting 
                    ? 'bg-ctp-overlay0 cursor-not-allowed' 
                    : 'bg-ctp-mauve hover:bg-ctp-pink text-ctp-base hover:shadow-lg'
                }`}
              >
                {isSubmitting ? 'Opening Email Client...' : 'Send Message'}
              </button>
              
              {submitSuccess && (
                <div className="mt-4 p-3 bg-ctp-green bg-opacity-20 border border-ctp-green text-ctp-green rounded-md">
                  Email client opened! Complete sending from your email application.
                </div>
              )}
            </form>
          </div>
          
          {/* Contact Info */}
          <div className="w-full md:w-1/3" ref={socialRef}>
            <div className="bg-ctp-mantle p-6 md:p-8 rounded-lg shadow-lg h-full">
              <h3 className="text-2xl font-semibold text-ctp-lavender mb-6">Connect With Me</h3>
              
              <div className="space-y-6">
                <div className="group">
                  <h4 className="text-lg font-medium text-ctp-subtext1 mb-2">LinkedIn</h4>
                  <a 
                    href="https://www.linkedin.com/in/aary-hinge-21118b35b/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-ctp-blue transition-all duration-300 hover:text-ctp-lavender"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="group-hover:underline">Aary Hinge</span>
                  </a>
                </div>
                
                <div className="group">
                  <h4 className="text-lg font-medium text-ctp-subtext1 mb-2">Email</h4>
                  <a 
                    href="mailto:aary742006@gmail.com" 
                    className="flex items-center text-ctp-blue transition-all duration-300 hover:text-ctp-lavender"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="group-hover:underline">aary742006@gmail.com</span>
                  </a>
                </div>
                
                <div className="group">
                  <h4 className="text-lg font-medium text-ctp-subtext1 mb-2">Location</h4>
                  <div className="flex items-center text-ctp-subtext1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-ctp-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>India</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-ctp-surface0">
                <h4 className="text-lg font-medium text-ctp-subtext1 mb-4">Let's Connect</h4>
                <p className="text-ctp-subtext0 mb-4">
                  Looking for opportunities to collaborate on exciting projects!
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="https://github.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ctp-subtext0 hover:text-ctp-lavender transition-colors duration-300"
                    aria-label="GitHub"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ctp-subtext0 hover:text-ctp-blue transition-colors duration-300"
                    aria-label="Twitter"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.059 10.059 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ctp-subtext0 hover:text-ctp-pink transition-colors duration-300"
                    aria-label="Instagram"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;