"use client";
//imports de app
import { useId, useRef, useState } from "react";
import { toast } from "react-toastify";
//imports propios
import { getContactPath } from "@/enums/SuperVariables";

export default function ContactForm() {
  const modalRef = useRef(null);
  const formId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", email: "", message: "" });
  const [formErrors, setFormErrors] = useState({});

  const openModal = () => {
    modalRef.current?.showModal?.();
  };

  const closeModal = () => {
    modalRef.current?.close?.();
  };

  const validate = () => {
    const nextErrors = {};

    if (!formValues.name.trim()) {
      nextErrors.name = "Please add your name.";
    }

    if (!formValues.email.trim()) {
      nextErrors.email = "Please add your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
      nextErrors.email = "Please enter a valid email.";
    }

    if (!formValues.message.trim()) {
      nextErrors.message = "Please write a message.";
    } else if (formValues.message.trim().length < 10) {
      nextErrors.message = "Message is too short (minimum 10 characters).";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", formValues.name.trim());
      formData.append("email", formValues.email.trim());
      formData.append("message", formValues.message.trim());

      const response = await fetch(getContactPath(), {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(data?.error || "Error contacting, please try again.");
      }

      toast("Message sent successfully. I will get back to you soon.");
      setFormValues({ name: "", email: "", message: "" });
      setFormErrors({});
      closeModal();
    } catch (error) {
      toast.error(error?.message || "Error contacting, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button className='btn' onClick={openModal}>
        Let's Talk(Contact me)
      </button>
      <dialog ref={modalRef} className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <button
            type='button'
            className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
            onClick={closeModal}
            aria-label='Close contact form'
          >
            x
          </button>

          <h3 className='font-bold text-lg'>Hey there, let's talk</h3>
          <p className='mt-1 text-sm opacity-75'>Share your idea and I will reply as soon as possible.</p>

          <form onSubmit={handleSubmit} id={formId} className='mt-4 space-y-3'>
            <div>
              <label htmlFor={`${formId}-name`} className='label'>
                <span className='label-text font-semibold'>Name</span>
              </label>
              <input
                id={`${formId}-name`}
                type='text'
                name='name'
                className='input input-bordered w-full'
                value={formValues.name}
                onChange={handleChange}
                required
              />
              {formErrors.name ? <p className='mt-1 text-xs text-error'>{formErrors.name}</p> : null}
            </div>

            <div>
              <label htmlFor={`${formId}-email`} className='label'>
                <span className='label-text font-semibold'>E-mail</span>
              </label>
              <input
                id={`${formId}-email`}
                type='email'
                name='email'
                className='input input-bordered w-full'
                value={formValues.email}
                onChange={handleChange}
                required
              />
              {formErrors.email ? <p className='mt-1 text-xs text-error'>{formErrors.email}</p> : null}
            </div>

            <div>
              <label htmlFor={`${formId}-message`} className='label'>
                <span className='label-text font-semibold'>Message</span>
              </label>
              <textarea
                id={`${formId}-message`}
                name='message'
                rows='6'
                placeholder='How can I help you?'
                className='textarea textarea-bordered w-full'
                value={formValues.message}
                onChange={handleChange}
                required
              />
              <div className='mt-1 flex items-center justify-between text-xs opacity-70'>
                <span>{formErrors.message || "Minimum 10 characters."}</span>
                <span>{formValues.message.trim().length} chars</span>
              </div>
            </div>

            <div className='modal-action mt-2'>
              <button type='button' className='btn btn-ghost' onClick={closeModal} disabled={isSubmitting}>
                Cancel
              </button>
              <button className='btn btn-primary' type='submit' disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
