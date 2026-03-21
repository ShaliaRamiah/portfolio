
/*
   typerwritter effect
    */
const titles = [
    "Software Developer",
    "Backend Developer",
    "Web Developer"
];

let index = 0;
let charIndex = 0;
let currentTitle = "";
let isDeleting = false;

function typeEffect() {
    const element = document.querySelector(".typewriter");
    if (!element) return;
    currentTitle = titles[index];

    if (!isDeleting) {
        element.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentTitle.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1500);
            return;
        }
    } else {
        element.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            index = (index + 1) % titles.length;
        }
    }
    setTimeout(typeEffect, isDeleting ? 50 : 100);
}

typeEffect();

/*
   about tabs
    */
var tablinks   = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(event, tabname) {
    for (let link of tablinks)    link.classList.remove("active-link");
    for (let content of tabcontents) content.classList.remove("active-tab");
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}

/*
   hamburger mobile
    */
const hamburger = document.getElementById("hamburger");
const navMenu   = document.getElementById("nav-menu");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("open");
        navMenu.classList.toggle("open");
    });

    // closing menu when a nav link is clicked
    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("open");
            navMenu.classList.remove("open");
        });
    });
}

/*
   footer, year automatically changes
    */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/*
   forms
    */
const contactForm  = document.getElementById("contact-form");
const submitBtn    = document.getElementById("submit-btn");
const btnText      = document.getElementById("btn-text");
const formSuccess  = document.getElementById("form-success");
const formError    = document.getElementById("form-error");


function validateField(fieldId, errorId, validatorFn) {
    const field     = document.getElementById(fieldId);
    const error     = document.getElementById(errorId);
    const group     = field.closest(".form-group");
    const isValid   = validatorFn(field.value.trim());

    group.classList.toggle("has-error", !isValid);
    return isValid;
}


function validateForm() {
    const nameOk    = validateField("name",    "name-error",    v => v.length > 0);
    const emailOk   = validateField("email",   "email-error",   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    const messageOk = validateField("message", "message-error", v => v.length > 0);
    return nameOk && emailOk && messageOk;
}

if (contactForm) {
    // live validation
    ["name", "email", "message"].forEach(id => {
        const field = document.getElementById(id);
        if (!field) return;
        field.addEventListener("input", () => {
            field.closest(".form-group").classList.remove("has-error");
        });
    });


    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // hides any previous messages
        formSuccess.classList.remove("visible");
        formError.classList.remove("visible");


        if (!validateForm()) return;

        // disabling button during submission
        submitBtn.disabled = true;
        btnText.textContent = "Sending…";

        try {
            const response = await fetch(contactForm.action, {
                method:  "POST",
                headers: { "Accept": "application/json" },
                body:    new FormData(contactForm)
            });

            if (response.ok) {
                // success
                formSuccess.classList.add("visible");
                contactForm.reset();
            } else {
                // server-side error
                formError.classList.add("visible");
            }
        } catch (err) {
            // network error
            formError.classList.add("visible");
        } finally {
            submitBtn.disabled = false;
            btnText.textContent = "Send Message";
        }
    });
}
