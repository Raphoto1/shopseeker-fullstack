//imports propios
import ContactForm from "../contact/ContactForm";

export default function Footer() {
  return (
    <>
      <footer className='footer items-center p-4 bg-neutral text-neutral-content'>
        <aside className="items-center grid-flow-col">
          <p>Rafael Martinez 2025 - All right reserved</p> 
        </aside>
        <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <ContactForm />
        </div>
      </footer>
    </>
  );
}
