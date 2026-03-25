'use strict';

/*
   typewriter effect
    */
const titles = [
    "Software Developer",
    "Backend Developer",
    "Web Developer"
];

let titleIndex = 0;
let charIndex = 0;
let currentTitle = "";
let isDeleting = false;

function typeEffect() {
    const element = document.querySelector(".typewriter");
    if (!element) return;

    currentTitle = titles[titleIndex];

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
            titleIndex = (titleIndex + 1) % titles.length;
        }
    }
    setTimeout(typeEffect, isDeleting ? 50 : 100);
}

typeEffect();

/*
   about tabs
    */
const tabLinks = document.getElementsByClassName("tab-links");
const tabContents = document.getElementsByClassName("tab-contents");

function openTab(event, tabName) {
    for (let link of tabLinks) {
        link.classList.remove("active-link");
    }
    for (let content of tabContents) {
        content.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabName).classList.add("active-tab");
}

/*
   hamburger mobile
    */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

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
const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

/*
   forms
    */
const contactForm = document.getElementById("contact-form");
const submitButton = document.getElementById("submit-btn");
const buttonText = document.getElementById("btn-text");
const formSuccess = document.getElementById("form-success");
const formError = document.getElementById("form-error");

function validateField(fieldId, errorId, validatorFn) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    const group = field.closest(".form-group");
    const isValid = validatorFn(field.value.trim());

    group.classList.toggle("has-error", !isValid);
    return isValid;
}

function validateForm() {
    const nameValid = validateField("name", "name-error", value => value.length > 0);
    const emailValid = validateField("email", "email-error", value =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    );
    const messageValid = validateField("message", "message-error", value => value.length > 0);
    return nameValid && emailValid && messageValid;
}

if (contactForm) {
    // live validation
    ["name", "email", "message"].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;
        field.addEventListener("input", () => {
            field.closest(".form-group").classList.remove("has-error");
        });
    });

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // hides any previous messages
        formSuccess.classList.remove("visible");
        formError.classList.remove("visible");

        if (!validateForm()) return;

        // disabling button during submission
        submitButton.disabled = true;
        buttonText.textContent = "Sending…";

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                headers: { "Accept": "application/json" },
                body: new FormData(contactForm)
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
            submitButton.disabled = false;
            buttonText.textContent = "Send Message";
        }
    });
}
