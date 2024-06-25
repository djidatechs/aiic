function Footer() {
  return (
    
    <footer className="flex flex-col items-center bg-slate-600 text-center text-surface ">

      <div className="w-full bg-slate-600 text-white  mt-auto flex items-center align-middle px-12 justify-between">
          <a
                href="https://facebook.com/profile.php?id=61556815872594"
                type="button"
                className="rounded-full bg-transparent p-3 text-white font-medium uppercase leading-normal text-surface transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-none focus:ring-0 dark:text-white"
                data-twe-ripple-init
          >
            <span className="[&>svg]:h-5 [&>svg]:w-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 320 512">
                <path
                  d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"
                />
              </svg>
            </span>
          </a>
        <a href="https://aiic.djidax.com">© 2024 DJIDAX</a>
        
      </div>
    </footer>
  );
}

export default Footer;
