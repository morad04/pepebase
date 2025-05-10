document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("api-endpoints-container");
  const template = document.getElementById("api-endpoint-template");

  if (!container || !template) {
    console.error("Container or template not found!");
    return;
  }

  apiEndpoints.forEach((endpointData) => {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".api-path").textContent = endpointData.path;
    clone.querySelector(".cost-badge").textContent = endpointData.cost;
    clone.querySelector(".api-description").textContent =
      endpointData.description;
    clone.querySelector(".api-example-return").textContent =
      endpointData.exampleReturn;

    const testButton = clone.querySelector(".test-endpoint-button");
    testButton.dataset.route = endpointData.path;
    testButton.dataset.endpointId = endpointData.id;

    const paramsList = clone.querySelector(".api-parameters-list");
    const testInputsContainer = clone.querySelector(".api-test-inputs");
    const paramsContainer = clone.querySelector(".api-parameters-container");

    const paramDataForButton = {};
    if (endpointData.parameters && endpointData.parameters.length > 0) {
      endpointData.parameters.forEach((param) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<code>${param.name}</code>: ${param.description}`;
        paramsList.appendChild(listItem);

        const inputSection = document.createElement("div");
        inputSection.className = "test-input-section";
        const label = document.createElement("label");
        const inputId = `${endpointData.id}-${param.name}-input`;
        label.setAttribute("for", inputId);
        label.textContent = `${
          param.name.charAt(0).toUpperCase() + param.name.slice(1)
        }:`;
        inputSection.appendChild(label);

        let inputElement;
        if (param.inputType === "textarea") {
          inputElement = document.createElement("textarea");
          inputElement.rows = param.rows || 3;
        } else {
          inputElement = document.createElement("input");
          inputElement.type = param.inputType || "text";
        }
        inputElement.id = inputId;
        inputElement.name = param.name;
        inputElement.placeholder = param.placeholder || "";
        inputSection.appendChild(inputElement);
        testInputsContainer.appendChild(inputSection);
        paramDataForButton[param.name] = inputId; // Store input ID for param name
      });
      testButton.dataset.paramInputIds = JSON.stringify(paramDataForButton);
    } else {
      paramsContainer.style.display = "none";
    }
    container.appendChild(clone);
  });

  initializeCollapsibles();
  initializeTestButtons();
  initializeCopyButtons(); // For quickstart
});

function initializeCollapsibles() {
  // Initialize collapsibles for API endpoints
  const apiEndpointsContainer = document.getElementById(
    "api-endpoints-container"
  );
  if (apiEndpointsContainer) {
    apiEndpointsContainer.addEventListener("click", function (event) {
      const trigger = event.target.closest(".collapsible-trigger");
      if (trigger) {
        trigger.classList.toggle("active");
        const content = trigger.nextElementSibling;
        if (content && content.classList.contains("collapsible-content")) {
          content.classList.toggle("active");
        }
      }
    });
  }

  // Initialize collapsible for Quickstart
  const quickstartTrigger = document.querySelector(
    "header + .card .collapsible-trigger"
  );
  if (quickstartTrigger) {
    quickstartTrigger.addEventListener("click", function () {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      if (content && content.classList.contains("collapsible-content")) {
        content.classList.toggle("active");
      }
    });
  }
}

function initializeTestButtons() {
  const apiEndpointsContainer = document.getElementById(
    "api-endpoints-container"
  );
  if (apiEndpointsContainer) {
    apiEndpointsContainer.addEventListener("click", function (event) {
      const button = event.target.closest(".test-endpoint-button");
      if (!button) return;

      const route = button.dataset.route;
      const paramInputIds = JSON.parse(button.dataset.paramInputIds || "{}");

      const queryParams = new URLSearchParams();
      for (const paramName in paramInputIds) {
        const inputElement = document.getElementById(paramInputIds[paramName]);
        if (inputElement && inputElement.value.trim() !== "") {
          queryParams.set(paramName, inputElement.value);
        }
      }

      let fullUrl = `${API_BASE_URL}${route}`;
      if (queryParams.toString()) {
        fullUrl += `?${queryParams.toString()}`;
      }

      window.open(fullUrl, "_blank");
    });
  }
}

function initializeCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = btn.getAttribute("data-copy-target");
      const codeElem = document.getElementById(targetId);
      if (codeElem) {
        navigator.clipboard
          .writeText(codeElem.innerText)
          .then(() => {
            const originalText = btn.textContent;
            btn.textContent = "Copied!";
            setTimeout(() => {
              btn.textContent = originalText;
            }, 1200);
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
            // You could provide fallback or error message to the user here
          });
      }
    });
  });
}
