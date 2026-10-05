/* =========================
   MOBILE MENU
========================= */

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

if (menuBtn && navbar) {
    menuBtn.addEventListener("click", () => {
        navbar.classList.toggle("show");

        const icon = menuBtn.querySelector("i");

        if (icon) {
            if (navbar.classList.contains("show")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        }
    });
}


/* =========================
   CLOSE MOBILE MENU
========================= */

document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {

        if (navbar) {
            navbar.classList.remove("show");
        }

        const icon = menuBtn?.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    });
});

/* =========================
   APPOINTMENT FORM
   GOOGLE SHEETS / APPS SCRIPT
========================= */

const APPOINTMENT_WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbx4nulp2Wj4UqFPK5_7XxMqN9S6n2iTXlgg961SjmZyTJoupypVb5r_PgKhogiqPW1J4Q/exec";

const appointmentForm =
    document.getElementById("appointmentForm");

const successMessage =
    document.getElementById("successMessage");

const closeMessage =
    document.getElementById("closeMessage");


if (appointmentForm) {

    appointmentForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name")?.value.trim();

        const phone =
            document.getElementById("phone")?.value.trim();

        const preferredDate =
            document.getElementById("date")?.value;

        const service =
            document.getElementById("service")?.value;

        const message =
            document.getElementById("message")?.value.trim() || "";


        /* =========================
           VALIDATION
        ========================= */

        if (!name || !phone || !preferredDate || !service) {

            alert("Please fill in all required fields.");

            return;
        }


        /* Indian mobile number */

        const phoneRegex =
            /^[6-9]\d{9}$/;

        if (!phoneRegex.test(phone)) {

            alert(
                "Please enter a valid 10-digit Indian mobile number."
            );

            return;
        }


        /* =========================
           SUBMIT BUTTON
        ========================= */

        const submitButton =
            appointmentForm.querySelector(
                'button[type="submit"]'
            );

        const originalButtonText =
            submitButton
                ? submitButton.innerHTML
                : "Book Appointment";


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.innerHTML =
                "Booking...";
        }


        /* =========================
           SEND TO GOOGLE APPS SCRIPT
        ========================= */

        try {

            const response =
                await fetch(
                    APPOINTMENT_WEB_APP_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body: JSON.stringify({

                            type: "appointment",

                            name: name,

                            phone: phone,

                            preferredDate:
                                preferredDate,

                            service: service,

                            message: message

                        })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Server error: " +
                    response.status
                );
            }


            const result =
                await response.json();


            console.log(
                "Appointment response:",
                result
            );


            /* =========================
               SUCCESS
            ========================= */

            if (result.success) {

                appointmentForm.reset();


                if (successMessage) {

                    successMessage.classList.add(
                        "show"
                    );

                    successMessage.style.display =
                        "flex";
                }


                setTimeout(() => {

                    if (successMessage) {

                        successMessage.classList.remove(
                            "show"
                        );

                        successMessage.style.display =
                            "none";
                    }

                }, 5000);


            } else {

                alert(
                    result.error ||
                    "Unable to book your appointment right now."
                );
            }


        } catch (error) {

            console.error(
                "Appointment error:",
                error
            );


            alert(
                "Unable to connect to the appointment service. Please try again."
            );


        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerHTML =
                    originalButtonText;
            }
        }

    });
}
/* =========================
   CLOSE SUCCESS MESSAGE
========================= */

if (closeMessage && successMessage) {

    closeMessage.addEventListener("click", () => {

        successMessage.classList.remove("show");

    });
}


/* =========================
   SET MINIMUM DATE
========================= */

const dateInput =
    document.getElementById("date");

if (dateInput) {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    dateInput.min =
        `${year}-${month}-${day}`;
}


/* =========================
   ACTIVE NAV LINK
========================= */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(
        ".navbar a[href^='#']"
    );


window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {

            current =
                section.getAttribute("id");
        }
    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${current}`
        ) {

            link.classList.add("active");
        }
    });

});


/* =========================
   COUNTER ANIMATION
========================= */

const counters =
    document.querySelectorAll(".counter");


if (counters.length > 0) {

    const counterObserver =
        new IntersectionObserver(

            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        const counter =
                            entry.target;


                        /* Already started */

                        if (
                            counter.dataset.counted ===
                            "true"
                        ) {

                            return;
                        }


                        counter.dataset.counted =
                            "true";


                        const target =
                            Number(
                                counter.dataset.target
                            );


                        let count = 0;


                        const updateCounter = () => {

                            if (count < target) {

                                count++;

                                counter.textContent =
                                    count;

                                setTimeout(
                                    updateCounter,
                                    60
                                );

                            } else {

                                counter.textContent =
                                    target;
                            }
                        };


                        updateCounter();


                        counterObserver.unobserve(
                            counter
                        );
                    }
                });
            },

            {
                threshold: 0.5
            }
        );


    counters.forEach(counter => {

        counterObserver.observe(counter);

    });
}


/* =========================
   TYPEWRITER TITLE
========================= */

const title =
    document.querySelector(".typewriter-title");


if (title) {

    const observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        title.classList.add(
                            "typing"
                        );

                        observer.unobserve(
                            title
                        );
                    }
                });
            },

            {
                threshold: 0.5
            }
        );


    observer.observe(title);
}


/* =========================
   FIREBASE CONNECTION TEST
========================= */

console.log(
    "SmileCare Firebase initialized successfully."
);


/* ==================================================
   AI CHATBOT
================================================== */
/* =========================
   AI CHATBOT
========================= */

const AI_WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbx4nulp2Wj4UqFPK5_7XxMqN9S6n2iTXlgg961SjmZyTJoupypVb5r_PgKhogiqPW1J4Q/exec";

const chatHistory = [];

const chatbotToggle =
    document.getElementById("chatbotToggle");

const chatbotBox =
    document.getElementById("chatbotBox");

const chatbotClose =
    document.getElementById("chatbotClose");

const chatInput =
    document.getElementById("chatInput");

const chatSend =
    document.getElementById("chatSend");

const chatMessages =
    document.getElementById("chatMessages");


/* =========================
   OPEN CHATBOT
========================= */

if (chatbotToggle && chatbotBox) {

    chatbotToggle.addEventListener("click", () => {

        chatbotBox.classList.add("active");

        if (chatInput) {
            chatInput.focus();
        }
    });
}


/* =========================
   CLOSE CHATBOT
========================= */

if (chatbotClose && chatbotBox) {

    chatbotClose.addEventListener("click", () => {

        chatbotBox.classList.remove("active");

    });
}


/* =========================
   ADD CHAT MESSAGE
========================= */

function addChatMessage(message, type) {

    if (!chatMessages) return;

    const messageElement =
        document.createElement("div");

    messageElement.className =
        type === "user"
            ? "user-message"
            : "bot-message";

    messageElement.textContent = message;

    chatMessages.appendChild(messageElement);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


/* =========================
   SEND MESSAGE TO AI
========================= */

async function sendChatMessage() {

    if (!chatInput) return;

    const message =
        chatInput.value.trim();

    if (!message) return;


    /* USER MESSAGE */

    addChatMessage(
        message,
        "user"
    );

    chatInput.value = "";


    /* DISABLE SEND */

    if (chatSend) {
        chatSend.disabled = true;
    }


    /* TYPING */

    const typing =
        document.createElement("div");

    typing.className =
        "bot-message";

    typing.id =
        "aiTyping";

    typing.textContent =
        "Typing...";


    if (chatMessages) {

        chatMessages.appendChild(
            typing
        );

        chatMessages.scrollTop =
            chatMessages.scrollHeight;
    }


    try {

        /* CHECK URL */

        if (
            AI_WEB_APP_URL ===
            "PASTE_YOUR_WEB_APP_URL_HERE"
        ) {

            throw new Error(
                "AI Web App URL is not configured."
            );
        }


        /* SEND TO GOOGLE APPS SCRIPT */

        const response =
            await fetch(
                AI_WEB_APP_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({

                        message: message,

                        history: chatHistory

                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "AI server error: " +
                response.status
            );
        }


        const result =
            await response.json();


        console.log(
            "AI Response:",
            result
        );


        /* REMOVE TYPING */

        document
            .getElementById("aiTyping")
            ?.remove();


        /* CHECK AI RESULT */

        if (!result.success) {

            throw new Error(
                result.error ||
                "AI response failed."
            );
        }


        /* SHOW AI RESPONSE */

        addChatMessage(
            result.answer,
            "bot"
        );


        /* SAVE HISTORY */

        chatHistory.push({

            role: "user",
            text: message

        });

        chatHistory.push({

            role: "model",
            text: result.answer

        });


        /* KEEP LAST 10 */

        if (chatHistory.length > 10) {

            chatHistory.splice(
                0,
                chatHistory.length - 10
            );
        }


    } catch (error) {

        console.error(
            "SmileCare AI Error:",
            error
        );


        document
            .getElementById("aiTyping")
            ?.remove();


        addChatMessage(
    "AI Error: " + error.message,
    "bot"
);


    } finally {

        if (chatSend) {

            chatSend.disabled = false;
        }

        chatInput.focus();
    }
}


/* =========================
   SEND BUTTON
========================= */

if (chatSend) {

    chatSend.addEventListener(
        "click",
        sendChatMessage
    );
}


/* =========================
   ENTER KEY
========================= */

if (chatInput) {

    chatInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                sendChatMessage();
            }
        }
    );
}